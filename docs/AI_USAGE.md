# AI usage

This project is built with an AI coding assistant (Claude, by Anthropic). The
AI writes the code. I direct the work, review every block, and learn it well
enough to explain, fix and extend it. From the second commit on, the AI also
makes the commits and pushes them to GitHub, at my request.

## Before coding

The phase plan and the assistant's working instructions were drafted with
Claude before any code was written.

## Step 1.0 — Set up

**What the AI wrote:** every file in the repo: `.gitignore`, `package.json`,
`vite.config.js`, `index.html`, `src/main.jsx`, `src/App.jsx`, `README.md` and
these docs. It ran `npm install`, checked the page in a headless browser, and
made every commit after the first one.

**What I decided or asked to change:**

- Restarted with a fresh GitHub repo so the history shows only my own Git
  identity, with no AI co-author lines.
- Ran `git init`, the first commit and the first push myself.
- Asked the AI to write `.gitignore` without a long walkthrough, since I
  already knew it.
- Asked for the live preview inside VS Code (the Integrated Browser).
- Asked the AI to commit and push from then on, in small, frequent commits.
- Asked for a README that covers only work that is done, with no roadmap.

**Could I explain the step without help at the end?** Not tested yet. I asked
the AI to give the answers to the check questions for this step instead of
answering them myself.
