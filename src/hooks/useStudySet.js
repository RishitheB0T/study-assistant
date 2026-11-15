import { useRef, useState } from 'react'
import { requestStudySet } from '../lib/api.js'
import { parseStudySet } from '../lib/parseStudySet.js'

// What the user reads when the checkpoint rejects the AI's answer.
const CHECKPOINT_MESSAGES = {
  empty: 'The AI returned no usable cards. Try adding more detail to your notes.',
  malformed: "The AI's answer was cut off or garbled. Please try again.",
  wrong_shape: 'The AI answered in an unexpected format. Please try again.',
}

// One request at a time. status is one word: 'idle' | 'loading' | 'success' | 'error'.
// chaos: the debug mode chosen right now ('' = real Gemini). Retry also uses the current one.
export function useStudySet(chaos) {
  const [status, setStatus] = useState('idle')
  const [studySet, setStudySet] = useState(null)
  const [skipped, setSkipped] = useState(0)
  const [error, setError] = useState(null)
  const [receivedCount, setReceivedCount] = useState(0) // goes up each time a new set arrives
  const latestRequest = useRef(0) // number of the newest request
  const controller = useRef(null) // AbortController of the newest request
  const lastNotes = useRef('') // notes of the newest request, for Retry

  async function generate(notes) {
    controller.current?.abort()
    latestRequest.current += 1
    const requestNumber = latestRequest.current
    controller.current = new AbortController()
    lastNotes.current = notes
    setError(null)
    setStatus('loading')

    let reply
    try {
      reply = await requestStudySet(notes, controller.current.signal, chaos)
    } catch {
      return // aborted: Cancel or a newer request took over
    }
    if (requestNumber !== latestRequest.current) {
      return // stale: a newer request started while this one was on its way
    }

    if (!reply.ok) {
      showError(reply.error)
      return
    }
    const result = parseStudySet(reply.text) // THE CHECKPOINT
    if (!result.ok) {
      showError({ code: result.reason, message: CHECKPOINT_MESSAGES[result.reason] })
      return
    }
    setStudySet(result.data)
    setSkipped(result.skipped)
    setReceivedCount((count) => count + 1)
    setStatus('success')
  }

  function showError(details) {
    setError(details)
    setStatus('error')
  }

  // Stop waiting. Raising the number also ignores an answer that is already arriving.
  function cancel() {
    controller.current?.abort()
    latestRequest.current += 1
    setStatus(studySet ? 'success' : 'idle')
  }

  function retry() {
    generate(lastNotes.current)
  }

  return { status, studySet, skipped, error, receivedCount, generate, cancel, retry }
}
