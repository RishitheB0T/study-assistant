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
is on screen is kept). Its dev-server proxy forwards every `/api/...` request
to the local API server on port 8787, so the browser only ever talks to one
address and there are no CORS problems.

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

## Vercel Functions (the live API)

**What it is:** Vercel hosts the built frontend and turns every file in the
`api/` folder into a small server function that runs on demand.

**Problem it solves:** the AI key must never reach the browser, so something
outside the browser has to hold it and call the AI. A function needs no server
of our own to keep running, and it deploys together with the frontend.

**How we use it here:** `api/generate.js` answers `POST /api/generate`. It
reads the body and `?chaos=`, then calls `generateStudySet` in
`server/studySet.js`, which holds all the rules. The key is set in Vercel's
Environment Variables as `GEMINI_API_KEY`. `vercel.json` allows the function
30 seconds (our own Gemini limit is 20).

**Without it we would:** rent and run a server ourselves (as the earlier Spring
Boot version needed), or call the AI from the browser and expose the key.

**Interview answer:** "The server is one function that keeps the key secret and
turns every failure into one predictable JSON shape. On Vercel it runs as a
Vercel Function; locally a tiny Node server calls the same function."

## Node's http module and process.loadEnvFile (the local API server)

**What it is:** `node:http` is Node's built-in way to write a web server;
`process.loadEnvFile` is Node's built-in reader for `.env` files.

**Problem it solves:** `npm start` needs a local API server, without adding
Express or dotenv as dependencies.

**How we use it here:** `server/dev-server.js` serves only `POST
/api/generate` on port 8787 (or `API_PORT`), reads the body, and calls the same
`generateStudySet` as the Vercel Function. It loads `.env` if it exists and
still starts without it, so Generate then answers `NO_KEY`.

**Without it we would:** add Express and dotenv, or need the Vercel CLI to run
the app locally.

**Interview answer:** "Locally, a 50-line server on Node's http module calls
the exact function that runs on Vercel, so what I test on my laptop is what
runs live."

## Vitest stubs and fake timers (vi)

**What it is:** Vitest's helper object `vi` can replace real things during a
test: `vi.stubGlobal('fetch', …)`, `vi.stubEnv('GEMINI_API_KEY', …)`, and
`vi.useFakeTimers()` to control `setTimeout`.

**Problem it solves:** server tests must not call the real Gemini (slow, costs
quota, unpredictable), and the "slow" debug mode would make a test wait 8
seconds.

**How we use it here:** `server/studySet.test.js` stubs `fetch` to return fake
Gemini replies (good, 429, 400, 503, blocked, timeout, no network) and jumps 8
seconds ahead with `vi.advanceTimersByTimeAsync`. Everything is undone after
each test.

**Without it we would:** test against the real Gemini, slowly and unreliably,
or not test the failure paths at all.

**Interview answer:** "I replace fetch with a stub, so each test decides exactly
what Gemini answers. That is how I test 429, 503 and timeouts on demand."

## Browser automation for the recording (Playwright)

**What it is:** Playwright (here the Patchright fork already installed on this
machine) drives a real Chromium browser from a script: typing, clicking,
screenshots and video.

**Problem it solves:** a repeatable demo video and screenshots, and visual
checks of every screen at phone and wide sizes, in light and dark.

**How we use it here:** a one-off script (not in the repo) ran the two-minute
tour against the real app, recorded `docs/media/demo.webm` and took the four
screenshots. Takes with an unintended Gemini error were thrown away.

**Without it we would:** record by hand with a screen recorder.

**Interview answer:** "The recording is scripted: a browser script runs the
tour with real Gemini answers and the debug modes, and adds captions, because
there is no narration."

## concurrently

**What it is:** a small npm tool that runs several commands at once in one
terminal and labels each line with where it came from.

**Problem it solves:** the app needs two programs running (Vite and the local
API server). Without it, everyone would need two terminals and two commands.

**How we use it here:** `npm start` runs `concurrently "npm:dev" "npm:server"`.
Output lines are prefixed `[web]` and `[api]`, and Ctrl+C stops both.

**Without it we would:** tell people to open two terminals, or write a shell
script that only works on one operating system.

**Interview answer:** "`npm start` uses concurrently to start the Vite dev
server and the local API server side by side, so `npm install && npm start`
really does run the whole app."

## Gemini API (structured output)

**What it is:** Google's AI model, called over plain HTTPS with an API key.

**Problem it solves:** turning free-form notes into flashcards and quiz
questions, which is the part of the app that needs an AI.

**How we use it here:** `POST .../models/gemini-3.5-flash-lite:generateContent`
with the key in the `x-goog-api-key` header. `generationConfig` asks for
`application/json` and sends `STUDY_SET_SCHEMA` (in `server/studySet.js`) as `responseJsonSchema`,
so the answer comes back in our exact `{ title, items }` shape. The model's
"thought" parts are skipped.

**Without it we would:** ask for free text and try to cut cards out of it,
which breaks easily.

**Interview answer:** "I send a JSON schema with the request, so the model
answers in the shape my app expects. I still validate the answer in the
browser, because a schema makes good output likely, not guaranteed."

## Zod

**What it is:** a library for describing what correct data looks like, once,
and then checking any value against that description.

