import { useState } from 'react'
import Flashcard from './components/Flashcard.jsx'
import Quiz from './components/Quiz.jsx'
import TopicForm from './components/TopicForm.jsx'
import { sampleSet } from './lib/sampleSet.js'

function App() {
  // null means "nothing generated yet", which is the empty state.
  const [studySet, setStudySet] = useState(null)

  // Fake for now: `text` is not used yet and every topic gives the sample set.
  // Step 1.4 sends `text` to the AI here.
  function handleGenerate(text) {
    setStudySet(sampleSet)
  }

  const flashcards =
    studySet === null ? [] : studySet.items.filter((item) => item.type === 'flashcard')
  const questions =
    studySet === null ? [] : studySet.items.filter((item) => item.type === 'mcq')

  return (
    <main>
      <h1>Study Assistant</h1>
      <TopicForm onGenerate={handleGenerate} />
      {studySet === null ? (
        <p>Paste your notes above and press Generate to get flashcards and a quiz.</p>
      ) : (
        <>
          <h2>{studySet.title}</h2>
          {flashcards.map((card) => (
            <Flashcard key={card.id} card={card} />
          ))}
          <Quiz questions={questions} />
        </>
      )}
    </main>
  )
}

export default App
