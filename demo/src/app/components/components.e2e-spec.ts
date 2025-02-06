import { ConsoleMessage, test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

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
	'scrollspy',
	'table',
	'timepicker',
	'toast',
	'tooltip',
	'typeahead',
];

const TEST_TO_FIX = {
	accordion: ['aria-required-attr', 'color-contrast'],
	alert: ['color-contrast'],
	carousel: [],
	collapse: ['aria-valid-attr-value'],
	datepicker: ['button-name', 'color-contrast', 'label', 'select-name'],
	dropdown: ['button-name'],
	modal: ['color-contrast'],
	nav: ['aria-allowed-attr', 'aria-required-children'],
	offcanvas: [],
	pagination: [],
	popover: [],
	progressbar: ['color-contrast'],
	rating: ['aria-input-field-name'],
	scrollspy: ['color-contrast'],
	table: ['select-name'],
	timepicker: ['color-contrast'], //because of the alert
	toast: ['color-contrast'],
	tooltip: [],
	typeahead: [],
};

const makeAxeBuilder = (page: Page) => new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']);

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

	test('should not have any WCAG violations', async ({ page, baseURL }) => {
		for (const component of COMPONENTS) {
			await test.step(`${component} page`, async () => {
				await page.goto(`${baseURL}/components/${component}/examples`);
				await page.waitForSelector(SELECTOR_TAB_LINKS);
				expect(
					(await makeAxeBuilder(page).include('.card-body').disableRules(TEST_TO_FIX[component]).analyze()).violations,
				).toEqual([]);
			});
		}
	});
});
