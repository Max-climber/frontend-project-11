import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';
import { fileURLToPath } from 'url';
import path from 'path';

// Аналог __dirname для ES-модулей
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: __dirname, // Теперь работает корректно
  publicDir: 'public',
  plugins: [eslint()],
  server: {
    open: true
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html')
    }
  }
});