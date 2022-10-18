import { expect } from '@playwright/test';
import { test, getPage, setPage } from '../../../../baseTest';
import { sendKey } from '../../tools.po';
import { waitForOffcanvas, SELECTOR_OFFCANVAS, SELECTOR_BACKDROP } from '../offcanvas.po';

import {
	openOffcanvas,
	SELECTOR_OFFCANVAS_CONTENT,
	SELECTOR_DISMISS_BUTTON,
	SELECTOR_CLOSE_BUTTON,
	SELECTOR_OFFCANVAS_INPUT,
	SELECTOR_OFFCANVAS_HEADER,
} from './offcanvas-focus.po';

test.use({ testURL: 'offcanvas/focus', testSelector: 'h3:text("Offcanvas focus tests")' });
test.beforeEach(async ({ page }) => setPage(page));

test.describe('Offcanvas', () => {
	test.afterEach(async () => {
		await sendKey('Escape');
		await waitForOffcanvas('absent');
	});

	test('should close offcanvas on ESC and re-focus trigger button', async () => {
		await openOffcanvas('simple');

		// close
		await sendKey('Escape');
		await waitForOffcanvas('absent', 'The offcanvas should be closed on ESC');

		await expect(
			getPage().locator('#open-offcanvas-simple'),
			'Should focus trigger button after closing',
		).toBeFocused();
	});

	test('should close offcanvas on backdrop click and re-focus trigger button', async () => {
		await openOffcanvas('simple');

		// close
		await getPage().click(SELECTOR_BACKDROP);
		await waitForOffcanvas('absent', 'The offcanvas should be closed on click');

		// button should be focused
		await expect(
			getPage().locator('#open-offcanvas-simple'),
			'Should focus trigger button after closing',
		).toBeFocused();
	});

	test('should focus body if opener is not focusable', async () => {
		await openOffcanvas('disable');

		// close
		await sendKey('Escape');
		await waitForOffcanvas('absent', 'The offcanvas should be closed on ESC');

		// body should be focused
		await expect(getPage().locator('body'), 'Should focus body after closing').toBeFocused();
	});

	// TODO I have no idea why this test does not pass
	test.skip('should focus offcanvas panel if there is no focusable content after opening', async () => {
		await openOffcanvas('simple');

		// panel should be focused
		await expect(getPage().locator(SELECTOR_OFFCANVAS_CONTENT)).toHaveText('Offcanvas content');
		await expect(getPage().locator(SELECTOR_OFFCANVAS), 'ngb-offcanvas-panel should be focused').toBeFocused();
	});

	test('should focus first focusable element after opening', async () => {
		await openOffcanvas('template');
		await expect(
			getPage().locator(SELECTOR_DISMISS_BUTTON),
			'Offcanvas dismiss button should be focused',
		).toBeFocused();
	});

	test('should focus element with [ngbAutofocus] after opening', async () => {
		await openOffcanvas('autofocus');
		await expect(
			getPage().locator(SELECTOR_CLOSE_BUTTON),
			'Offcanvas close button should be focused, because of ngbAutoFocus',
		).toBeFocused();
	});

	test('should trap focus inside opened offcanvas (Tab)', async () => {
		await openOffcanvas('template');

		// dismiss -> input -> close -> dismiss
		await expect(
			getPage().locator(SELECTOR_DISMISS_BUTTON),
			'Offcanvas dismiss button should be focused',
		).toBeFocused();

		await sendKey('Tab');
		await expect(getPage().locator(SELECTOR_OFFCANVAS_INPUT), 'Offcanvas input should be focused').toBeFocused();

		await sendKey('Tab');
		await expect(getPage().locator(SELECTOR_CLOSE_BUTTON), 'Offcanvas close button should be focused').toBeFocused();

		await sendKey('Tab');
		await expect(
			getPage().locator(SELECTOR_DISMISS_BUTTON),
			'Offcanvas dismiss button should be focused',
		).toBeFocused();
	});

	test('should trap focus inside opened offcanvas (Shift + Tab)', async () => {
		await openOffcanvas('template');

		// dismiss -> close -> input -> dismiss
		await expect(
			getPage().locator(SELECTOR_DISMISS_BUTTON),
			'Offcanvas dismiss button should be focused',
		).toBeFocused();

		await sendKey('Shift+Tab');
		await expect(getPage().locator(SELECTOR_CLOSE_BUTTON), 'Offcanvas close button should be focused').toBeFocused();

		await sendKey('Shift+Tab');
		await expect(getPage().locator(SELECTOR_OFFCANVAS_INPUT), 'Offcanvas input should be focused').toBeFocused();

		await sendKey('Shift+Tab');
		await expect(
			getPage().locator(SELECTOR_DISMISS_BUTTON),
			'Offcanvas dismiss button should be focused',
		).toBeFocused();
	});

	test('should keep focus trap inside the offcanvas when clicking on content and navigating away (Tab)', async () => {
		await openOffcanvas('template');

		// click on the header
		await getPage().click(SELECTOR_OFFCANVAS_HEADER);
		await expect(getPage().locator(SELECTOR_OFFCANVAS), 'Offcanvas panel should be focused').toBeFocused();

		// re-focus
		await sendKey('Tab');
		await expect(
			getPage().locator(SELECTOR_DISMISS_BUTTON),
			'Offcanvas dismiss button should be focused',
		).toBeFocused();
	});

	test('should keep focus trap inside the offcanvas when clicking on content and navigating away (Shift + Tab)', async () => {
		await openOffcanvas('template');

		// click on the header
		await getPage().click(SELECTOR_OFFCANVAS_HEADER);
		await expect(getPage().locator(SELECTOR_OFFCANVAS), 'Offcanvas panel should be focused').toBeFocused();

		// re-focus
		await sendKey('Shift+Tab');
		await expect(getPage().locator(SELECTOR_CLOSE_BUTTON), 'Offcanvas close button should be focused').toBeFocused();
	});
});
