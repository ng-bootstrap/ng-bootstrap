import { Page, test as baseTest } from '@playwright/test';
import { randomBytes } from 'crypto';
import { promises as fs } from 'fs';
import { join } from 'path';

let globalPage: Page | null = null;
export const getPage = (): Page => {
	return globalPage;
};
export const setPage = (page: Page | null) => {
	globalPage = page;
};
let globalBrowserName: 'chromium' | 'firefox' | 'webkit' | null = null;
export const getBrowserName = () => {
	return globalBrowserName;
};

export interface Fixtures {
	testURL: string;
	testSelector: string;
}

export const test = baseTest.extend<Fixtures>({
	testURL: '',
	testSelector: '',
	page: async ({ page, baseURL, testURL, testSelector, browserName }, use) => {
		globalBrowserName = browserName;
		if (!testURL || !testSelector) {
			throw new Error('testURL and testSelector must be defined!');
		}

		// Listen for all console events and handle errors
		page.on('console', async (msg) => {
			const type = msg.type();
			if (type === 'error' || type === 'warning') {
				test.fail(true, msg.text());
			}
		});

		// Log all uncaught errors to the terminal
		page.on('pageerror', (exception) => {
			console.log(`Uncaught exception:\n${exception}`);
		});

		await page.goto(`${baseURL}/${testURL}`);
		await page.waitForSelector(testSelector);

		await use(page);

		const coverage: string = await page.evaluate('JSON.stringify(window.__coverage__);');
		if (coverage) {
			const name = randomBytes(32).toString('hex');
			await fs.writeFile(join(__dirname, '..', '.nyc_output', `${name}.json`), coverage);
		}
		globalPage = null;
	},
});
