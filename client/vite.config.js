import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/users': 'http://localhost:8000',
      '/connections': 'http://localhost:8000',
      '/connection_requests': 'http://localhost:8000',
      '/user-skills': 'http://localhost:8000',
    }
  }
})
