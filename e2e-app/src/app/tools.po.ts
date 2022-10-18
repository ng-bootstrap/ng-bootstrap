import { getPage } from '../../baseTest';
import { expect } from '@playwright/test';

/**
 * Sends keys to a currently focused element
 *
 * @param keys list of keys to send
 * https://playwright.dev/docs/api/class-keyboard?_highlight=keyboard#keyboardpresskey-options
 */
export const sendKey = async (key: string) => {
	await getPage().keyboard.press(key);
};

/**
 * Focus the provided element, and wait for this element to be focused, to avoid asynchronous side effet.
 *
 * @param selector element selector to focus
 */
export const focusElement = async (selector: string) => {
	await getPage().focus(selector);
	await expect(getPage().locator(selector)).toBeFocused();
};

const roundBoundingBox = (rect: { x: number; y: number; width: number; height: number }) => {
	rect.x = Math.round(rect.x);
	rect.y = Math.round(rect.y);
	rect.width = Math.round(rect.width);
	rect.height = Math.round(rect.height);

	return rect;
};

/**
 * Returns the element bounding box
 */
export const getBoundingBox = async (selector: string) => {
	return roundBoundingBox(await getPage().locator(selector).boundingBox());
};

/**
 * Returns the caret position ({start, end}) of the given element (must be an input).
 */
export const getCaretPosition = async (selector: string) =>
	await getPage().$eval(selector, (el: HTMLInputElement) => ({ start: el.selectionStart, end: el.selectionEnd }));
