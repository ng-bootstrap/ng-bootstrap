import { expect } from '@playwright/test';
import { test, getPage, setPage } from '../../../../baseTest';
import { SELECTOR_HOUR, SELECTOR_MIN, SELECTOR_SEC } from '../timepicker.po';

test.use({ testURL: 'timepicker/filter', testSelector: 'h3:text("Timepicker filtering")' });
test.beforeEach(async ({ page }) => setPage(page));

test.describe('Timepicker Filter', () => {
	async function expectValue(expectedValue) {
		const hh = await getPage().$eval(SELECTOR_HOUR, (el: HTMLInputElement) => el.value);
		const mm = await getPage().$eval(SELECTOR_MIN, (el: HTMLInputElement) => el.value);
		const ss = await getPage().$eval(SELECTOR_SEC, (el: HTMLInputElement) => el.value);

		expect(`${hh}:${mm}:${ss}`).toBe(expectedValue);
	}

	test.describe('filter', () => {
		test(`should accept numbers`, async () => {
			await expectValue('::'); // No starting values

			await getPage().type(SELECTOR_HOUR, '1');
			await getPage().type(SELECTOR_MIN, '2');
			await getPage().type(SELECTOR_SEC, '3');

			await getPage().click(SELECTOR_HOUR);
			await expectValue('01:02:03');
		});

		test(`shouldn't accept alpha`, async () => {
			await expectValue('::'); // No starting values

			await getPage().type(SELECTOR_HOUR, 'A');
			await getPage().type(SELECTOR_MIN, 'A');
			await getPage().type(SELECTOR_SEC, 'A');

			await getPage().click(SELECTOR_HOUR);
			await expectValue('::');
		});
	});
});
