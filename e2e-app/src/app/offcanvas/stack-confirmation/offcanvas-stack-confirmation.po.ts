import { getPage } from '../../../../baseTest';
import { SELECTOR_BACKDROP } from '../offcanvas.po';
import { waitForOffcanvas } from '../offcanvas.po';
import { expect } from '@playwright/test';

export const SELECTOR_OFFCANVAS_BUTTON = '#open-offcanvas';
export const SELECTOR_STACK_MODAL = '#stack-modal';
export const SELECTOR_STACK_MODAL_BACKDROP = 'ngb-modal-window';
export const SELECTOR_CLOSE_BUTTON = '#close';
export const SELECTOR_CONFIRM_BUTTON = '#confirm';
export const SELECTOR_DISMISS_BUTTON = '#dismiss';

export const openOffcanvas = async () => {
	await getPage().click(SELECTOR_OFFCANVAS_BUTTON);
	await waitForOffcanvas('present');
};

export const clickOnOffcanvasBackdrop = async () => {
	const modals = await getPage().locator(SELECTOR_BACKDROP).click();
};

export const clickOnModalBackdrop = async () => {
	const modals = await getPage().locator(SELECTOR_STACK_MODAL_BACKDROP).click();
};

export const waitForConfirmationModal = async (state: 'present' | 'absent', errorMessage: string) => {
	await expect(getPage().locator(SELECTOR_STACK_MODAL), errorMessage).toHaveCount(state === 'absent' ? 0 : 1);
};
