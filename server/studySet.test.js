import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { parseStudySet } from '../src/lib/parseStudySet.js'
import { generateStudySet } from './studySet.js'

// A fake Gemini reply: what fetch resolves to.
function geminiReply(status, body, headers = {}) {
  return new Response(JSON.stringify(body), { status, headers })
}

const answer = '{"title":"Plants","items":[]}'
const goodReply = {
  candidates: [{ content: { parts: [{ text: 'thinking...', thought: true }, { text: answer }] } }],
  usageMetadata: { totalTokenCount: 42 },
}

beforeEach(() => {
  vi.stubEnv('GEMINI_API_KEY', 'test-key')
  vi.stubGlobal('fetch', vi.fn())
  vi.spyOn(console, 'warn').mockImplementation(() => {})
})

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  vi.useRealTimers()
})

describe('bad input never reaches Gemini', () => {
  test.each([
    ['missing notes', undefined],
    ['blank notes', '   '],
    ['notes that are not text', 123],
  ])('%s', async (_label, notes) => {
    const result = await generateStudySet({ notes })
    expect(result.status).toBe(400)
    expect(result.body).toEqual({
      ok: false,
      error: { code: 'BAD_INPUT', message: 'Please enter some notes or a topic.' },
    })
    expect(fetch).not.toHaveBeenCalled()
  })

  test('notes longer than 4,000 characters', async () => {
    const result = await generateStudySet({ notes: 'x'.repeat(4001) })
    expect(result.status).toBe(400)
    expect(result.body.error.message).toBe('Notes must be 4,000 characters or fewer.')
    expect(fetch).not.toHaveBeenCalled()
  })

  test('an unknown chaos mode', async () => {
    const result = await generateStudySet({ notes: 'Plants', chaos: 'nonsense' })
    expect(result.status).toBe(400)
    expect(result.body.error.code).toBe('BAD_INPUT')
    expect(result.body.error.message).toContain('Unknown chaos mode')
  })

  test('blank notes are rejected even in chaos mode', async () => {
    const result = await generateStudySet({ notes: '', chaos: 'fail' })
    expect(result.body.error.code).toBe('BAD_INPUT')
  })
})

describe('chaos modes return fake replies without calling Gemini', () => {
  // What the frontend checkpoint makes of each fake reply.
  test.each([
    ['malformed', 'malformed'],
    ['wrong_shape', 'wrong_shape'],
    ['empty', 'empty'],
  ])('%s is rejected by the checkpoint as %s', async (mode, reason) => {
    const result = await generateStudySet({ notes: 'Plants', chaos: mode })
    expect(result.status).toBe(200)
    expect(result.body.ok).toBe(true)
    expect(parseStudySet(result.body.text)).toEqual({ ok: false, reason })
    expect(fetch).not.toHaveBeenCalled()
  })

  test('partial keeps 2 items and skips 2', async () => {
    const result = await generateStudySet({ notes: 'Plants', chaos: 'partial' })
    const checked = parseStudySet(result.body.text)
    expect(checked.ok).toBe(true)
    expect(checked.data.items).toHaveLength(2)
    expect(checked.skipped).toBe(2)
  })

  test('slow answers with a valid set after 8 seconds', async () => {
    vi.useFakeTimers()
    let result = null
    generateStudySet({ notes: 'Plants', chaos: 'slow' }).then((value) => (result = value))

    await vi.advanceTimersByTimeAsync(7999)
    expect(result).toBe(null)
    await vi.advanceTimersByTimeAsync(1)
    expect(result.status).toBe(200)
    expect(parseStudySet(result.body.text).ok).toBe(true)
  })

  test('fail is a 502 PROVIDER_ERROR', async () => {
    const result = await generateStudySet({ notes: 'Plants', chaos: 'fail' })
    expect(result.status).toBe(502)
    expect(result.body.error.code).toBe('PROVIDER_ERROR')
  })

  test('chaos modes work without an API key', async () => {
    vi.stubEnv('GEMINI_API_KEY', '')
    const result = await generateStudySet({ notes: 'Plants', chaos: 'empty' })
    expect(result.status).toBe(200)
  })
})

describe('talking to Gemini', () => {
  test('without a key the reply is NO_KEY and Gemini is not called', async () => {
    vi.stubEnv('GEMINI_API_KEY', '')
    const result = await generateStudySet({ notes: 'Plants' })
    expect(result.status).toBe(500)
    expect(result.body.error.code).toBe('NO_KEY')
    expect(fetch).not.toHaveBeenCalled()
  })

  test('a good reply returns the answer text without the thought parts', async () => {
    fetch.mockResolvedValue(geminiReply(200, goodReply))
    const result = await generateStudySet({ notes: '  Plants make food  ' })
    expect(result).toEqual({ status: 200, headers: {}, body: { ok: true, text: answer } })
  })

  test('the request carries the key in a header, the trimmed notes and the schema', async () => {
    fetch.mockResolvedValue(geminiReply(200, goodReply))
    await generateStudySet({ notes: '  Plants make food  ' })

    const [url, options] = fetch.mock.calls[0]
    const sent = JSON.parse(options.body)
    expect(url).toContain('gemini-3.5-flash-lite:generateContent')
    expect(url).not.toContain('test-key')
    expect(options.headers['x-goog-api-key']).toBe('test-key')
    expect(sent.contents[0].parts[0].text).toBe('Plants make food')
    expect(sent.generationConfig.responseMimeType).toBe('application/json')
    expect(sent.generationConfig.responseJsonSchema.required).toEqual(['title', 'items'])
  })

  test('a timeout becomes TIMEOUT (504)', async () => {
    fetch.mockRejectedValue(new DOMException('The operation timed out.', 'TimeoutError'))
    const result = await generateStudySet({ notes: 'Plants' })
    expect(result.status).toBe(504)
    expect(result.body.error.code).toBe('TIMEOUT')
  })

  test('a network failure becomes PROVIDER_ERROR (502)', async () => {
    fetch.mockRejectedValue(new TypeError('fetch failed'))
    const result = await generateStudySet({ notes: 'Plants' })
    expect(result.status).toBe(502)
    expect(result.body.error.message).toBe('Could not reach the AI service. Please try again.')
  })

  test('429 becomes RATE_LIMITED and passes Retry-After on', async () => {
    fetch.mockResolvedValue(geminiReply(429, { error: {} }, { 'retry-after': '7' }))
    const result = await generateStudySet({ notes: 'Plants' })
    expect(result.status).toBe(429)
    expect(result.body.error.code).toBe('RATE_LIMITED')
    expect(result.headers).toEqual({ 'Retry-After': '7' })
  })

  test('a rejected key (400) says to check the key', async () => {
    fetch.mockResolvedValue(geminiReply(400, { error: { message: 'API key not valid' } }))
    const result = await generateStudySet({ notes: 'Plants' })
    expect(result.status).toBe(502)
    expect(result.body.error.message).toContain('GEMINI_API_KEY')
  })

  test('503 becomes a plain PROVIDER_ERROR', async () => {
    fetch.mockResolvedValue(geminiReply(503, { error: {} }))
    const result = await generateStudySet({ notes: 'Plants' })
    expect(result.status).toBe(502)
    expect(result.body.error.message).toBe('The AI service had a problem. Please try again.')
  })

  test('a blocked prompt names the reason', async () => {
    fetch.mockResolvedValue(geminiReply(200, { promptFeedback: { blockReason: 'SAFETY' } }))
    const result = await generateStudySet({ notes: 'Plants' })
    expect(result.status).toBe(502)
    expect(result.body.error.message).toBe('The AI declined this input (SAFETY). Try rephrasing it.')
  })
})
