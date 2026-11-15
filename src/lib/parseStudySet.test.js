import { describe, expect, test } from 'vitest'
import { parseStudySet } from './parseStudySet.js'
import { sampleSet } from './sampleSet.js'

// Helpers: one valid flashcard, one valid question, and items wrapped as the JSON
// text the AI would send.
const card = (id) => ({ type: 'flashcard', id, front: 'Question ' + id, back: 'Answer ' + id })
const mcq = (id) => ({
  type: 'mcq',
  id,
  question: 'Question ' + id,
  options: ['A', 'B', 'C', 'D'],
  answerIndex: 0,
  explanation: 'Because.',
})
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

  // Each bad item breaks exactly one rule, so each test can only pass for the reason in its name.
  test('skips an item with a missing front', () => {
    const items = [card('1'), { type: 'flashcard', id: '2', back: 'Answer 2' }]
    const result = parseStudySet(setText(items))
    expect(result.ok).toBe(true)
    expect(result.skipped).toBe(1)
    expect(result.data.items).toEqual([card('1')])
  })
  test('skips an item with a missing back', () => {
    const items = [card('1'), { type: 'flashcard', id: '2', front: 'Question 2' }]
    const result = parseStudySet(setText(items))
    expect(result.ok).toBe(true)
    expect(result.skipped).toBe(1)
    expect(result.data.items).toEqual([card('1')])
  })
  test('skips an item with a missing question', () => {
    const items = [card('1'), { ...mcq('2'), question: undefined }]
    const result = parseStudySet(setText(items))
    expect(result.ok).toBe(true)
    expect(result.skipped).toBe(1)
    expect(result.data.items).toEqual([card('1')])
  })
  test('skips an item with a missing options array', () => {
    const items = [card('1'), { ...mcq('2'), options: undefined }]
    const result = parseStudySet(setText(items))
    expect(result.ok).toBe(true)
    expect(result.skipped).toBe(1)
    expect(result.data.items).toEqual([card('1')])
  })
  test('skips an item with a missing answerIndex', () => {
    const items = [card('1'), { ...mcq('2'), answerIndex: undefined }]
    const result = parseStudySet(setText(items))
    expect(result.ok).toBe(true)
    expect(result.skipped).toBe(1)
    expect(result.data.items).toEqual([card('1')])
  })
  test('skips an item whose id repeats an earlier one', () => {
    const items = [card('1'), card('1'), mcq('2')]
    const result = parseStudySet(setText(items))
    expect(result.ok).toBe(true)
    expect(result.skipped).toBe(1)
    expect(result.data.items).toEqual([card('1'), mcq('2')])
  })
})
