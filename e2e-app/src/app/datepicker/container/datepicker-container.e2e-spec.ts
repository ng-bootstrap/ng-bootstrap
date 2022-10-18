import { expect } from '@playwright/test';
import { getPage, setPage, test } from '../../../../baseTest';
import { sendKey } from '../../tools.po';
import {
	openModal,
	pressButton,
	SELECTOR_DATEPICKER,
	SELECTOR_DATEPICKER_BUTTON,
	SELECTOR_MODAL_WINDOW,
} from './datepicker-container.po';
import { waitForModalCount } from '../../modal/modal.po';

test.use({ testURL: 'datepicker/container', testSelector: 'h3:text("Datepicker container tests")' });
test.beforeEach(async ({ page }) => setPage(page));

test.describe('Datepicker container components', () => {
	const getZIndex = async (selector: string) =>
		getPage()
			.locator(selector)
			.evaluate((element) => parseInt(window.getComputedStyle(element).zIndex, 10));

	test('should show datepicker above modal window with container="body"', async () => {
		await openModal();

		// open datepicker
		await pressButton(SELECTOR_DATEPICKER_BUTTON);
		await expect(getPage().locator(SELECTOR_DATEPICKER), `Datepicker should be opened`).toBeVisible();

		const datepickerZIndex = await getZIndex(SELECTOR_DATEPICKER);
		const modalZIndex = await getZIndex(SELECTOR_MODAL_WINDOW);

		expect(datepickerZIndex, `Datepicker z-index should be defined`).not.toBeNaN();
		expect(modalZIndex, `Modal window z-index should be defined`).not.toBeNaN();
		expect(datepickerZIndex, `Datepicker should be shown above modal window`).toBeGreaterThanOrEqual(modalZIndex);

		// close datepicker
		await sendKey('Escape');
		// close modal
		await sendKey('Escape');
		await waitForModalCount(0);
	});
});
