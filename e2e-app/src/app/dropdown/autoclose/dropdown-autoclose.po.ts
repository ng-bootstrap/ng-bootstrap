import { expect } from '@playwright/test';
import { getPage } from '../../../../baseTest';
import { isDropdownOpened, toggleDropdown } from '../dropdown.po';

export const SELECTOR_OPEN_STATUS = '#open-status';
export const SELECTOR_DROPDOWN = '#dropdown';
export const SELECTOR_DROPDOWN_MENU = '#dropdownMenuId';
export const SELECTOR_DROPDOWN_TOGGLE = '#dropdown >> button[ngbDropdownToggle]';
export const SELECTOR_DROPDOWN_ITEM = '#item-1';
export const SELECTOR_FORM_INPUT = '#dropdownMenuId >> input';

export const expectDropdownToBeVisible = async (message: string) => {
	await getPage().waitForSelector(SELECTOR_DROPDOWN_ITEM);
	expect(await isDropdownOpened(SELECTOR_DROPDOWN), message).toBeTruthy();
	await expect(getPage().locator(SELECTOR_OPEN_STATUS), message).toHaveText('open');
};

export const expectDropdownToBeHidden = async (message: string) => {
	await getPage().waitForSelector(SELECTOR_DROPDOWN_ITEM, { state: 'hidden' });
	expect(await isDropdownOpened(SELECTOR_DROPDOWN), message).toBeFalsy();
	await expect(getPage().locator(SELECTOR_OPEN_STATUS), message).toHaveText('closed');
};

export const openDropdown = async (message: string) => {
	await toggleDropdown(SELECTOR_DROPDOWN);
	await expectDropdownToBeVisible(message);
};

export const closeDropdown = async (message: string) => {
	await toggleDropdown(SELECTOR_DROPDOWN);
	await expectDropdownToBeHidden(message);
};

export const clickDropdownItem = async () => await getPage().click(SELECTOR_DROPDOWN_ITEM);
export const rightClickDropdownItem = async () => await getPage().click(SELECTOR_DROPDOWN_ITEM, { button: 'right' });

export const clickOutside = async () => await getPage().click('#outside-button');
export const rightClickOutside = async () => await getPage().click('#outside-button', { button: 'right' });

export const selectAutoClose = async (type: string) => {
	await getPage().click('#autoclose-dropdown');
	await getPage().click(`#autoclose-${type}`);
};
