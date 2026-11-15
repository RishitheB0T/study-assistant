// The only place the frontend talks to the server.
// Always returns the server's shape: { ok: true, text } or { ok: false, error: { code, message } }.
// The one thing it lets through is an AbortError, so the caller can tell "cancelled" from "failed".
// chaos (debug only) asks the server for a fake bad reply, for example 'malformed'.
export async function requestStudySet(notes, signal, chaos) {
  const url = chaos ? '/api/generate?chaos=' + encodeURIComponent(chaos) : '/api/generate'
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes }),
      signal,
    })
    const reply = await response.json()
    if (typeof reply?.ok !== 'boolean') {
      return failure('BAD_REPLY', 'The server sent an unexpected reply. Please try again.')
    }
    return reply
  } catch (error) {
    if (error.name === 'AbortError') {
      throw error
    }
    // No reply at all (server off, network down), or a reply that is not JSON.
    return failure('NETWORK', "Can't reach the server. Check that it is running, then try again.")
  }
}

function failure(code, message) {
  return { ok: false, error: { code, message } }
}
