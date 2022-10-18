import { expect } from '@playwright/test';
import { getPage } from '../../../baseTest';

const SELECTOR_DROPDOWN = '[ngbDropdown]';

const expectDropdownToBeVisible = async (message: string, selector: string, toBody: boolean) => {
	if (toBody) {
		await getPage().waitForSelector(`body > div > [ngbDropdownMenu]`);
	} else {
		await getPage().waitForSelector(`${selector} >> [ngbDropdownItem]`);
	}
	expect(await isDropdownOpened(selector), message).toBeTruthy();
};

const expectDropdownToBeHidden = async (message: string, selector: string, toBody: boolean) => {
	if (toBody) {
		await getPage().waitForSelector(`body > div > [ngbDropdownMenu]`, { state: 'hidden' });
	} else {
		await getPage().waitForSelector(`${selector} >> [ngbDropdownItem]`, { state: 'hidden' });
	}
	expect(await isDropdownOpened(selector), message).toBeFalsy();
};

export const isDropdownOpened = async (selector = SELECTOR_DROPDOWN) => {
	const classNames = await getPage().getAttribute(selector, 'class');
	return classNames!.includes('show');
};

export const toggleDropdown = async (selector: string) => {
	const expectedState = !(await isDropdownOpened(selector));
	await getPage().click(`${selector} >> [ngbDropdownToggle]`);
	if (expectedState) {
		expect(await isDropdownOpened(selector), `Dropdown should have been opened`).toBeTruthy();
	} else {
		expect(await isDropdownOpened(selector), `Dropdown should have been closed`).toBeFalsy();
	}
};

export const openDropdown = async (errorMessage = '', selector = SELECTOR_DROPDOWN, toBody = false) => {
	await toggleDropdown(selector);
	await expectDropdownToBeVisible(errorMessage, selector, toBody);
};

export const closeDropdown = async (errorMessage = '', selector = SELECTOR_DROPDOWN, toBody = false) => {
	await toggleDropdown(selector);
	await expectDropdownToBeHidden(errorMessage, selector, toBody);
};
