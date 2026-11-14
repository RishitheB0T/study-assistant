import Flashcard from './components/Flashcard.jsx'
import { sampleSet } from './lib/sampleSet.js'

function App() {
  // Calculated from the set each time, so it never needs its own state.
  const flashcards = sampleSet.items.filter((item) => item.type === 'flashcard')

  return (
    <main>
      <h1>Study Assistant</h1>
      <h2>{sampleSet.title}</h2>
      {flashcards.map((card) => (
        <Flashcard key={card.id} card={card} />
      ))}
    </main>
  )
}

export default App
