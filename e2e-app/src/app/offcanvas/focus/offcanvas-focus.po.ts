import { focusElement, sendKey } from '../../tools.po';
import { waitForOffcanvas } from '../offcanvas.po';

export const SELECTOR_OFFCANVAS_CONTENT = 'div.offcanvas-content';
export const SELECTOR_DISMISS_BUTTON = 'div.offcanvas-header >> button';
export const SELECTOR_CLOSE_BUTTON = 'div.offcanvas-body >> button';
export const SELECTOR_OFFCANVAS_INPUT = 'div.offcanvas-body >> input';
export const SELECTOR_OFFCANVAS_HEADER = 'div.offcanvas-header';

export const openOffcanvas = async (type: string) => {
	await focusElement(`#open-offcanvas-${type}`);
	await sendKey('Enter');
	await waitForOffcanvas('present');
};
