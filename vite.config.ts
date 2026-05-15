import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import * as path from 'path'

export default defineConfig({
  plugins: [
    {
      ...react(),
      apply: 'serve',
    },
    TanStackRouterVite(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    middlewareMode: false,
    hmr: {
      host: 'localhost',
    },
  },
})
