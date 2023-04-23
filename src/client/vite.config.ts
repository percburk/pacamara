/// <reference types="vitest" />
import path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import checker from 'vite-plugin-checker'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    server: {
      open: env.CLIENT_BASE_URL,
      port: Number(env.PORT),
      strictPort: true,
      proxy: {
        '/api': {
          target: env.SERVER_BASE_URL,
          changeOrigin: true,
        },
      },
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
      !process.env.VITEST &&
        checker({
          overlay: { initialIsOpen: false },
          typescript: true,
          eslint: { lintCommand: 'eslint "src/**/*.{ts,tsx}"' },
          enableBuild: false,
        }),
    ],
  }
})
