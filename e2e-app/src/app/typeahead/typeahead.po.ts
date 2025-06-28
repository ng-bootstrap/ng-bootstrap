import { getPage } from '../../../baseTest';

export const SELECTOR_TYPEAHEAD = 'input#typeahead';
export const SELECTOR_TYPEAHEAD_WINDOW = 'ngb-typeahead-window';
export const SELECTOR_TYPEAHEAD_ITEMS = 'ngb-typeahead-window > button';
export const SELECTOR_TYPEAHEAD_ACTIVE_ITEM = 'ngb-typeahead-window > button.active';

export const getTypeaheadValue = async () =>
	await getPage().$eval(SELECTOR_TYPEAHEAD, (el: HTMLInputElement) => el.value);
