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
        process: resolve(__dirname, 'process.html'),
        about: resolve(__dirname, 'about.html'),
        contact: resolve(__dirname, 'contact.html'),
        start: resolve(__dirname, 'start.html'),
        privacy: resolve(__dirname, 'privacy-policy.html'),
        cookie: resolve(__dirname, 'cookie-policy.html'),
        sitemap: resolve(__dirname, 'sitemap.html'),
      },
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});
