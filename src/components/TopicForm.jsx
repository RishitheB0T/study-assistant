import { useState } from 'react'

const MAX_LENGTH = 4000

// The free-form text box. It only collects text; App decides what to do with it.
// isBusy: a request is running, so Generate waits (the user can Cancel first).
function TopicForm({ onGenerate, isBusy }) {
  const [text, setText] = useState('')
  const isEmpty = text.trim() === ''
  const isTooLong = text.length > MAX_LENGTH

  function handleSubmit(event) {
    event.preventDefault()
    onGenerate(text.trim())
  }

  return (
    <form className="surface" onSubmit={handleSubmit}>
      <label htmlFor="notes">Paste your notes or type a topic</label>
      <textarea
        id="notes"
        rows={8}
        placeholder="Paste a paragraph of your notes, or type a topic such as “the water cycle”."
        value={text}
        onChange={(event) => setText(event.target.value)}
      />
      <p className={isTooLong ? 'counter over' : 'counter'}>
        {text.length} / {MAX_LENGTH}
        {isTooLong ? ' (too long, please shorten it)' : ''}
      </p>
      <button type="submit" className="primary" disabled={isEmpty || isTooLong || isBusy}>
        Generate
      </button>
    </form>
  )
}

export default TopicForm
