import { test, getPage, setPage } from '../../../../baseTest';
import { sendKey } from '../../tools.po';
import { waitForModalCount, waitForNoChange, SELECTOR_MODAL_DIALOG, SELECTOR_MODAL_WINDOW } from '../modal.po';

import { clickOnClose, clickOnReset, waitDismissReason, openModal } from './modal-autoclose.po';

test.use({ testURL: 'modal/autoclose', testSelector: 'h3:text("Modal autoclose tests")' });
test.beforeEach(async ({ page }) => setPage(page));

test.describe('Modal', () => {
	test.beforeEach(async () => {
		await clickOnReset();
	});

	test.afterEach(async () => {
		await waitForModalCount(0);
	});

	test('should close modal from the inside', async () => {
		await openModal();

		// close
		await clickOnClose();
		await waitDismissReason('Closed', `Modal should have been closed`);
	});

	test('should close modal on ESC', async () => {
		await openModal();

		// close
		await sendKey('Escape');
		await waitForModalCount(0);
		await waitDismissReason('Escape', `Modal should have been dismissed with 'Escape' reason`);
	});

	test(`should NOT close modal on ESC when keyboard === 'false'`, async () => {
		await openModal('no-keyboard');
		await sendKey('Escape');
		await waitForNoChange();
		await waitForModalCount(1, 'The modal should stay opened on ESC');
		await clickOnClose();
	});

	test('should close modal on backdrop click', async () => {
		await openModal();

		// dialog click
		await getPage().click(SELECTOR_MODAL_DIALOG);
		await waitForNoChange();
		await waitForModalCount(1, 'The modal should stay opened on dialog click');

		// Close
		await getPage().click(SELECTOR_MODAL_WINDOW);
		await waitForModalCount(0, 'The modal should be closed on backdrop click');
		await waitDismissReason('Click', `Modal should have been dismissed with 'Click' reason`);
	});

	test('should close modal when dragging from backdrop -> dialog', async () => {
		await openModal();
		await getPage().locator(SELECTOR_MODAL_WINDOW).dragTo(getPage().locator(SELECTOR_MODAL_DIALOG));
		await waitForModalCount(0, 'The modal should be closed on drag from backdrop -> dialog');
		await waitDismissReason('Click', `Modal should have been dismissed with 'Click' reason`);
	});

	test('should NOT close modal when dragging from dialog -> backdrop', async () => {
		await openModal();
		await getPage().locator(SELECTOR_MODAL_DIALOG).dragTo(getPage().locator(SELECTOR_MODAL_WINDOW));
		await waitForNoChange();
		await waitForModalCount(1, 'The modal should stay opened on drag from dialog -> backdrop');
		await clickOnClose();
	});

	test(`should NOT close modal on 'static' backdrop click`, async () => {
		await openModal('backdrop-static');

		// dialog click
		await getPage().click(SELECTOR_MODAL_DIALOG);
		await waitForNoChange();
		await waitForModalCount(1, 'The modal should stay opened on dialog click');

		// close
		await getPage().click(SELECTOR_MODAL_WINDOW);
		await waitForNoChange();
		await waitForModalCount(1, 'The modal should stay opened on backdrop click');
		await clickOnClose();
	});

	test(`should NOT close modal on click with no backdrop`, async () => {
		await openModal('backdrop-false');

		// dialog click
		await getPage().click(SELECTOR_MODAL_DIALOG);
		await waitForNoChange();
		await waitForModalCount(1, 'The modal should stay opened on dialog click');

		// close
		await getPage().click(SELECTOR_MODAL_WINDOW);
		await waitForNoChange();
		await waitForModalCount(1, 'The modal should stay opened on backdrop click');
		await clickOnClose();
	});
});
