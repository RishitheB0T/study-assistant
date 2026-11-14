# Study Assistant

A React app that turns pasted notes or a topic into flashcards and a quiz.

An AI model returns the study material as structured JSON (data written as
text). Before anything reaches the screen, the app checks that data against a
fixed set of rules. The user only ever sees clean, interactive cards and
questions, never raw model text.

> **Status:** project setup in progress. The app itself is not built yet.

## Done so far

- Git repository with a `.gitignore` that keeps dependencies, build output,
  secrets (`.env` files) and local editor-assistant files out of version control.
- `package.json` with React and Vite installed.

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
```

## Project files

```
.gitignore          Files Git must never track
package.json        Project name, scripts and dependencies
package-lock.json   Exact version of every installed package
README.md           This file
```

## AI usage

This project is built with an AI coding assistant (Claude, by Anthropic). The
AI writes the code and makes the commits under my direction. I review every
block and make sure I can explain, fix and extend it myself.
