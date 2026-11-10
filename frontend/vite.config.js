import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // Proxy /api ke backend lokal agar frontend bisa diakses lewat tunnel/host
  // mana pun (demo, bukan cuma localhost). Di laptop tetap jalan seperti biasa.
  server: {
    proxy: {
      "/api": "http://localhost:5000",
    },
  },
})