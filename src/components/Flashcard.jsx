import { useState } from 'react'

// One card: shows the front, and flips to the back when clicked.
function Flashcard({ card }) {
  const [isFlipped, setIsFlipped] = useState(false)

  function handleClick() {
    setIsFlipped(!isFlipped)
  }

  return (
    <button type="button" className={isFlipped ? 'flashcard flipped' : 'flashcard'} onClick={handleClick}>
      <span className="side">{isFlipped ? 'Answer' : 'Question'}</span>
      {isFlipped ? card.back : card.front}
    </button>
  )
}

export default Flashcard
