import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  build:{
    outdir:'dist'
  },
  define: {
    global: {},
    "process.env": {},
  },
  plugins: [react()],
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
        secure: false,
      },
    },
  },
});
