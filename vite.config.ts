import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    TanStackRouterVite(),
    react(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
    dedupe: ['react', 'react-dom', '@tanstack/react-router'],
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
  build: {
    target: 'esnext',
  },
  ssr: {
    noExternal: true,
  },
})
