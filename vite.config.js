import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/Agro/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        calculation: resolve(__dirname, 'src/html/calculation.html'),
        orders: resolve(__dirname, 'src/html/orders.html'),
        loaded: resolve(__dirname, 'src/html/loaded.html'),
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://tsup.raketa.im:8888/',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
});
