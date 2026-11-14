import { useState } from 'react'
import Flashcard from './components/Flashcard.jsx'
import TopicForm from './components/TopicForm.jsx'
import { sampleSet } from './lib/sampleSet.js'

function App() {
  // null means "nothing generated yet", which is the empty state.
  const [studySet, setStudySet] = useState(null)

  // Fake for now: every topic gives the sample set. Step 1.4 calls the AI here.
  function handleGenerate() {
    setStudySet(sampleSet)
  }

  const flashcards =
    studySet === null ? [] : studySet.items.filter((item) => item.type === 'flashcard')

  return (
    <main>
      <h1>Study Assistant</h1>
      <TopicForm onGenerate={handleGenerate} />
      {studySet === null ? (
        <p>Paste your notes above and press Generate to get flashcards and a quiz.</p>
      ) : (
        <h2>{studySet.title}</h2>
      )}
      {flashcards.map((card) => (
        <Flashcard key={card.id} card={card} />
      ))}
    </main>
  )
}

export default App
