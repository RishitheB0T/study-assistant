// Starts the Spring Boot server through the Maven wrapper, on Windows, macOS and Linux.
import { spawn } from 'node:child_process'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const serverFolder = fileURLToPath(new URL('../server/', import.meta.url))
const wrapper = join(serverFolder, process.platform === 'win32' ? 'mvnw.cmd' : 'mvnw')

// One quoted command string: the shell is needed to start .cmd files on Windows,
// and quoting keeps folder names with spaces working.
const child = spawn(`"${wrapper}" -q spring-boot:run`, {
  cwd: serverFolder,
  stdio: 'inherit',
  shell: true,
})

child.on('exit', (code) => process.exit(code ?? 0))
