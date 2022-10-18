import { expect } from '@playwright/test';
import { getCaretPosition, sendKey } from '../../tools.po';
import { test, getPage, setPage } from '../../../../baseTest';
import { SELECTOR_HOUR, SELECTOR_MIN, SELECTOR_SEC } from '../timepicker.po';

const SELECTOR_BEFORE = '#before';
const SELECTOR_AFTER = '#after';

const focusInputBefore = async () => await getPage().click('#before');

test.use({ testURL: 'timepicker/navigation', testSelector: 'h3:text("Timepicker navigation")' });
test.beforeEach(async ({ page }) => setPage(page));

test.describe('Timepicker', () => {
	async function expectCaretPosition(selector: string, position: number) {
		const { start, end } = await getCaretPosition(selector);
		expect(end, 'Caret should be at single position (no range selected)').toBe(end);
		expect(start, `Caret is not at proper position for given field`).toBe(position);
	}

	test.describe('navigation', () => {
		test(`should jump between inputs`, async () => {
			await focusInputBefore();

			await sendKey('Tab');
			await expect(getPage().locator(SELECTOR_HOUR), 'Hour field should be focused').toBeFocused();
			await sendKey('Tab');
			await expect(getPage().locator(SELECTOR_MIN), 'Minute field should be focused').toBeFocused();
			await sendKey('Tab');
			await expect(getPage().locator(SELECTOR_SEC), 'Second field should be focused').toBeFocused();
			await sendKey('Tab');
			await expect(getPage().locator(SELECTOR_AFTER), 'Input after should be focused').toBeFocused();

			await sendKey('Shift+Tab');
			await expect(getPage().locator(SELECTOR_SEC), 'Second field should be focused').toBeFocused();
			await sendKey('Shift+Tab');
			await expect(getPage().locator(SELECTOR_MIN), 'Minute field should be focused').toBeFocused();
			await sendKey('Shift+Tab');
			await expect(getPage().locator(SELECTOR_HOUR), 'Hour field should be focused').toBeFocused();
			await sendKey('Shift+Tab');
			await expect(getPage().locator(SELECTOR_BEFORE), 'Input before should be focused').toBeFocused();
		});
	});

	test.describe('arrow keys', () => {
		test.skip(({ browserName }) => browserName === 'firefox' || browserName === 'webkit');

		test(`should keep caret at the end of the input`, async () => {
			for (const selector of [SELECTOR_HOUR, SELECTOR_MIN, SELECTOR_SEC]) {
				await getPage().click(selector);

				const expectCaretAtEnd = () => expectCaretPosition(selector, 2);

				await sendKey('End');
				await expectCaretAtEnd();

				await sendKey('ArrowUp');
				await expectCaretAtEnd();

				await sendKey('ArrowDown');
				await expectCaretAtEnd();

				await sendKey('Home');
				await expectCaretPosition(selector, 0);

				await sendKey('ArrowUp');
				await expectCaretAtEnd();

				await sendKey('ArrowDown');
				await expectCaretAtEnd();
			}
		});
	});
});
