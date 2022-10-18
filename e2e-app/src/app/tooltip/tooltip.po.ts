import { expect } from '@playwright/test';
import { getPage } from '../../../baseTest';

export const SELECTOR_OPEN_STATUS = '#open-status';
export const SELECTOR_TOOLTIP = 'ngb-tooltip-window';

export const expectTooltipToBeOpen = async (message: string) => {
	await getPage().waitForSelector(SELECTOR_TOOLTIP);
	await expect(getPage().locator(SELECTOR_OPEN_STATUS), message).toHaveText('open');
};

export const expectTooltipToBeClosed = async (message: string) => {
	await getPage().waitForSelector(SELECTOR_TOOLTIP, { state: 'detached' });
	await expect(getPage().locator(SELECTOR_OPEN_STATUS), message).toHaveText('closed');
};
