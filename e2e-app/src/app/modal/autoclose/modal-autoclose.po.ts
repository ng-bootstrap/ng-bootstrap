import { expect } from '@playwright/test';
import { getPage } from '../../../../baseTest';
import { waitForModalCount } from '../modal.po';

export const clickOnReset = async () => {
	await getPage().click('#reset-button');
};

export const clickOnClose = async () => {
	await getPage().click('#modal-close-button');
	await waitForModalCount(0);
};

export const openModal = async (option = '') => {
	if (option !== '') {
		await getPage().click(`#option-${option}`);
	}

	await getPage().click('#open-modal');
	await waitForModalCount(1);
};

export const waitDismissReason = async (expected, error) => {
	await expect(getPage().locator('#dismiss-reason'), error).toHaveText(expected);
};
