import { expect } from '@playwright/test';
import { getPage } from '../../../../baseTest';
import { SELECTOR_DATEPICKER } from '../datepicker.po';

export const SELECTOR_OPEN_STATUS = '#open-status';

export const clickOutside = async () => await getPage().click('#outside-button');
export const rightClickOutside = async () => await getPage().click('#outside-button', { button: 'right' });

export const selectAutoClose = async (type: string) => {
	await getPage().click('#autoclose-dropdown');
	await getPage().click(`#autoclose-${type}`);
};

export const selectDisplayMonths = async (displayMonths: number) => {
	await getPage().click('#displayMonths-dropdown');
	await getPage().click(`#displayMonths-${displayMonths}`);
};

export const openDatepicker = async (message: string) => {
	await getPage().click('#selectDate');
	await getPage().click('#toggle');
	await expectDatepickerToBeOpen(message);
};

export const closeDatepicker = async (message: string) => {
	await getPage().click('#close');
	await expectDatepickerToBeClosed(message);
};

export const expectDatepickerToBeOpen = async function (message: string) {
	await getPage().waitForSelector(SELECTOR_DATEPICKER);
	await expect(getPage().locator(SELECTOR_OPEN_STATUS), message).toHaveText('open');
};

export const expectDatepickerToBeClosed = async (message: string) => {
	await getPage().waitForSelector(SELECTOR_DATEPICKER, { state: 'detached' });
	await expect(getPage().locator(SELECTOR_OPEN_STATUS), message).toHaveText('closed');
};
