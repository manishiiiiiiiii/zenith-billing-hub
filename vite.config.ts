import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackStartPlugin } from '@tanstack/start-plugin'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react(),
    TanStackStartPlugin(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
