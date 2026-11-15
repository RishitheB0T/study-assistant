# Study Assistant

A React app that turns pasted notes or a topic into flashcards and a quiz.

An AI model returns the study material as structured JSON (data written as
text). Before anything reaches the screen, the app checks that data against a
fixed set of rules. The user only ever sees clean, interactive cards and
questions, never raw model text.

> **Status:** the app works end to end: notes go to the server, Gemini answers,
> the checkpoint validates the answer, and the cards and quiz appear. Loading,
> error, empty, slow and cancelled requests are all handled.

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
- Spring Boot API server with one endpoint, `POST /api/generate`. It keeps the
  Gemini API key on the server, rejects empty or too-long notes before calling
  the model, gives up after 20 seconds, and always replies in one of two JSON
  shapes (see below).
- The checkpoint, `parseStudySet`: one function that every piece of outside
  data must pass before the screen sees it. It never throws. It returns the
  clean set, or a reason: `empty`, `malformed` (not JSON) or `wrong_shape`. Bad
  items and repeated ids are skipped and counted, so one broken card does not
  throw away a good set. Covered by 10 automatic tests.
- Request lifecycle (`useStudySet`): one status word (`idle`, `loading`,
  `success`, `error`), "Still working…" after 5 seconds, Cancel, Retry, and a
  clear message for every failure (server down, timeout, rate limit, garbled
  or empty answer). Every request is numbered, so an older, slower answer can
  never replace a newer one. Generate waits while a request is running, and a
  new set always starts with fresh cards and a fresh quiz.

## Tech stack

- **React 19**: builds the user interface from function components and hooks.
- **Vite 8**: development server with instant reload, and build tool. It also
  forwards `/api` requests to the Spring Boot server during development.
- **Spring Boot 4 (Java 21)**: the API server. It calls the Gemini REST API with
  Spring's `RestClient`, with no AI SDK.
- **Gemini API** (`gemini-3.5-flash-lite`): the model, asked for JSON that
  follows a fixed schema.
- **concurrently**: lets `npm start` run the web app and the server together.
- **Zod 4**: the rules a valid study set must follow, checked in the browser.
- **Vitest 5**: automatic tests for the checkpoint (`npm test`).

## Getting started

Requires **Node.js 22.12 or newer** (Vitest 5 needs it) and **a JDK, version
17 or newer** (21 recommended). Maven is not needed: the project includes the Maven wrapper.

1. Get a free Gemini API key at https://aistudio.google.com/apikey.
2. Copy `.env.example` to `.env` and paste the key after `GEMINI_API_KEY=`.
   `.env` is git-ignored and is read only by the server.
3. Install and start:

```bash
git clone https://github.com/RishitheB0T/study-assistant.git
cd study-assistant
npm install
npm start
```

Then open http://localhost:5173. The very first start takes a minute or two
while the Maven wrapper downloads Maven and the server's dependencies.

`npm start` runs both parts. To run them separately: `npm run dev` (web app on
port 5173) and `npm run server` (API on port 8787).

Run the tests with `npm test`.

## The API

`POST /api/generate` with the body `{ "notes": "..." }` always replies with one
of two shapes:

```json
{ "ok": true, "text": "...the model's raw JSON answer..." }
{ "ok": false, "error": { "code": "TIMEOUT", "message": "..." } }
```

| Code | HTTP status | When |
| --- | --- | --- |
| `BAD_INPUT` | 400 | Notes are empty or longer than 4,000 characters, or the body is not JSON |
| `NO_KEY` | 500 | The server has no `GEMINI_API_KEY` |
| `TIMEOUT` | 504 | Gemini took longer than 20 seconds |
| `RATE_LIMITED` | 429 | Gemini's rate limit was hit (a `Retry-After` header is passed on when Gemini sends one) |
| `PROVIDER_ERROR` | 502 | Gemini rejected the request, blocked the input, or failed |

The server never checks the model's answer itself. The web app checks it before
anything is shown.

## Project files

```
index.html          The one HTML page; React draws the app inside <div id="root">
vite.config.js      Vite settings: the React plugin, and /api forwarded to the server
src/main.jsx        Starting point: hands the root element to React
src/index.css       Styles for the whole app
src/App.jsx         The top-level component: holds the current study set
src/components/     TopicForm, Flashcard, Quiz, Results, StatusView (loading / error / skipped)
src/hooks/          useStudySet: one request at a time (status, cancel, retry, stale guard)
                    useQuiz: the quiz rules (reducer) and the values the screen needs
src/lib/            api.js: the only fetch call; always returns the server's ok/error shape
                    parseStudySet: the checkpoint (+ parseStudySet.test.js)
                    schema: the Zod rules for each item type and the set
                    sampleSet: hand-written study data in the shape the AI must return
server/             Spring Boot API server (Maven project), package com.studyassistant.server
  controller/   GenerateController: POST /api/generate; @Valid rejects bad input
  dto/          GenerateRequest, GenerateResponse, ErrorResponse: the JSON the frontend sees
  client/       GeminiClient (builds the request, reads the reply), GeminiResponse
  config/       GeminiProperties (typed gemini.* settings), GeminiConfig (RestClient + timeouts)
  exception/    ErrorCode, ApiException, ApiExceptionHandler: every failure -> { ok: false, error }
  resources/    application.properties, study-set-schema.json (the shape Gemini must answer in)
scripts/            start-server.js: starts the server with the Maven wrapper on any OS
                    run-tests.js: runs Vitest from the folder's real path (fixes Git Bash on Windows)
docs/               Learning log and tool notes
.env.example        Template for .env (the API key)
package.json        Project name, scripts and dependencies
package-lock.json   Exact version of every installed package
.gitignore          Files Git must never track
```

## Known limitations

- Running the app needs a JDK as well as Node.js.
- When Gemini is briefly overloaded (HTTP 503), the user sees an error and has
  to press Retry; there is no automatic retry yet.
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

About 6 hours so far: about 1.5 hours on setup and the study screens with
sample data, 2 hours on the API server, 1 hour on the checkpoint and its
tests, 1 hour on connecting the screens to the server, and 30 minutes on
miscellaneous setup and fixes (still in progress).
