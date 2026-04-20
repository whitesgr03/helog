/// <reference types="vitest/config" />
// add /// <reference types="vitest/config" /> to include the test types

import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');

	return {
		plugins: [react()],
		preview: {
			port: Number(env.PORT),
			headers: {
				'X-Content-Type-Options': 'nosniff',
				'Cross-Origin-Embedder-Policy': 'credentialless',
				'X-Frame-Options': 'DENY',
				'Cross-Origin-Resource-Policy': 'same-origin',
				'Referrer-Policy': 'no-referrer',
				'X-XSS-Protection': '0',
				'X-DNS-Prefetch-Control': 'off',
				'Strict-Transport-Security':
					'max-age=63072000; includeSubDomains preload',
				'Content-Security-Policy-Report-Only': `default-src 'none'; connect-src 'self' ${env.VITE_RESOURCE_URL} *.tiny.cloud; script-src 'self' *.tiny.cloud 'unsafe-inline'; style-src 'self' 'unsafe-inline' fonts.googleapis.com/css2 *.tiny.cloud; font-src https:; img-src 'self' https: data:; form-action 'self'; frame-ancestors 'none';`,
			},
		},
		server: {
			port: Number(env.PORT),
			headers: {
				'X-Content-Type-Options': 'nosniff',
				'Cross-Origin-Embedder-Policy': 'credentialless',
				'X-Frame-Options': 'DENY',
				'Cross-Origin-Resource-Policy': 'same-origin',
				'Referrer-Policy': 'no-referrer',
				'X-XSS-Protection': '0',
				'X-DNS-Prefetch-Control': 'off',
				'Strict-Transport-Security':
					'max-age=63072000; includeSubDomains preload',
				'Content-Security-Policy-Report-Only': `default-src 'none'; connect-src 'self' ${env.VITE_RESOURCE_URL} *.tiny.cloud; script-src 'self' *.tiny.cloud 'unsafe-inline'; style-src 'self' 'unsafe-inline' fonts.googleapis.com/css2 *.tiny.cloud; font-src https:; img-src 'self' https: data:; form-action 'self'; frame-ancestors 'none';`,
			},
		},
		test: {
			globals: true,
			environment: 'jsdom',
			setupFiles: './src/setup.ts',
			include: ['src/**/*.test.ts?(x)'],
			exclude: ['src/**/delete_*', 'src/E2E'],
			coverage: {
				include: ['src/**/*.ts?(x)'],
				exclude: ['src/**/delete_*'],
			},
			clearMocks: true,
		},
	};
});
