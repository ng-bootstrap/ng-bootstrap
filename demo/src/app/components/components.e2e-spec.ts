import { ConsoleMessage, test, expect } from '@playwright/test';

const SELECTOR_TAB_LINKS = 'header.title a.nav-link';
const SELECTOR_SIDE_NAV_COMPONENT_LINKS = 'ngbd-side-nav >> a[href^="#/components/"]';
const SELECTOR_CODE_BUTTONS = 'button.toggle-code';

const COMPONENTS = [
	'accordion',
	'alert',
	'carousel',
	'collapse',
	'datepicker',
	'dropdown',
	'modal',
	'nav',
	'offcanvas',
	'pagination',
	'popover',
	'progressbar',
	'rating',
	'table',
	'timepicker',
	'toast',
	'tooltip',
	'typeahead',
];

test.describe(`Components`, () => {
	let messages: ConsoleMessage[] = [];

	test.beforeEach(async ({ page, baseURL }) => {
		messages = [];
		await page.goto(`${baseURL}/components`);
		page.on('console', (msg) => messages.push(msg));

		await page.waitForSelector(SELECTOR_SIDE_NAV_COMPONENT_LINKS);
	});

	test.afterEach(async () => {
		if (messages.length > 0) {
			console.log(messages);
			test.fail(true, 'Unexpected console messages found');
		}
	});

	test('should load successfully', async ({ page }) => {
		await test.step('should cover all components we have', async () => {
			for (const link of await page.$$(SELECTOR_SIDE_NAV_COMPONENT_LINKS)) {
				const componentName = await link.innerText();
				expect(COMPONENTS, `'${componentName}' is not covered by demo e2e tests`).toContain(
					componentName.toLowerCase(),
				);
			}
		});

		for (const component of COMPONENTS) {
			await test.step(`${component} page`, async () => {
				const SELECTOR_EXAMPLE_LINK = `a[href="#/components/${component}/examples"]`;
				const SELECTOR_SIDE_NAV_COMPONENT_LINK = `ngbd-side-nav >> a[href^="#/components/${component}"]`;

				await page.click(SELECTOR_SIDE_NAV_COMPONENT_LINK);
				await page.waitForSelector(SELECTOR_TAB_LINKS);

				await test.step(`should display the tabs`, async () => {
					for (const link of await page.$$(SELECTOR_TAB_LINKS)) {
						await link.click();
					}
				});

				await test.step(`should display code samples`, async () => {
					await page.click(SELECTOR_EXAMPLE_LINK);
					for (const link of await page.$$(SELECTOR_CODE_BUTTONS)) {
						await link.click();
					}
				});
			});
		}
	});
});
