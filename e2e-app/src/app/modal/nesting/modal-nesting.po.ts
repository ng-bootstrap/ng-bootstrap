import { getPage } from '../../../../baseTest';
import { focusElement, sendKey } from '../../tools.po';
import { waitForModalCount } from '../modal.po';

export const SELECTOR_DATEPICKER = 'ngb-datepicker';
export const SELECTOR_CLOSE_BUTTON = '.btn-close';
export const SELECTOR_DATEPICKER_BUTTON = '#datepicker-button';
export const SELECTOR_DROPDOWN_BUTTON = '#dropdown';
export const SELECTOR_DROPDOWN = '[ngbDropdown].show';
export const SELECTOR_DROPDOWN_ITEM = 'button[ngbDropdownItem]';
export const SELECTOR_TYPEAHEAD_INPUT = 'input#typeahead';
export const SELECTOR_TYPEAHEAD_DROPDOWN = 'ngb-typeahead-window.show';
export const SELECTOR_TYPEAHEAD_DROPDOWN_ITEM = 'ngb-typeahead-window > button';
export const SELECTOR_TOOLTIP_BUTTON = 'button#tooltip';
export const SELECTOR_TOOLTIP = 'ngb-tooltip-window';
export const SELECTOR_POPOVER_BUTTON = 'button#popover';
export const SELECTOR_POPOVER = 'ngb-popover-window';

export const openModal = async () => {
	await getPage().click(`#open-modal`);
	await waitForModalCount(1);
};

export const setContainer = async (type: string) => {
	await getPage().click(`#container-${type}`);
};

export const pressButton = async (buttonSelector) => {
	await focusElement(buttonSelector);
	await sendKey('Enter');
};
