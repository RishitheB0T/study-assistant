import { ItemSchema, StudySetShapeSchema } from './schema.js'

// THE CHECKPOINT. Everything from outside our code (the AI's answer, a saved
// session, an imported file) passes through here before any component sees it.
// It never throws: it returns { ok: true, data, skipped } or { ok: false, reason }.
export function parseStudySet(text) {
  if (typeof text !== 'string' || text.trim() === '') {
    return { ok: false, reason: 'empty' }
  }

  let raw
  try {
    raw = JSON.parse(text)
  } catch {
    return { ok: false, reason: 'malformed' }
  }

  const shape = StudySetShapeSchema.safeParse(raw)
  if (!shape.success) {
    return { ok: false, reason: 'wrong_shape' }
  }

  // Keep every good item. Bad items and repeated ids are skipped, not fatal.
  const items = []
  const seenIds = new Set()
  for (const candidate of shape.data.items) {
    const item = ItemSchema.safeParse(candidate)
    if (item.success && !seenIds.has(item.data.id)) {
      seenIds.add(item.data.id)
      items.push(item.data)
    }
  }

  if (items.length === 0) {
    return { ok: false, reason: 'empty' }
  }
  const skipped = shape.data.items.length - items.length
  return { ok: true, data: { title: shape.data.title, items }, skipped }
}
