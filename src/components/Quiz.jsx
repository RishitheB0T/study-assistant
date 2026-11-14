import { useQuiz } from '../hooks/useQuiz.js'

// One multiple-choice question at a time, with feedback after each answer.
function Quiz({ questions }) {
  const quiz = useQuiz(questions)

  if (quiz.isFinished) {
    return <p>You scored {quiz.score} / {quiz.total}.</p>
  }

  const question = quiz.current
  const isAnswered = quiz.chosen !== undefined
  const isCorrect = quiz.chosen === question.answerIndex
  const rightOption = question.options[question.answerIndex]

  return (
    <section>
      <p>Question {quiz.position} of {quiz.total}</p>
      <h3>{question.question}</h3>
      {question.options.map((option, i) => (
        <button key={i} type="button" disabled={isAnswered} onClick={() => quiz.answer(i)}>
          {option}
        </button>
      ))}
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
