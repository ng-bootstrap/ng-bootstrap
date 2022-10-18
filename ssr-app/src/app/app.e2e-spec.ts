import { ConsoleMessage, test, expect } from '@playwright/test';

const SELECTOR_HEADER = 'h1';

test.describe('SSR application', () => {
	let messages: ConsoleMessage[] = [];

	test.beforeEach(async ({ page, baseURL }) => {
		messages = [];
		await page.goto(baseURL);
		page.on('console', (msg) => messages.push(msg));

		await page.waitForSelector(SELECTOR_HEADER);
	});

	test.afterEach(async () => {
		if (messages.length > 0) {
			console.log(messages);
			test.fail(true, 'Unexpected console messages found');
		}
	});

	test('should open server side rendered page without failures', async ({ page }) => {
		expect(await page.innerText(SELECTOR_HEADER)).toBe('ng-bootstrap SSR test application');
	});
});
