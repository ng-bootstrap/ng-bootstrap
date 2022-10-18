import { PlaywrightTestConfig } from '@playwright/test';
import { join } from 'path';

export const baseURL = 'http://localhost:4200/#';

const reportsDir = join(__dirname, '..', 'test-reports', 'demo');

const config: PlaywrightTestConfig = {
	reporter: [
		[process.env.CI ? 'github' : 'list'],
		['html', { open: 'never', outputFolder: join(reportsDir, 'report') }],
	],
	outputDir: join(reportsDir, 'traces'),
	fullyParallel: true,
	testDir: 'src',
	testMatch: /\.e2e-spec\.ts$/,
	timeout: 60000,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	webServer: {
		command: 'yarn demo -c playwright',
		timeout: 300000,
		url: baseURL,
		reuseExistingServer: !process.env.CI,
	},
	use: { baseURL, viewport: { width: 1280, height: 720 }, trace: 'retain-on-failure' },
};

export default config;
