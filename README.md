# Study Assistant

A React app that turns pasted notes or a topic into flashcards and a quiz.

An AI model returns the study material as structured JSON (data written as
text). Before anything reaches the screen, the app checks that data against a
fixed set of rules. The user only ever sees clean, interactive cards and
questions, never raw model text.

> **Status:** project setup is done. The app currently shows a single page
> with its title; the study features are not built yet.

## Done so far

- Git repository with a `.gitignore` that keeps dependencies, build output,
  secrets (`.env` files) and local editor-assistant files out of version control.
- `package.json` with React and Vite installed.
- Vite dev server with the React plugin, and a first React component that
  renders the app title.

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
src/App.jsx         The top-level component
docs/               Learning log, tool notes and AI-usage record
package.json        Project name, scripts and dependencies
package-lock.json   Exact version of every installed package
.gitignore          Files Git must never track
```

## AI usage

This project is built with an AI coding assistant (Claude, by Anthropic). The
AI writes the code and makes the commits under my direction. I review every
block and make sure I can explain, fix and extend it myself. The step-by-step
record is in [docs/AI_USAGE.md](docs/AI_USAGE.md).
