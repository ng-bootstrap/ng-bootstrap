import { expect } from '@playwright/test';
import { getPage } from '../../../../baseTest';
import { waitForOffcanvas } from '../offcanvas.po';

export const clickOnReset = async () => {
	await getPage().click('#reset-button');
};

export const clickOnClose = async () => {
	await getPage().click('#offcanvas-close-button');
	await waitForOffcanvas('absent');
};

export const openOffcanvas = async (option = '') => {
	if (option !== '') {
		await getPage().click(`#option-${option}`);
	}

	await getPage().click('#open-offcanvas');
	await waitForOffcanvas('present');
};

export const waitDismissReason = async (expected, error) => {
	await expect(getPage().locator('#dismiss-reason'), error).toHaveText(expected);
};
