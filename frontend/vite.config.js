import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/prizebond_draw/backend': {
        target: 'http://localhost:8000', // আপনার লোকাল Laravel URL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/prizebond_draw\/backend/, ''),
      },
    },
  },
});