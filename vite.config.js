import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    open: true, // Автоматически открывать браузер в dev-режиме
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
