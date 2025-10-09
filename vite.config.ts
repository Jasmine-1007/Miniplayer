import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import fs from "fs";




export default defineConfig({
  plugins: [react()],
  server: {
    watch:{
      usePolling: true,
    },
    host: "127.0.0.1", // bind to 127.0.0.1 instead of localhost
    port: 5173
  }
});