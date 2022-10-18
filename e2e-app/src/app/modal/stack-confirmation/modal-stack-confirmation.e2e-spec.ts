import { test, getPage, setPage } from '../../../../baseTest';
import { sendKey } from '../../tools.po';
import { waitForModalCount } from '../modal.po';

import {
	openModal,
	clickOnModal,
	SELECTOR_CLOSE_BUTTON,
	SELECTOR_DISMISS_BUTTON,
	SELECTOR_CONFIRM_BUTTON,
} from './modal-stack-confirmation.po';

test.use({ testURL: 'modal/stack-confirmation', testSelector: 'h3:text("Modal stack confirmation test")' });
test.beforeEach(async ({ page }) => setPage(page));

test.describe('Modal stack with confirmation', () => {
	test.afterEach(async () => {
		await waitForModalCount(0);
	});

	test('should close modals correctly using close button', async () => {
		await openModal();

		// close with button
		await getPage().click(SELECTOR_CLOSE_BUTTON);
		await waitForModalCount(2, 'Confirmation modal should be opened');

		// cancel closure with button
		await getPage().click(SELECTOR_DISMISS_BUTTON);
		await waitForModalCount(1, 'Confirmation modal should be dismissed');

		// close again
		await getPage().click(SELECTOR_CLOSE_BUTTON);
		await waitForModalCount(2, 'Confirmation modal should be re-opened');

		// close all modals
		await getPage().click(SELECTOR_CONFIRM_BUTTON);
	});

	test('should close modals correctly using ESC', async () => {
		await openModal();

		// close with Escape
		await sendKey('Escape');
		await waitForModalCount(2, 'Confirmation modal should be opened');

		// cancel closure with Escape
		await sendKey('Escape');
		await waitForModalCount(1, 'Confirmation modal should be dismissed');

		// close again
		await sendKey('Escape');
		await waitForModalCount(2, 'Confirmation modal should be re-opened');

		// close all modals
		await getPage().click(SELECTOR_CONFIRM_BUTTON);
	});

	test('should close modals correctly using backdrop click', async () => {
		await openModal();

		// close with click
		await clickOnModal(0);
		await waitForModalCount(2, 'Confirmation modal should be opened');

		// cancel closure with click
		await clickOnModal(1);
		await waitForModalCount(1, 'Confirmation modal should be dismissed');

		// close again
		await clickOnModal(0);
		await waitForModalCount(2, 'Confirmation modal should be re-opened');

		// close all modals
		await getPage().click(SELECTOR_CONFIRM_BUTTON);
	});
});
