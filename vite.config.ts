import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc'
import fs from "fs";




export default defineConfig({
  plugins: [react(),
    tailwindcss()
  ],
  server: {
    watch:{
      usePolling: true,
    },
    host: "127.0.0.1", // bind to 127.0.0.1 instead of localhost
    port: 5173
  }
});