import { useEffect, useState } from 'react'

// Everything about the current request that is not the study set itself.
function StatusView({ status, error, skipped, onCancel, onRetry }) {
  if (status === 'loading') {
    return <Loading onCancel={onCancel} />
  }
  if (status === 'error') {
    return (
      <div role="alert">
        <p>{error.message}</p>
        <button type="button" onClick={onRetry}>
          Retry
        </button>
      </div>
    )
  }
  if (status === 'success' && skipped > 0) {
    const message =
      skipped === 1
        ? '1 item was skipped because it was incomplete.'
        : skipped + ' items were skipped because they were incomplete.'
    return <p role="status">{message}</p>
  }
  return null
}

// Exists only while a request is running, so its 5-second timer always starts fresh.
function Loading({ onCancel }) {
  const [isSlow, setIsSlow] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsSlow(true), 5000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div role="status">
      <p>{isSlow ? 'Still working… this can take up to 20 seconds.' : 'Generating your study set…'}</p>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </div>
  )
}

export default StatusView
