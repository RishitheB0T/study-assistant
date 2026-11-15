// Runs Vitest from the project folder's real path.
// On Windows, a lower-case drive letter (c:\ instead of C:\, which Git Bash gives)
// makes Vitest load itself twice and fail before any test runs.
import { spawnSync } from 'node:child_process'
import { realpathSync } from 'node:fs'
import { join } from 'node:path'

const projectFolder = realpathSync.native(process.cwd())
const vitest = join(projectFolder, 'node_modules', 'vitest', 'vitest.mjs')

const result = spawnSync(process.execPath, [vitest, 'run', ...process.argv.slice(2)], {
  cwd: projectFolder,
  stdio: 'inherit',
})

process.exit(result.status ?? 1)
