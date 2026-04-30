import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        work: resolve(__dirname, 'work.html'),
        about: resolve(__dirname, 'about.html'),
        contact: resolve(__dirname, 'contact.html'),
        insights: resolve(__dirname, 'insights.html'),
        start: resolve(__dirname, 'start.html'),
      },
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});
