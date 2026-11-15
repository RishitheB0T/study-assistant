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

## Step 1.2 — The API server   (2026-11-15, about 2 hours)

**What we built:** a Spring Boot 4 server (Java 21) in `server/` with one
endpoint, `POST /api/generate`. It validates the notes, calls Gemini with a JSON
schema, and always replies `{ ok: true, text }` or
`{ ok: false, error: { code, message } }`. Vite forwards `/api` to it, and
`npm start` runs both. The server is organised into `controller`, `dto`,
`client`, `config` and `exception` packages. It was tested against a fake
Gemini (every failure case) and the real one (a valid set in about 3 seconds).
The plan switched from Express to Spring Boot, and from Groq to Gemini, during
this step.

**Ideas I learned (plain words, then the proper name):**

- The browser asks Vite, and Vite passes `/api` requests on to Spring: a dev
  proxy. The browser only sees one address, so no CORS (the browser's rule
  against calling a different address).
- A secret the browser must never see stays on the server and is read from an
  ignored file: `.env`, loaded with `spring.config.import`.
- Asking the model to answer in a fixed JSON shape: structured output with a
  JSON schema (`responseJsonSchema`).
- Turning a low-level error into one the user understands, one layer at a
  time: exception translation (`HttpTimeoutException` → `ResourceAccessException`
  → `ApiException(TIMEOUT)` → JSON).
- One class that catches exceptions for every controller:
  `@RestControllerAdvice` with `@ExceptionHandler`. Spring picks the handler
  whose parameter type is the closest match.
- How long to wait to connect vs how long to wait for the answer: connect
  timeout (5 s) vs read timeout (20 s).
- Typed settings instead of loose `@Value`s: a `@ConfigurationProperties`
  record. Its `toString` is overridden so the key can never be logged.
- Running two programs from one command: `concurrently` in `npm start`.

**Why we did it this way, and what the alternative was:**

- Spring Boot instead of Express: I know Spring well, so I can explain and
  debug it. The cost is that running the app needs a JDK as well as Node.
- Spring's `RestClient` instead of the Gemini SDK: nothing hidden to explain.
- The server returns the model's text without checking it. One checkpoint in
  the browser checks everything that comes from outside (AI answers, saved
  sessions, imports), so the rules live in one place.
- No service layer yet: it would only pass calls through. It arrives in step
  1.5, when the debug switch gives it real work.
- Port 8787, because 8080 is used by a Windows service on my machine.

**Interview questions and my answers:**

- *Why do you need a backend at all?* To keep the API key secret. Anything in
  the browser can be read in DevTools.
- *How does an exception become a JSON error?* The controller only returns the
  success type. Exceptions fly out of it, Spring's `DispatcherServlet` catches
  them, and `ApiExceptionHandler` builds `ResponseEntity<ErrorResponse>`.
- *What happens if Gemini takes 25 seconds?* The 20-second read timeout fires,
  `GeminiClient` throws `ApiException(TIMEOUT)`, and the client gets 504 with a
  clear message.
- *Why not validate the study set on the server?* The schema makes good output
  likely, not guaranteed, and other data sources need the same checks. One
  checkpoint in the frontend covers all of them.
- *How do you know the key is never logged?* It is sent only as a header, the
  settings record hides it in `toString`, and I checked the logs: 0
  occurrences.

**Still shaky:** the frontend side of the request (`fetch`) is not built yet;
it comes in step 1.4.

## Step 1.3 — The checkpoint   (2026-11-15, about 1 hour)

**What we built:** `parseStudySet(text)`, the one function that every piece of
outside data passes before the screen sees it, with the Zod rules in
`schema.js` and 10 Vitest tests. I wrote the missing-field tests; we then
tightened them so each bad item breaks exactly one rule, and added the
repeated-id test.

**Ideas I learned (plain words, then the proper name):**

- One function stands between outside data and the screen, and always returns
  a result instead of throwing: the checkpoint, `parseStudySet`.
