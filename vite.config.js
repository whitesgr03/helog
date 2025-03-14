import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { randomBytes } from 'node:crypto';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	html: {
		cspNonce: randomBytes(16).toString('base64'),
	},
	server: {
		open: '/',
		port: 9001,
	},
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: './src/__test__/setup.js',
		include: ['src/__test__/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
		exclude: [
			'src/__test__/**/delete_*.{test,spec}.?(c|m)[jt]s?(x)',
			'src/__test__/E2E',
		],
		coverage: {
			include: ['src/**'],
			exclude: ['src/**/delete_**'],
		},
	},
});
