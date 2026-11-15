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
export function useStudySet() {
  const [status, setStatus] = useState('idle')
  const [studySet, setStudySet] = useState(null)
  const [skipped, setSkipped] = useState(0)
  const [error, setError] = useState(null)
  const latestRequest = useRef(0) // number of the newest request
  const controller = useRef(null) // AbortController of the newest request

  async function generate(notes) {
    controller.current?.abort()
    latestRequest.current += 1
    const requestNumber = latestRequest.current
    controller.current = new AbortController()
    setStatus('loading')

    let reply
    try {
      reply = await requestStudySet(notes, controller.current.signal)
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
    setStatus('success')
  }

  function showError(details) {
    setError(details)
    setStatus('error')
  }

  return { status, studySet, skipped, error, generate }
}
