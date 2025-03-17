import { defineConfig } from 'vite';
import {resolve} from "path";

export default defineConfig({
	// ссылка на папку проекта
  base: '/Agro/', 
  build: {
		outDir: 'dist',
		rollupOptions: {
			input: {
				index: resolve(__dirname, "index.html"),
				start: resolve(__dirname, 'src/html/start.html'),
			}
		}
	}
});