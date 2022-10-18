import { test, getPage, setPage } from '../../../../baseTest';
import { sendKey } from '../../tools.po';
import { waitForOffcanvas } from '../offcanvas.po';

import {
	openOffcanvas,
	SELECTOR_CLOSE_BUTTON,
	SELECTOR_DISMISS_BUTTON,
	SELECTOR_CONFIRM_BUTTON,
	waitForConfirmationModal,
	clickOnOffcanvasBackdrop,
	clickOnModalBackdrop,
} from './offcanvas-stack-confirmation.po';

test.use({ testURL: 'offcanvas/stack-confirmation', testSelector: 'h3:text("Offcanvas stack confirmation test")' });
test.beforeEach(async ({ page }) => setPage(page));

test.describe('Offcanvas stack with confirmation', () => {
	test.afterEach(async () => {
		await waitForOffcanvas('absent');
	});

	test('should close modal and offcanvas correctly using close button', async () => {
		await openOffcanvas();

		// close with button
		await getPage().click(SELECTOR_CLOSE_BUTTON);
		await waitForConfirmationModal('present', 'Confirmation modal should be opened');

		// cancel closure with button
		await getPage().click(SELECTOR_DISMISS_BUTTON);
		await waitForConfirmationModal('absent', 'Confirmation modal should be dismissed');
		await waitForOffcanvas('present', 'Offcanvas should still be present');

		// close again
		await getPage().click(SELECTOR_CLOSE_BUTTON);
		await waitForConfirmationModal('present', 'Confirmation modal should be re-opened');

		// close modal and offcanvas
		await getPage().click(SELECTOR_CONFIRM_BUTTON);
	});

	test('should close modal and offcanvas correctly using ESC', async () => {
		await openOffcanvas();

		// close with Escape
		await sendKey('Escape');
		await waitForConfirmationModal('present', 'Confirmation modal should be opened');

		// cancel closure with Escape
		await sendKey('Escape');
		await waitForConfirmationModal('absent', 'Confirmation modal should be dismissed');
		await waitForOffcanvas('present', 'Offcanvas should still be present');

		// close again
		await sendKey('Escape');
		await waitForConfirmationModal('present', 'Confirmation modal should be re-opened');

		// close modal and offcanvas
		await getPage().click(SELECTOR_CONFIRM_BUTTON);
	});

	test('should close modal and offcanvas correctly using backdrop click', async () => {
		await openOffcanvas();

		// close with click
		await clickOnOffcanvasBackdrop();
		await waitForConfirmationModal('present', 'Confirmation modal should be opened');

		// cancel closure with click on modal backdrop
		await clickOnModalBackdrop();
		await waitForConfirmationModal('absent', 'Confirmation modal should be dismissed');

		// close again
		await clickOnOffcanvasBackdrop();
		await waitForConfirmationModal('present', 'Confirmation modal should be re-opened');

		// close all modals
		await getPage().click(SELECTOR_CONFIRM_BUTTON);
	});
});
