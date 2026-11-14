import Flashcard from './components/Flashcard.jsx'
import { sampleSet } from './lib/sampleSet.js'

function App() {
  return (
    <main>
      <h1>Study Assistant</h1>
      <Flashcard card={sampleSet.items[0]} />
    </main>
  )
}

export default App
