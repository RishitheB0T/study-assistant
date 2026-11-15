// The Vercel Function behind POST /api/generate. Vercel turns every file in /api
// into a function; this one only translates between HTTP and generateStudySet.
import { generateStudySet, NOT_JSON } from '../server/studySet.js'

export default {
  async fetch(request) {
    if (request.method !== 'POST') {
      const error = { code: 'BAD_INPUT', message: 'Use POST for this address.' }
      return Response.json({ ok: false, error }, { status: 405, headers: { Allow: 'POST' } })
    }

    let payload
    try {
      payload = await request.json()
    } catch {
      return reply(NOT_JSON)
    }
    const chaos = new URL(request.url).searchParams.get('chaos')
    return reply(await generateStudySet({ notes: payload?.notes, chaos }))
  },
}

function reply({ status, headers, body }) {
  return Response.json(body, { status, headers })
}
