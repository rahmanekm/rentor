import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5500, // Client-side port
    proxy: {
      // Proxy API requests to the backend server
      '/api': {
        target: 'http://localhost:5000', // Backend server address
        changeOrigin: true
        // rewrite: (path) => path.replace(/^\/api/, '') // Removed this line
      }
    }
  }
})