- Describing valid data once and checking any value against it: a schema
  (Zod). `safeParse` returns `{ success, data | error }`.
- Choosing the rules by a field's value: a discriminated union
  (`z.discriminatedUnion('type', ...)`), like Jackson's `@JsonTypeInfo`.
- Keeping the good items and counting the bad ones: partial results (`skipped`).
- A list that remembers what it has seen: a `Set` (like `HashSet`).
- A test should fail for exactly one reason: start from a valid object and
  break one field (`{ ...mcq('2'), question: undefined }`; `JSON.stringify`
  leaves `undefined` fields out).
- Windows drive-letter case (`c:\` vs `C:\`) can make Vitest load twice; we
  start it from the folder's real path.

**Why we did it this way, and what the alternative was:**

- Items are checked one at a time, not with `z.array(ItemSchema)`, so one bad
  card does not throw away the whole set.
- The checkpoint runs in the browser, not on the server, because saved
  sessions and imported files (later steps) must pass the same checks.
- `answerIndex` must be 0 to 3 and options exactly 4: these are exactly the
  assumptions `Quiz.jsx` makes, so a checked item cannot crash it.

**Interview questions and my answers:**

- *What does the checkpoint return for cut-off JSON?* `{ ok: false, reason:
  'malformed' }`, because `JSON.parse` throws and we catch it.
- *8 good cards and 1 with `answerIndex: 7`?* `{ ok: true, data: (8 cards),
  skipped: 1 }`.
- *Why does `.trim()` come before `.min(1)`?* So text made only of spaces
  becomes empty first and is rejected.
- *What makes a good test?* It starts from valid data and changes one thing,
  so it fails only for the reason in its name.

**Still shaky:** —

## Step 1.4 — Request lifecycle   (2026-11-15, about 1 hour)

**What we built:** the screens now really call the server. `api.js` (the only
`fetch`), `useStudySet` (status word, checkpoint, stale guard, cancel, retry),
`StatusView` (loading, "Still working…" after 5 s, error with Retry, skipped
note), and the wiring in `App`. I wrote the error branch of `StatusView`.
Tested end to end: a real Gemini set, a timeout then Retry, garbled text, a
skipped item, a set with no questions, a slow answer with Cancel, and the race
where an old answer arrives last.

**Ideas I learned (plain words, then the proper name):**

- A value that arrives later, and waiting for it without freezing the page:
  a promise, `async` / `await`.
- `fetch` only throws when no reply arrives; a 504 is still a reply.
- Cancelling a running request: `AbortController` and `signal`.
- An old, slow answer replacing a newer one: a stale response (a race). The
  fix: number every request and accept only the newest.
- Remembered but never shown, and always read fresh: `useRef`.
- Code after drawing, with a cleanup: `useEffect` (the 5-second timer).
- A new `key` makes React rebuild a part from scratch: the section holding the
  set gets `key={receivedCount}`, so cards and quiz start fresh.
- Screen reader announcements: `role="status"` (polite) and `role="alert"`
  (immediate).

**Why we did it this way, and what the alternative was:**

- One status word instead of `isLoading` + `isError`, so the state can never
  contradict itself.
- Abort plus a request number: abort saves work, the number is the real guard
  (I saw "Plants" replace "Volcanoes" when the guard was switched off).
- The timer lives in a component that exists only while loading, instead of
  extra state in the hook.
- Generate is disabled while loading; the user cancels first. The guard still
  protects against an answer that was already arriving.

**Interview questions and my answers:**

- *How do you stop an old answer from overwriting a newer one?* Each request
  gets a number from a ref; after `await`, if my number is not the newest, I
  return without touching state.
- *Why is the request number a ref and not state?* It is never shown, and after
  `await` a state value inside the function would still be the old one.
- *What does the user see if the server is down?* "Can't reach the server…"
  with a Retry button: `fetch` throws, and `api.js` turns that into `NETWORK`.
- *What happens to the timer if the answer arrives after 2 seconds?* `Loading`
  disappears and its effect cleanup clears the timer.

**Still shaky:** —
