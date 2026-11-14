import { useReducer } from 'react'

// All quiz changes go through this one function, so the rules live in one place.
// State: { questions, index, answers }. answers[i] is the option picked for questions[i].
export function quizReducer(state, action) {
  switch (action.type) {
    case 'answer': {
      // An answer cannot be changed once it is picked.
      if (state.answers[state.index] !== undefined) {
        return state
      }
      const answers = [...state.answers]
      answers[state.index] = action.optionIndex
      return { ...state, answers }
    }
    case 'next':
      // Moving on is only allowed after the current question is answered.
      if (state.answers[state.index] === undefined) {
        return state
      }
      return { ...state, index: state.index + 1 }
    case 'retestWrong': {
      const wrong = state.questions.filter(
        (question, i) => state.answers[i] !== question.answerIndex,
      )
      return { questions: wrong, index: 0, answers: [] }
    }
    default:
      return state
  }
}

// Gives the quiz screen everything it needs. Only the reducer state is stored;
// the rest is worked out from it on every redraw.
export function useQuiz(questions) {
  const [state, dispatch] = useReducer(quizReducer, {
    questions,
    index: 0,
    answers: [],
  })

  const score = state.questions.filter(
    (question, i) => state.answers[i] === question.answerIndex,
  ).length

  return {
    current: state.questions[state.index],
    chosen: state.answers[state.index],
    position: state.index + 1,
    total: state.questions.length,
    isFinished: state.index >= state.questions.length,
    score,
    answer: (optionIndex) => dispatch({ type: 'answer', optionIndex }),
    next: () => dispatch({ type: 'next' }),
    retestWrong: () => dispatch({ type: 'retestWrong' }),
  }
}
