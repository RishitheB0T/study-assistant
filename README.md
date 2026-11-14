# Study Assistant

A React app that turns pasted notes or a topic into flashcards and a quiz.

An AI model returns the study material as structured JSON (data written as
text). Before anything reaches the screen, the app checks that data against a
fixed set of rules. The user only ever sees clean, interactive cards and
questions, never raw model text.

> **Status:** the study screens work with built-in sample data. The AI model
> is not connected yet.

## Done so far

- Project setup: Vite dev server with React, and a `.gitignore` that keeps
  dependencies, build output, secrets (`.env` files) and local-only files out
  of version control.
- Text box for notes or a topic, with a 4,000-character limit and a live
  counter. Generate stays disabled while the box is empty or too long.
- Empty state before anything is generated.
- Flashcards that flip between question and answer on click (or Enter/Space).
- Multiple-choice quiz, one question at a time: answers lock once picked, the
  right option turns green and a wrong pick red, and an explanation follows.
- Results screen with the score, and a button to re-test only the questions
  answered wrong.
- Quiz logic kept in one reducer (`useReducer`), so all the rules live in one
  plain function.
- Plain CSS, mobile first: one readable column that fits a phone screen.

## Tech stack

- **React 19**: builds the user interface from function components and hooks.
- **Vite 8**: development server with instant reload, and build tool.
- **@vitejs/plugin-react**: lets Vite understand JSX (HTML-like tags in JavaScript).

## Getting started

Requires **Node.js 20.19 or newer** (Vite 8 needs it).

```bash
git clone https://github.com/RishitheB0T/study-assistant.git
cd study-assistant
npm install
npm run dev
```

Then open http://localhost:5173. Edits to files in `src/` show up in the page
within about a second, without a manual refresh.

## Project files

```
index.html          The one HTML page; React draws the app inside <div id="root">
vite.config.js      Vite settings: turns on the React plugin
src/main.jsx        Starting point: hands the root element to React
src/index.css       Styles for the whole app
src/App.jsx         The top-level component: holds the current study set
src/components/     TopicForm, Flashcard, Quiz, Results
src/hooks/          useQuiz: the quiz rules (reducer) and the values the screen needs
src/lib/            sampleSet: hand-written study data in the shape the AI must return
docs/               Learning log and tool notes
package.json        Project name, scripts and dependencies
package-lock.json   Exact version of every installed package
.gitignore          Files Git must never track
```

## Known limitations

- The AI model is not connected yet. Every topic returns the same built-in
  sample set (Photosynthesis).
- Basic styling only: no dark mode, and the phone layout has not been tested
  on real devices yet.
- After answering a quiz question, keyboard focus is not moved to the Next
  button.
- Nothing is saved: refreshing the page clears the set and the quiz progress.
- No favicon, so the browser logs a harmless 404 for `/favicon.ico`.

## How this was built (AI usage)

I built this project together with an AI coding assistant. I chose the idea
and the tech stack, planned the build with the assistant's help, and directed
every step. We code along, with me writing parts of each piece
and the assistant writing and reviewing the rest. I review and test everything,
and make sure I can explain, debug and extend all of it.

## Time spent

About 1.5 hours so far, covering setup and the study screens with sample data
(still in progress).
