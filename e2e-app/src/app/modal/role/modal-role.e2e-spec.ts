import { expect } from '@playwright/test';
import { test, getPage, setPage } from '../../../../baseTest';
import { sendKey } from '../../tools.po';
import { waitForModalCount, SELECTOR_MODAL_WINDOW } from '../modal.po';

import { openModal } from './modal-role.po';

test.use({ testURL: 'modal/role', testSelector: 'h3:text("Modal role tests")' });
test.beforeEach(async ({ page }) => setPage(page));

test.describe('Modal', () => {
	test.afterEach(async () => {
		await sendKey('Escape');
		await waitForModalCount(0);
	});

	test('should open modal with the default role', async () => {
		await openModal('default');

		await expect(getPage().locator(SELECTOR_MODAL_WINDOW)).toHaveAttribute('role', 'dialog');
	});

	test('should open modal with role="alertdialog"', async () => {
		await openModal('alertdialog');

		await expect(getPage().locator(SELECTOR_MODAL_WINDOW)).toHaveAttribute('role', 'alertdialog');
	});
});
