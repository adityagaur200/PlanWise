import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path';
// https://vite.dev/config/
export default defineConfig({
  define: {
    global: {}, 
    "process.env": {},
  },
  plugins: [react(),tailwindcss(),],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      "/user": {
        target: "http://localhost:3030",
        changeOrigin: true,
        secure: false
      }
    }
  }
  
})