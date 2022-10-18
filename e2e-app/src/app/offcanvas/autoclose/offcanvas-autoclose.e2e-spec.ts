import { test, getPage, setPage } from '../../../../baseTest';
import { sendKey } from '../../tools.po';
import { waitForOffcanvas, waitForNoChange, SELECTOR_OFFCANVAS, SELECTOR_BACKDROP } from '../offcanvas.po';

import { clickOnClose, clickOnReset, waitDismissReason, openOffcanvas } from './offcanvas-autoclose.po';

test.use({ testURL: 'offcanvas/autoclose', testSelector: 'h3:text("Offcanvas autoclose tests")' });
test.beforeEach(async ({ page }) => setPage(page));

test.describe('Offcanvas', () => {
	test.beforeEach(async () => {
		await clickOnReset();
	});

	test.afterEach(async () => {
		await waitForOffcanvas('absent');
	});

	test('should close offcanvas from the inside', async () => {
		await openOffcanvas();

		// close
		await clickOnClose();
		await waitDismissReason('Closed', `Offcanvas should have been closed`);
	});

	test('should close offcanvas on ESC', async () => {
		await openOffcanvas();

		// close
		await sendKey('Escape');
		await waitForOffcanvas('absent');
		await waitDismissReason('Escape', `Offcanvas should have been dismissed with 'Escape' reason`);
	});

	test(`should NOT close offcanvas on ESC when keyboard === 'false'`, async () => {
		await openOffcanvas('no-keyboard');
		await sendKey('Escape');
		await waitForNoChange();
		await waitForOffcanvas('present', 'The offcanvas should stay opened on ESC');
		await clickOnClose();
	});

	test('should close offcanvas on backdrop click', async () => {
		await openOffcanvas();

		// dialog click
		await getPage().click(SELECTOR_OFFCANVAS);
		await waitForNoChange();
		await waitForOffcanvas('present', 'The offcanvas should stay opened on dialog click');

		// Close
		await getPage().click(SELECTOR_BACKDROP);
		await waitForOffcanvas('absent', 'The offcanvas should be closed on backdrop click');
		await waitDismissReason('Click', `Offcanvas should have been dismissed with 'Click' reason`);
	});

	test(`should NOT close offcanvas on click with no backdrop`, async () => {
		await openOffcanvas('backdrop-false');

		// dialog click
		await getPage().click(SELECTOR_OFFCANVAS);
		await waitForNoChange();
		await waitForOffcanvas('present', 'The offcanvas should stay opened on offcanvas click');

		// close
		await getPage().click(SELECTOR_OFFCANVAS);
		await waitForNoChange();
		await waitForOffcanvas('present', 'The offcanvas should stay opened on backdrop click');
		await clickOnClose();
	});
});
