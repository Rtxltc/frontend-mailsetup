import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/mail': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/send-email': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
})
