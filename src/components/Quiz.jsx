import { useQuiz } from '../hooks/useQuiz.js'
import Results from './Results.jsx'

// One multiple-choice question at a time, with feedback after each answer.
function Quiz({ questions }) {
  const quiz = useQuiz(questions)

  if (quiz.isFinished) {
    return <Results score={quiz.score} total={quiz.total} onRetest={quiz.retestWrong} />
  }

  const question = quiz.current
  const isAnswered = quiz.chosen !== undefined
  const isCorrect = quiz.chosen === question.answerIndex
  const rightOption = question.options[question.answerIndex]

  function optionClass(i) {
    if (!isAnswered) return ''
    if (i === question.answerIndex) return 'correct'
    if (i === quiz.chosen) return 'wrong'
    return ''
  }

  return (
    <section>
      <p>Question {quiz.position} of {quiz.total}</p>
      <h3>{question.question}</h3>
      <div className="options">
        {question.options.map((option, i) => (
          <button key={i} type="button" disabled={isAnswered} onClick={() => quiz.answer(i)} className={optionClass(i)}>
            {option}
          </button>
        ))}
      </div>
      {isAnswered ? (
        <div>
          <p>{isCorrect ? 'Correct!' : 'Not quite. The answer is: ' + rightOption}</p>
          <p>{question.explanation}</p>
          <button type="button" onClick={quiz.next}>Next</button>
        </div>
      ) : null}
    </section>
  )
}

export default Quiz