**Problem it solves:** the AI's answer is outside data. Checking every field by
hand with `if` statements is long, easy to get wrong, and hard to read.

**How we use it here:** `src/lib/schema.js` holds the rules: a flashcard, a
multiple-choice question (exactly 4 options, `answerIndex` 0 to 3), and the
outer set. `z.discriminatedUnion('type', ...)` picks the rules by the `type`
field. `parseStudySet` calls `safeParse`, which returns a result instead of
throwing, and gets back cleaned data (trimmed text, unknown fields dropped).

**Without it we would:** write many nested `if` checks inside `parseStudySet`.

**Interview answer:** "Zod is like Bean Validation for JavaScript objects. I
describe a valid card once, and `safeParse` tells me whether outside data
matches, without throwing, so my checkpoint can return a clear reason."

## Vitest

**What it is:** a test runner for JavaScript that uses Vite, the JavaScript
equivalent of JUnit.

**Problem it solves:** checking the checkpoint by hand after every change is
slow and easy to forget. Tests check every case in under a second.

**How we use it here:** `npm test` runs `src/lib/parseStudySet.test.js`: 10
tests covering a valid set, empty text, broken JSON, the wrong shape, each
missing field, and repeated ids. `scripts/run-tests.js` starts Vitest from the
folder's real path, because a lower-case drive letter (Git Bash on Windows)
makes Vitest load itself twice and fail.

**Without it we would:** test by pasting inputs into the browser console, and
miss regressions.

**Interview answer:** "`describe` groups tests like a test class, `test` is a
`@Test` method, and `expect(...).toEqual(...)` is `assertEquals`. Each bad
item in my tests breaks exactly one rule, so a test can only pass for the
reason in its name."

## fetch (with async / await)

**What it is:** the browser's built-in function for HTTP requests. It returns a
promise (an answer that arrives later), and `await` waits for it without
freezing the page.

**Problem it solves:** the page must talk to the server without locking up
while it waits 1 to 20 seconds.

**How we use it here:** only in `src/lib/api.js`. `requestStudySet(notes,
signal)` posts `{ notes }` to `/api/generate` and always returns
`{ ok, ... }`. A 4xx/5xx still returns a body, so `fetch` only throws when no
reply arrives at all (server down) or the request is cancelled.

**Without it we would:** add a library such as axios, which mainly adds
automatic JSON parsing and throwing on 4xx/5xx; we need neither.

**Interview answer:** "All network code is in one function that never throws
for normal failures: it turns 'server down' or 'not JSON' into the same
`{ ok: false, error }` shape the server uses, so the UI handles one shape."

## AbortController

**What it is:** a browser object that can cancel a `fetch` that is still
running.

**Problem it solves:** without it, Cancel could only hide the spinner while the
request kept going in the background.

**How we use it here:** `useStudySet` creates one per request and passes its
`signal` to `fetch`. Cancel, or a newer Generate, calls `abort()`; `fetch`
then throws an `AbortError`, which the hook treats as "cancelled", not as an
error.

**Without it we would:** let old requests finish and only ignore their
answers.

**Interview answer:** "Abort stops the old request, but it is not my stale
guard: an answer can already have arrived. The guard is a request number;
only the newest request may update the screen."

## useRef (React hook)

**What it is:** a box whose value survives redraws, where changing the value
does not cause a redraw.

**Problem it solves:** some values must be remembered but never shown, and an
`async` function must read their newest value after an `await`.

**How we use it here:** `useStudySet` keeps the newest request number, the
current `AbortController`, and the last notes (for Retry) in refs.

**Without it we would:** use state, which redraws for nothing, and whose value
inside `generate` would still be the old one after `await`, breaking the stale
guard.

**Interview answer:** "useState is for what the screen shows; useRef is for
what the component must remember but never shows, like a private field."

## useEffect (React hook)

**What it is:** code React runs after drawing a component, with an optional
cleanup that runs when the component disappears.

**Problem it solves:** timers and other side effects must start after the
screen is drawn and must be stopped when they are no longer needed.

**How we use it here:** `Loading` in `StatusView.jsx` starts a 5-second timer
that switches to "Still working…", and its cleanup cancels the timer if the
answer arrives first. `Loading` only exists while a request runs, so every
request gets a fresh 5 seconds.

**Without it we would:** start timers during drawing and leak them when the
component goes away.

**Interview answer:** "The effect starts the timer and returns a cleanup that
clears it; `[]` means run once when the component appears. StrictMode runs
effects twice in development to catch missing cleanups."

## localStorage

**What it is:** a small key-value store built into the browser, kept per
website. It holds text only and survives refreshes and restarts.

**Problem it solves:** without it, refreshing the page loses the set the user
just generated.

**How we use it here:** `src/lib/storage.js`. `saveStudySet` stores the last
clean set as JSON text under `study-assistant:last-set`. `loadStudySet` reads
it back through `parseStudySet` (saved data is outside data too) and deletes it
if the checkpoint rejects it. Both catch errors, because storage can be full or
blocked in some private modes. `useStudySet` loads it once as lazy initial
state: `useState(() => loadStudySet())`.

**Without it we would:** need a server-side database and logins, which are out
of scope.

**Interview answer:** "The last set is saved in localStorage, but loading goes
through the same checkpoint as the AI's answer, so corrupted or outdated saved
data is ignored instead of crashing the page."
