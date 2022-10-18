import { expect } from '@playwright/test';
import { test, getPage, setPage } from '../../../../baseTest';
import { sendKey } from '../../tools.po';
import { waitForModalCount, SELECTOR_MODAL_WINDOW } from '../modal.po';

import {
	openModal,
	SELECTOR_MODAL_CONTENT,
	SELECTOR_DISMISS_BUTTON,
	SELECTOR_CLOSE_BUTTON,
	SELECTOR_MODAL_INPUT,
	SELECTOR_MODAL_HEADER,
} from './modal-focus.po';

test.use({ testURL: 'modal/focus', testSelector: 'h3:text("Modal focus tests")' });
test.beforeEach(async ({ page }) => setPage(page));

test.describe('Modal', () => {
	test.afterEach(async () => {
		await sendKey('Escape');
		await waitForModalCount(0);
	});

	test('should close modal on ESC and re-focus trigger button', async () => {
		await openModal('simple');

		// close
		await sendKey('Escape');
		await waitForModalCount(0, 'The modal should be closed on ESC');

		await expect(getPage().locator('#open-modal-simple'), 'Should focus trigger button after closing').toBeFocused();
	});

	test('should close modal on window click and re-focus trigger button', async () => {
		await openModal('simple');

		// close
		await getPage().click(SELECTOR_MODAL_WINDOW);
		await waitForModalCount(0, 'The modal should be closed on click');

		// button should be focused
		await expect(getPage().locator('#open-modal-simple'), 'Should focus trigger button after closing').toBeFocused();
	});

	test('should focus body if opener is not focusable', async () => {
		await openModal('disable');

		// close
		await sendKey('Escape');
		await waitForModalCount(0, 'The modal should be closed on ESC');

		// body should be focused
		await expect(getPage().locator('body'), 'Should focus body after closing').toBeFocused();
	});

	test('should focus modal window if there is no focusable content after opening', async () => {
		await openModal('simple');

		// window should be focused
		await expect(getPage().locator(SELECTOR_MODAL_CONTENT)).toHaveText('Modal content');
		await expect(getPage().locator(SELECTOR_MODAL_WINDOW), 'ngb-modal-window should be focused').toBeFocused();
	});

	test('should focus first focusable element after opening', async () => {
		await openModal('template');
		await expect(getPage().locator(SELECTOR_DISMISS_BUTTON), 'Modal dismiss button should be focused').toBeFocused();
	});

	test('should focus element with [ngbAutofocus] after opening', async () => {
		await openModal('autofocus');
		await expect(
			getPage().locator(SELECTOR_CLOSE_BUTTON),
			'Modal close button should be focused, because of ngbAutoFocus',
		).toBeFocused();
	});

	test('should trap focus inside opened modal (Tab)', async () => {
		await openModal('template');

		// dismiss -> input -> close -> dismiss
		await expect(getPage().locator(SELECTOR_DISMISS_BUTTON), 'Modal dismiss button should be focused').toBeFocused();

		await sendKey('Tab');
		await expect(getPage().locator(SELECTOR_MODAL_INPUT), 'Modal input should be focused').toBeFocused();

		await sendKey('Tab');
		await expect(getPage().locator(SELECTOR_CLOSE_BUTTON), 'Modal close button should be focused').toBeFocused();

		await sendKey('Tab');
		await expect(getPage().locator(SELECTOR_DISMISS_BUTTON), 'Modal dismiss button should be focused').toBeFocused();
	});

	test('should trap focus inside opened modal (Shift + Tab)', async () => {
		await openModal('template');

		// dismiss -> close -> input -> dismiss
		await expect(getPage().locator(SELECTOR_DISMISS_BUTTON), 'Modal dismiss button should be focused').toBeFocused();

		await sendKey('Shift+Tab');
		await expect(getPage().locator(SELECTOR_CLOSE_BUTTON), 'Modal close button should be focused').toBeFocused();

		await sendKey('Shift+Tab');
		await expect(getPage().locator(SELECTOR_MODAL_INPUT), 'Modal input should be focused').toBeFocused();

		await sendKey('Shift+Tab');
		await expect(getPage().locator(SELECTOR_DISMISS_BUTTON), 'Modal dismiss button should be focused').toBeFocused();
	});

	test('should keep focus trap inside the modal when clicking on content and navigating away (Tab)', async () => {
		await openModal('template');

		// click on the header
		await getPage().click(SELECTOR_MODAL_HEADER);
		await expect(getPage().locator(SELECTOR_MODAL_WINDOW), 'Modal window should be focused').toBeFocused();

		// re-focus
		await sendKey('Tab');
		await expect(getPage().locator(SELECTOR_DISMISS_BUTTON), 'Modal dismiss button should be focused').toBeFocused();
	});

	test('should keep focus trap inside the modal when clicking on content and navigating away (Shift + Tab)', async () => {
		await openModal('template');

		// click on the header
		await getPage().click(SELECTOR_MODAL_HEADER);
		await expect(getPage().locator(SELECTOR_MODAL_WINDOW), 'Modal window should be focused').toBeFocused();

		// re-focus
		await sendKey('Shift+Tab');
		await expect(getPage().locator(SELECTOR_CLOSE_BUTTON), 'Modal close button should be focused').toBeFocused();
	});
});
