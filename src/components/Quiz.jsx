import { useEffect, useRef } from 'react'
import { useQuiz } from '../hooks/useQuiz.js'
import Results from './Results.jsx'

// One multiple-choice question at a time, with feedback after each answer.
// Keyboard: keys 1-4 answer, and focus moves to Next so Enter goes on.
function Quiz({ questions }) {
  const quiz = useQuiz(questions)
  const nextButton = useRef(null)
  const isAnswered = quiz.chosen !== undefined

  // After an answer, the clicked option is disabled and loses focus; give it to Next.
  useEffect(() => {
    if (isAnswered) {
      nextButton.current?.focus()
    }
  }, [isAnswered, quiz.position])

  // Keys 1-4 pick an option, unless the user is typing in the text box.
  useEffect(() => {
    function handleKey(event) {
      if (quiz.isFinished || isAnswered || event.target.closest('textarea, input')) {
        return
      }
      const index = Number(event.key) - 1
      if (index >= 0 && index < quiz.current.options.length) {
        quiz.answer(index)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  })

  // Hooks must run on every draw, so this early return comes after them.
  if (quiz.isFinished) {
    return <Results score={quiz.score} total={quiz.total} onRetest={quiz.retestWrong} />
  }

  const question = quiz.current
  const isCorrect = quiz.chosen === question.answerIndex
  const rightOption = question.options[question.answerIndex]

  function optionClass(i) {
    if (!isAnswered) return ''
    if (i === question.answerIndex) return 'correct'
    if (i === quiz.chosen) return 'wrong'
    return ''
  }

  return (
    <section className="surface">
      <p className="progress">Question {quiz.position} of {quiz.total}</p>
      <h3>{question.question}</h3>
      <div className="options">
        {question.options.map((option, i) => (
          <button key={i} type="button" disabled={isAnswered} onClick={() => quiz.answer(i)} className={optionClass(i)}>
            {option}
          </button>
        ))}
      </div>
      {isAnswered ? (
        <div className="feedback">
          <p>{isCorrect ? 'Correct!' : 'Not quite. The answer is: ' + rightOption}</p>
          <p>{question.explanation}</p>
          <button type="button" ref={nextButton} onClick={quiz.next}>Next</button>
        </div>
      ) : (
        <p className="hint">Tip: press 1-4 to answer, then Enter for the next question.</p>
      )}
    </section>
  )
}

export default Quiz
