import { useState } from 'react'
import DebugPanel from './components/DebugPanel.jsx'
import Flashcard from './components/Flashcard.jsx'
import Quiz from './components/Quiz.jsx'
import StatusView from './components/StatusView.jsx'
import ThemeToggle from './components/ThemeToggle.jsx'
import TopicForm from './components/TopicForm.jsx'
import { useStudySet } from './hooks/useStudySet.js'

// ?debug=1 in the page address shows the debug panel.
const isDebug = new URLSearchParams(window.location.search).get('debug') === '1'

function App() {
  const [chaos, setChaos] = useState('') // '' = real Gemini
  const { status, studySet, skipped, error, receivedCount, generate, cancel, retry } =
    useStudySet(chaos)

  const flashcards =
    studySet === null ? [] : studySet.items.filter((item) => item.type === 'flashcard')
  const questions =
    studySet === null ? [] : studySet.items.filter((item) => item.type === 'mcq')

  return (
    <main>
      <div className="top">
        <h1>Study Assistant</h1>
        <ThemeToggle />
      </div>
      <p className="tagline">Turn your notes into flashcards and a quiz.</p>
      {isDebug ? <DebugPanel mode={chaos} onChange={setChaos} /> : null}
      <TopicForm onGenerate={generate} isBusy={status === 'loading'} />
      <StatusView
        status={status}
        error={error}
        skipped={skipped}
        onCancel={cancel}
        onRetry={retry}
      />
      {studySet === null && status === 'idle' ? (
        <div className="empty">
          <p>Paste your notes above and press Generate. You will get:</p>
          <ol className="preview">
            <li><strong>Flashcards</strong> to flip between question and answer</li>
            <li><strong>A quiz</strong> with instant feedback and explanations</li>
            <li><strong>A re-test</strong> of only the questions you got wrong</li>
          </ol>
        </div>
      ) : null}
      {studySet !== null ? (
        // A new key for every new set: React rebuilds the cards and the quiz from scratch.
        <section key={receivedCount} className="study-set">
          <h2>{studySet.title}</h2>
          {flashcards.map((card) => (
            <Flashcard key={card.id} card={card} />
          ))}
          {questions.length > 0 ? <Quiz questions={questions} /> : null}
        </section>
      ) : null}
    </main>
  )
}

export default App
