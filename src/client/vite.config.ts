/// <reference types="vitest" />
import path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import checker from 'vite-plugin-checker'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    open: 'http://localhost:2387',
    port: 2387,
    strictPort: true,
  },
  resolve: {
    alias: { src: path.resolve(__dirname, './src') },
  },
  test: {
    environment: 'jsdom',
    include: ['./src/**/*.{test,spec}.{ts,tsx,js,jsx}'],
  },
  plugins: [
    react(),
    checker({
      overlay: { initialIsOpen: false },
      typescript: true,
      eslint: { lintCommand: 'eslint "./src/**/*.{ts,tsx}"' },
      enableBuild: false,
    }),
  ],
})
