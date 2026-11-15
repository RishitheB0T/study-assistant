import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// The local API server's port. Change it with the API_PORT variable if 8787 is taken.
const apiPort = process.env.API_PORT ?? 8787

export default defineConfig({
  plugins: [react()],
  server: {
    // The browser calls /api/... on Vite's own address; Vite forwards it to the API server.
    proxy: {
      '/api': `http://localhost:${apiPort}`,
    },
  },
})
