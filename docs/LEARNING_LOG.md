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
