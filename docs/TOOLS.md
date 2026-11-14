# Tools

One card per tool or library: what it is, and why this project uses it.

## npm and npm scripts

**What it is:** Node's package manager. It downloads libraries and runs named
commands saved in `package.json`.

**Problem it solves:** without it, every library would have to be downloaded by
hand, along with every library *those* libraries need, at matching versions.

**How we use it here:** `npm install` reads `package.json` and
`package-lock.json` and fills `node_modules/`. The `dev` script in
`package.json` lets `npm run dev` start Vite.

**Without it we would:** copy library files into the project by hand and write
down the commands to start the app in the README.

**Interview answer:** "npm is to Node what Maven is to Java: `package.json`
lists what the project needs, and the lock file pins exact versions so everyone
installs the same thing. Scripts give the project short named commands like
`npm run dev`."

## Vite (with @vitejs/plugin-react)

**What it is:** a development server and build tool for front-end code.

**Problem it solves:** browsers cannot read JSX, and reloading the page by hand
after every change is slow. Vite translates the files on the fly and updates
the open page the moment a file is saved.

**How we use it here:** `npm run dev` serves the app at `http://localhost:5173`.
The React plugin, switched on in `vite.config.js`, turns JSX into plain
JavaScript and adds Fast Refresh (only the changed component updates, and what
is on screen is kept).

**Without it we would:** set up a bundler such as webpack and a JSX compiler
such as Babel by hand, with much more configuration.

**Interview answer:** "Vite serves my source files to the browser during
development and rebuilds only what changed, so edits show up in about a second.
For production it bundles everything into a few small files."

## React (react and react-dom)

**What it is:** a library for building user interfaces out of components,
which are functions that return what should appear on screen.

**Problem it solves:** keeping the page in step with changing data by hand
(finding elements, changing their text, adding and removing them) gets messy
fast. With React you describe what the screen should look like for the current
data, and React makes the page match.

**How we use it here:** `react` provides components, hooks and `StrictMode`.
`react-dom/client` provides `createRoot`, which takes over the
`<div id="root">` in `index.html` and draws `<App />` inside it.

**Without it we would:** write plain JavaScript that edits the page directly
for every change, such as a card flipping or a quiz answer being marked.

**Interview answer:** "React lets me describe the UI as a function of state.
When the state changes, React works out what changed on the page and updates
only that part."

## useState (React hook)

**What it is:** a hook that gives a component one remembered value and a
function to change it.

**Problem it solves:** a component function runs again on every redraw, so a
normal variable would reset each time, and changing it would not update the
screen.

**How we use it here:** `isFlipped` in `Flashcard`, `text` in `TopicForm`, and
`studySet` in `App`.

**Without it we would:** keep values outside React and update the page by hand
whenever they change.

**Interview answer:** "useState gives me a value React remembers between
renders, plus a setter. Calling the setter stores the new value and makes React
render the component again."

## useReducer (React hook)

**What it is:** a hook that keeps one state object and changes it only through
a reducer function: `(old state, action) => new state`.

**Problem it solves:** when several values change together under rules, separate
`useState`s scatter those rules across click handlers.

**How we use it here:** `useQuiz` keeps `{ questions, index, answers }`, and
`quizReducer` handles `answer`, `next` and `retestWrong`.

**Without it we would:** use three `useState`s and repeat the rules (no changing
an answer, no skipping) inside each button's click handler.

**Interview answer:** "All quiz changes go through one pure function, so the
rules live in one place and I can test them without rendering anything. The
screen just dispatches actions like 'answer' or 'next'."
