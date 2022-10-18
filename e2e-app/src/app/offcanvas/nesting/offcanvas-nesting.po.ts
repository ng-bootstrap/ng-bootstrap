import { getPage } from '../../../../baseTest';
import { focusElement, sendKey } from '../../tools.po';
import { waitForOffcanvas } from '../offcanvas.po';

export const SELECTOR_DATEPICKER = 'ngb-datepicker';
export const SELECTOR_DATEPICKER_BUTTON = '#datepicker-button';
export const SELECTOR_DROPDOWN_BUTTON = '#dropdown';
export const SELECTOR_DROPDOWN = '[ngbDropdown].show';
export const SELECTOR_TYPEAHEAD_INPUT = '#typeahead';
export const SELECTOR_TYPEAHEAD_DROPDOWN = 'ngb-typeahead-window.show';

export const openOffcanvas = async () => {
	await getPage().click(`#open-offcanvas`);
	await waitForOffcanvas('present');
};

export const pressButton = async (buttonSelector) => {
	await focusElement(buttonSelector);
	await sendKey('Enter');
};
