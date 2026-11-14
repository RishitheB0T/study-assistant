import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    // The browser calls /api/... on Vite's own address; Vite forwards it to Spring Boot.
    proxy: {
      '/api': 'http://localhost:8787',
    },
  },
})
