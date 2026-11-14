import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react()],
  // Relative paths so the built site works on GitHub Pages or any subfolder.
  base: './',
  build: {
    rollupOptions: {
      // Two pages: the home page and the shop.
      input: {
        main: resolve(__dirname, 'index.html'),
        shop: resolve(__dirname, 'shop.html'),
      },
    },
  },
});
