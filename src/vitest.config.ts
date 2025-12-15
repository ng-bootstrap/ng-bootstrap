import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		isolate: true,
		testTimeout: 2000,
		hookTimeout: 2000,
		browser: {
			screenshotFailures: false,
		},
	},
});
