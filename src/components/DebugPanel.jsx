// '' means "off": a real Gemini answer. The others are the server's ?chaos= modes.
const MODES = ['', 'malformed', 'wrong_shape', 'empty', 'partial', 'slow', 'fail']

// Only shown with ?debug=1 in the address: pick a fake bad reply to see how the app copes.
function DebugPanel({ mode, onChange }) {
  return (
    <section className="debug-panel" aria-label="Debug options">
      <h2>Debug</h2>
      <p>Next Generate returns: {mode === '' ? 'a real Gemini answer' : 'the "' + mode + '" fake reply'}</p>
      {MODES.map((m) => (
        <label key={m}>
          <input type="radio" name="debug-mode" value={m} checked={mode === m} onChange={(e) => onChange(e.target.value)} />
          {m === '' ? 'real Gemini' : m}
        </label>
      ))}
    </section>
  )
}

export default DebugPanel
