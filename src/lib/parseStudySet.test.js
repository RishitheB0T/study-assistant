import { describe, expect, test } from 'vitest'
import { parseStudySet } from './parseStudySet.js'
import { sampleSet } from './sampleSet.js'

// Helpers: one valid flashcard, and items wrapped as the JSON text the AI would send.
const card = (id) => ({ type: 'flashcard', id, front: 'Question ' + id, back: 'Answer ' + id })
const setText = (items) => JSON.stringify({ title: 'Plants', items })

describe('parseStudySet', () => {
  test('accepts a valid set and skips nothing', () => {
    const result = parseStudySet(JSON.stringify(sampleSet))
    expect(result.ok).toBe(true)
    expect(result.skipped).toBe(0)
    expect(result.data).toEqual(sampleSet)
  })

  test('reports broken JSON as malformed', () => {
    expect(parseStudySet('{"title":"Plants","items":[')).toEqual({ ok: false, reason: 'malformed' })
  })

  test('reports empty or blank text as empty', () => {
    expect(parseStudySet('')).toEqual({ ok: false, reason: 'empty' })
    expect(parseStudySet('   ')).toEqual({ ok: false, reason: 'empty' })
  })

  test('reports JSON in the wrong shape as wrong_shape', () => {
    expect(parseStudySet('[1, 2, 3]')).toEqual({ ok: false, reason: 'wrong_shape' })
    const wrongNames = JSON.stringify({ name: 'Plants', cards: [card('1')] })
    expect(parseStudySet(wrongNames)).toEqual({ ok: false, reason: 'wrong_shape' })
  })

  // YOUR PART: replace each test.todo with a real test (see the instructions in chat).
  test.todo('keeps the good cards and skips one bad card')
  test.todo('skips an item whose id repeats an earlier one')
})
