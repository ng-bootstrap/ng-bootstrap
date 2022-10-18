import { expect } from '@playwright/test';
import { getPage, getBrowserName } from '../../../baseTest';
export const SELECTOR_OFFCANVAS = 'ngb-offcanvas-panel';
export const SELECTOR_BACKDROP = 'ngb-offcanvas-backdrop';

const defaultErrorMessage = (state: 'present' | 'absent') => {
	return `Expected offcanvas to be ${state}`;
};

/**
 * @param state
 * @param errorMessage
 */
export const waitForOffcanvas = async (
	state: 'present' | 'absent' = 'present',
	errorMessage = defaultErrorMessage(state),
) => {
	// These successive waiting functions, done in this order, render the test suite more stable.
	await expect(getPage().locator(SELECTOR_OFFCANVAS), errorMessage).toHaveCount(state === 'absent' ? 0 : 1);

	if (getBrowserName() === 'webkit') {
		// Need some extra time for webkit, otherwise the offcanvas tests are not stable.
		await getPage().waitForTimeout(50);
	}
};

/**
 * Wait a short time before checking that nothing changed
 */
export const waitForNoChange = async () => {
	await getPage().waitForTimeout(25);
};
