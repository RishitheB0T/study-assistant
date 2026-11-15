// Shown when a quiz round ends: the score, and a way to re-test the misses.
function Results({ score, total, onRetest }) {
  const wrongCount = total - score
  function handleRetest() {
    onRetest()
  }
  return (
    <section className="surface">
      <h3>Round complete</h3>
      <p className="score">You scored {score} / {total}.</p>
      {wrongCount > 0 ? (
        <p>
          You missed {wrongCount} question{wrongCount > 1 ? 's' : ''}.{' '}
          <button type="button" className="primary" onClick={handleRetest}>Retest the misses</button>
        </p>
      ) : (
        <p>Perfect score! 🎉</p>
      )}
    </section>
  )
}

export default Results
