import {expect} from '@playwright/test';
import {getPage} from '../../../baseTest';

export const SELECTOR_OPEN_STATUS = '#open-status';
export const SELECTOR_TOOLTIP = 'ngb-tooltip-window';

export const expectTooltipToBeOpen = async(message: string) => {
  await getPage().waitForSelector(SELECTOR_TOOLTIP);
  expect(await getPage().textContent(SELECTOR_OPEN_STATUS), message).toBe('open');
};

export const expectTooltipToBeClosed = async(message: string) => {
  await getPage().waitForSelector(SELECTOR_TOOLTIP, {state: 'detached'});
  expect(await getPage().textContent(SELECTOR_OPEN_STATUS), message).toBe('closed');
};
