import { focusElement, sendKey } from '../../tools.po';
import { getPage } from '../../../../baseTest';
import { waitForModalCount } from '../../modal/modal.po';

export const SELECTOR_DATEPICKER = 'ngb-datepicker';
export const SELECTOR_DATEPICKER_BUTTON = '#datepicker-button';
export const SELECTOR_MODAL_WINDOW = 'ngb-modal-window';

export const openModal = async () => {
	await getPage().click('#open-modal');
	await waitForModalCount(1);
};

export const pressButton = async (buttonSelector) => {
	await focusElement(buttonSelector);
	await sendKey('Enter');
};
