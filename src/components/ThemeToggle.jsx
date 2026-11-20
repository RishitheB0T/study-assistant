import { useState } from 'react'

// The light/dark switch. index.html picks the starting theme; this flips it and remembers the choice.
function ThemeToggle() {
  const [theme, setTheme] = useState(document.documentElement.dataset.theme)
  const next = theme === 'dark' ? 'light' : 'dark'

  function handleClick() {
    document.documentElement.dataset.theme = next
    try {
      localStorage.setItem('study-assistant:theme', next)
    } catch {
      // Storage blocked: the switch still works, it just won't be remembered.
    }
    setTheme(next)
  }

  return (
    <button type="button" className="theme-toggle" onClick={handleClick} aria-label={'Switch to ' + next + ' mode'}>
      {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
    </button>
  )
}

export default ThemeToggle
