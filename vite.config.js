import { defineConfig } from 'vite';
import {resolve} from "path";

export default defineConfig({
  base: '/Agro/', 
  build: {
		outDir: 'dist',
		rollupOptions: {
			input: {
				index: resolve(__dirname, "index.html"),
				calculation: resolve(__dirname, 'src/html/calculation.html'),
				orders: resolve(__dirname, 'src/html/orders.html'),
				loaded: resolve(__dirname, 'src/html/loaded.html'),
			}
		}
	},
	server: {
		// cors: false,
		// host: 'http://tsup.raketa.im/',
  	proxy: {
        '/api': {
          target: 'http://tsup.raketa.im:8888/',
          changeOrigin: true,
          secure: false, 
          ws: true,
          // configure: (proxy, _options) => {
          //   proxy.on('error', (err, _req, _res) => {
          //     console.log('proxy error', err);
          //   });
          //   proxy.on('proxyReq', (proxyReq, req, _res) => {
          //     console.log('Sending Request to the Target:', req.method, req.url);
          //   });
          //   proxy.on('proxyRes', (proxyRes, req, _res) => {
          //     console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          //   });
          // },
        }
      }
  }

});