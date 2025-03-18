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
			}
		}
	}
});