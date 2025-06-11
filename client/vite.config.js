import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
      react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:7050', // Forward all /api requests to the backend
    },
  },
})
