// The local API server for development: Node's built-in http module, nothing else.
// It runs the same generateStudySet as the deployed Vercel function.
import { createServer } from 'node:http'
import { fileURLToPath } from 'node:url'
import { generateStudySet, NOT_JSON } from './studySet.js'

// The key lives in the project-root .env file (git-ignored). Without that file the
// server still starts, and generateStudySet answers NO_KEY.
try {
  process.loadEnvFile(fileURLToPath(new URL('../.env', import.meta.url)))
} catch {
  // No .env file yet.
}

const PORT = Number(process.env.API_PORT ?? 8787)

const server = createServer(async (request, response) => {
  const url = new URL(request.url, 'http://localhost')
  if (url.pathname !== '/api/generate') {
    return send(response, { status: 404, headers: {}, body: problem('Nothing lives at this address.') })
  }
  if (request.method !== 'POST') {
    return send(response, { status: 405, headers: { Allow: 'POST' }, body: problem('Use POST for this address.') })
  }

  request.setEncoding('utf8')
  let bodyText = ''
  for await (const chunk of request) {
    bodyText += chunk
  }

  let payload
  try {
    payload = JSON.parse(bodyText)
  } catch {
    return send(response, NOT_JSON)
  }
  send(response, await generateStudySet({ notes: payload?.notes, chaos: url.searchParams.get('chaos') }))
})

function problem(message) {
  return { ok: false, error: { code: 'BAD_INPUT', message } }
}

function send(response, { status, headers, body }) {
  response.writeHead(status, { 'Content-Type': 'application/json', ...headers })
  response.end(JSON.stringify(body))
}

server.listen(PORT, () => {
  console.log(`API server ready on http://localhost:${PORT}`)
})
