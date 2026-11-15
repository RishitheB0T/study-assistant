import { parseStudySet } from './parseStudySet.js'

// One key in the browser's localStorage, holding the last good set as JSON text.
const KEY = 'study-assistant:last-set'

// Saved data is outside data too, so it goes back through the checkpoint.
// Returns the checked set, or null when there is nothing usable.
export function loadStudySet() {
  try {
    const text = localStorage.getItem(KEY)
    if (text === null) {
      return null
    }
    const result = parseStudySet(text)
    if (result.ok) {
      return result.data
    }
    localStorage.removeItem(KEY) // unusable (old shape, edited, corrupted): forget it
    return null
  } catch {
    return null // storage is blocked (for example some private modes): start empty
  }
}
// Saves the last good set as JSON text. Never throws.
export function saveStudySet(studySet) {
  try {
    localStorage.setItem(KEY, JSON.stringify(studySet))
  } catch {
    // Storage is full or blocked: the app keeps working, it just won't remember this set.
  }
}
