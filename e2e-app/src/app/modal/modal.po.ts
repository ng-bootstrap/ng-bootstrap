import { expect } from '@playwright/test';
import { getPage, getBrowserName } from '../../../baseTest';
export const SELECTOR_MODAL_DIALOG = '.modal-dialog';
export const SELECTOR_MODAL_WINDOW = 'ngb-modal-window';

const defaultErrorMessage = (modalNumber) => {
	return modalNumber ? `Number of expected modals : ${modalNumber}` : `There should be no open modal windows`;
};

/**
 *
 * @param modalNumber Expected modal number
 * @param errorMessage
 */
export const waitForModalCount = async (modalNumber, errorMessage = defaultErrorMessage(modalNumber)) => {
	// These successive waiting functions, done in this order, render the test suite more stable.
	if (modalNumber) {
		await expect(getPage().locator('body'), errorMessage).toHaveClass('modal-open');
	} else {
		await expect(getPage().locator('body'), errorMessage).not.toHaveClass('modal-open');
	}
	await expect(getPage().locator(SELECTOR_MODAL_WINDOW), errorMessage).toHaveCount(modalNumber);
	await expect(getPage().locator(SELECTOR_MODAL_DIALOG), errorMessage).toHaveCount(modalNumber);

	if (getBrowserName() === 'webkit') {
		// Need some extra time for webkit, otherwise the modal tests are not stable.
		await getPage().waitForTimeout(50);
	}
};

/**
 * Wait a short time before checking that nothing changed
 */
export const waitForNoChange = async () => {
	await getPage().waitForTimeout(25);
};
