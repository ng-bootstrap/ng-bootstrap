import { webdriverio } from '@vitest/browser-webdriverio';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		isolate: true,
		browser: {
			enabled: true,
			provider: webdriverio(),
			instances: [
				{
					browser: 'chrome',
					provider: webdriverio({
						user: process.env.SAUCE_USERNAME,
						key: process.env.SAUCE_ACCESS_KEY,
						region: 'eu',
						capabilities: {
							'sauce:options': {
								tunnelName: 'github-action-tunnel',
							},
							browserName: 'chrome',
							browserVersion: 'latest',
						},
					}),
				},
				{
					browser: 'firefox',
					provider: webdriverio({
						user: process.env.SAUCE_USERNAME,
						key: process.env.SAUCE_ACCESS_KEY,
						region: 'eu',
						capabilities: {
							'sauce:options': {
								tunnelName: 'github-action-tunnel',
							},
							browserName: 'firefox',
							browserVersion: 'latest',
						},
					}),
				},
				{
					browser: 'edge',
					provider: webdriverio({
						user: process.env.SAUCE_USERNAME,
						key: process.env.SAUCE_ACCESS_KEY,
						region: 'eu',
						capabilities: {
							'sauce:options': {
								tunnelName: 'github-action-tunnel',
							},
							browserName: 'MicrosoftEdge',
							browserVersion: 'latest',
							platformName: 'Windows 11',
						},
					}),
				},
				{
					browser: 'chrome',
					provider: webdriverio({
						user: process.env.SAUCE_USERNAME,
						key: process.env.SAUCE_ACCESS_KEY,
						region: 'eu',
						capabilities: {
							'sauce:options': {
								tunnelName: 'github-action-tunnel',
							},
							browserName: 'safari',
							browserVersion: '17',
							platformName: 'macOS 13',
						},
					}),
				},
			],
		},
	},
});
