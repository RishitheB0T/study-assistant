# Learning log

One entry per finished step. Written for revising before the interview.

## Step 1.0 — Set up   (2026-11-15; steps 1.0 and 1.1 together took about 1.5 hours)

**What we built:** an empty React app that shows the heading "Study
Assistant", served by Vite, in a public GitHub repo. Files: `.gitignore`,
`package.json`, `package-lock.json`, `vite.config.js`, `index.html`,
`src/main.jsx`, `src/App.jsx`, `README.md`.

**Ideas I learned (plain words, then the proper name):**

- A file listing what Git must never track: `.gitignore`. A `!` line makes an
  exception (`!.env.example`).
- Git works on the folder the terminal is in. Running `git init` in the home
  folder created a repo there by mistake. Check the prompt path first.
- A project's name, commands and libraries live in one file: `package.json`.
  Exact versions of everything live in `package-lock.json`.
- Code the browser runs: dependencies (`react`, `react-dom`). Tools used only
  while building: devDependencies (`vite`, `@vitejs/plugin-react`).
- `^19.3.1` means "19.3.1 or any newer 19.x": the caret range.
- Taking a file's main export needs no braces: a default import. Taking one
  export by its name needs braces: a named import.
- HTML-like tags inside JavaScript: JSX. Vite's React plugin turns it into
  plain JavaScript.
- The whole app lives inside one empty box, `<div id="root">`. `createRoot`
  hands that box to React, and `render` draws `<App />` in it.
- A function that returns what appears on screen: a component. Its name starts
  with a capital letter so React can tell it apart from HTML tags.
- Extra checks that run only during development: `StrictMode`.
- Only the changed component updates when a file is saved: Fast Refresh.

**Why we did it this way, and what the alternative was:**

- Files written by hand instead of `npm create vite`. The generator offers to
  delete the files already in the folder, and it adds about
  10 extra files that I would have had to learn or delete.
- Folders are created only when their first file arrives, because Git cannot
  store empty folders. The alternative is placeholder `.gitkeep` files.
- `.gitignore` was committed before anything else, so no secret or local file
  could slip into the first commit.

**Interview questions and my answers:**

- *Why is Vite a devDependency but React is not?* Vite only builds and serves
  files while I develop; the browser never runs it. React runs in the user's
  browser, so it ships with the app.
- *Someone clones the repo. How do they get the same versions as you?* They
  run `npm install`, and `package-lock.json` pins the exact versions.
- *What does the viewport meta tag do?* Without it, a phone draws the page
  about 980px wide and shrinks it, so the text is tiny.
- *What happens if `index.html` has `id="app"` but `main.jsx` looks for
  `root`?* `getElementById` returns `null`, `createRoot` throws an error, and
  the page stays blank.
- *Why does `App` start with a capital letter?* React treats lowercase tags as
  HTML elements and capitalised names as components.

**Still shaky:** —

## Step 1.1 — Screens with sample data   (2026-11-15)

**What we built:** every study screen, running on hand-written sample data:
`TopicForm` (text box, 4,000-character counter, Generate), `Flashcard` (flips
on click), `Quiz` (one question at a time, coloured feedback), `Results`
(score and "Retest the misses"), the quiz rules in `useQuiz.js`, and basic CSS.
I wrote the `Results` re-test button and the option colouring (`optionClass`).

**Ideas I learned (plain words, then the proper name):**

- Inputs passed into a component, like method arguments: props.
- Something a component must remember between redraws: state, made with
  `useState`. Calling the setter makes React run the component again.
- A function handed to a child so the child can report back: a callback prop
  (`onGenerate`, `onRetest`). The parent and child can use different names
  for the same function.
- Keeping state in the closest parent that every part needing it can reach:
  lifting state up (`studySet` lives in `App`).
- A form field whose content lives in state: a controlled input.
- Stopping the browser's default page reload on submit: `event.preventDefault()`.
- Turning a list into components: `.map`, with a unique, stable `key` each.
- An invisible wrapper for several elements: a fragment, `<> </>`.
- One object for related state and one function for all the rules: a reducer,
  used with `useReducer`. Messages to it are actions; sending one is `dispatch`.
- Never change state in place; copy it: `{ ...state, index: 1 }` (spread).
- Our own function that uses hooks: a custom hook (`useQuiz`).
- Values that can be worked out (score, finished) are calculated, not stored.
- React's name for the HTML `class` attribute: `className`.
- CSS: a more specific selector wins (a class beats a tag); mobile first means
  the base styles fit a phone and wider screens just get more room.

**Why we did it this way, and what the alternative was:**

- Sample data first, so every screen could be built and tested before the AI
  exists. The sample has the exact shape the AI must return.
- `useReducer` for the quiz instead of three `useState`s, so the rules
  (no changing an answer, no skipping, re-test builds a new round) live in one
  plain function that can be run and tested without React.
- The text box warns when it is too long instead of using `maxLength`, which
  would silently cut pasted notes.

**Interview questions and my answers:**

- *Walk me through what happens when I click Generate.* The form submits,
  `handleSubmit` stops the reload and calls `onGenerate(text)`, which is App's
  `handleGenerate`. That calls `setStudySet`, React runs `App` again, and the
  title, cards and quiz appear.
- *Why does each flashcard remember its own flip?* React keeps separate state
  for every component on screen, matched by position and `key`.
- *Why `onClick={() => quiz.answer(i)}` but `onClick={quiz.next}`?* `answer`
  needs a value, so it is wrapped in an arrow that passes `i` later; `next`
  needs none, so the function itself is handed over.
- *Why does the reducer return a new object instead of changing the old one?*
  React compares objects to decide whether to redraw; the same object means
  "nothing changed".
- *Why is the score not stored?* It can be worked out from the questions and
  answers; a stored copy could get out of sync.

**Still shaky:** following which function calls which across components (we
traced every click line by line; worth revising).
