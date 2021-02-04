import {baseUrl, page} from '../../playwright.conf';
import {ElementHandle} from 'playwright';

export const joinSelectors = (...selectors: Array<string>): string => {
  return selectors.join(' >> ');
};

export const Key = {
  ESC: 'Escape',
  Tab: 'Tab',
  Space: ' ',
  Enter: 'Enter',
  ArrowRight: 'ArrowRight',
  ArrowDown: 'ArrowDown',
  ArrowLeft: 'ArrowLeft',
  ArrowUp: 'ArrowUp',
  Home: 'Home',
  End: 'End',
  PageUp: 'PageUp',
  PageDown: 'PageDown'
};

/**
 * Sends keys to a currently focused element
 *
 * @param keys list of keys to send
 * https://playwright.dev/docs/api/class-keyboard?_highlight=keyboard#keyboardpresskey-options
 */
export const sendKey = async(key: string, selector?: string) => {
  const keyboard = page().keyboard;
  if (selector) {
    await page().press(selector, key);
  } else {
    await keyboard.press(key);
  }
};

/**
 * Clicks on the given element with the right button of the mouse.
 * @param el element to right click on
 */
export const rightClick = async(selectorOrElement: string | ElementHandle) => {
  const rightClickOption: {button} = {button: 'right'};
  if (typeof(selectorOrElement) === 'string') {
    await page().click(selectorOrElement, rightClickOption);
  } else {
    await selectorOrElement.click(rightClickOption);
  }
};

/**
 * Clicks on the given element with a given offset.
 * @param el element to right click on
 * @param offset {x, y} position, relative to the element
 */
export const offsetClick = async(selector, position) => {
  await page().click(selector, {position});
};


/**
 * Wait for the provided element to be focused
 *
 * @param selector element selector to check
 * @param message to display in case of error
 */
export const waitForFocus = async(selector, message = `Unable to focus '${selector}'`) => {
  const el = await page().$(selector);
  await timeoutMessage(page().waitForFunction(function(_el) { return _el === document.activeElement; }, el), message);
};

/**
 * Focus the provided element, and wait for this element to be focused, to avoid asynchronous side effet.
 *
 * @param selector element selector to focus
 */
export const focusElement = async(selector) => {
  await page().focus(selector);
  await waitForFocus(selector);
};


/**
 * Reopens internal URL by navigating to home url and then to desired one
 */
let hasBeenLoaded = false;
export const openUrl = async(url: string, selector: string) => {
  const currentPage = page();
  const targetUrl = `#navigate-${url.replace('/', '-')}`;
  const browser = process.env.BROWSER;
  if (hasBeenLoaded && browser === 'chromium') {
    await currentPage.click(`#navigate-home`);
    await currentPage.waitForSelector(targetUrl);
    await currentPage.click(targetUrl);
    await currentPage.waitForSelector(selector);
  } else {
    if (browser === 'webkit') {
      // To perform a full reload on webkit and increase the test suite stability
      await currentPage.goto('about:blank');
      await currentPage.waitForSelector('ng-component', {state: 'detached'});
    } else {
      await currentPage.goto(`${baseUrl}/`);
      await currentPage.waitForSelector(targetUrl);
      await currentPage.waitForSelector('ng-component', {state: 'detached'});
    }
    await currentPage.goto(`${baseUrl}/${url}`);
    await currentPage.waitForSelector(selector);
  }
  hasBeenLoaded = true;
};

const roundBoundingBox = (rect: {x: number, y: number, width: number, height: number}) => {
  rect.x = Math.round(rect.x);
  rect.y = Math.round(rect.y);
  rect.width = Math.round(rect.width);
  rect.height = Math.round(rect.height);

  return rect;
};

/**
 * Returns the element bounding box
 */
export const getBoundingBox = async(selector: string) => {
  const element = await page().$(selector);
  const boundingBox = element ? await element.boundingBox() : {x: 0, y: 0, width: 0, height: 0};
  return roundBoundingBox(boundingBox !);
};

/**
 * Returns the caret position ({start, end}) of the given element (must be an input).
 */
export const getCaretPosition = async(selector: string) =>
    await page().$eval(selector, (el: HTMLInputElement) => ({start: el.selectionStart, end: el.selectionEnd}));

/**
* Add a custom message on a playwright timeout failure
* This is a workaround, waiting for the followinf PR to be merged:
* {@link https://github.com/microsoft/playwright/pull/4778}
* @template T
* @param {Promise<T>} promise
* @param {string} message
* @return {Promise<T>}
*/
export const timeoutMessage = (promise, message) => {
  return promise.catch(e => {
    if (e instanceof require('playwright').errors.TimeoutError) {
      e.message += '\n' + message;
    }
    throw e;
  });
};

/**
 * @example
 * js `some code with ${json} variables to be stringified`
 * @param code
 * @param variables
 */
export const js = (code: TemplateStringsArray, ...variables: any[]) => {
  let result = '';
  const l = code.length - 1;
  for (let i = 0; i < l; i++) {
    result += code[i] + JSON.stringify(variables[i]);
  }
  result += code[l];
  return result;
};

/**
 * Move the mouse hover the provided element
 * @param selector Element selector
 */
export const mouseMove = async(selector) => {
  const rect = await getBoundingBox(selector);
  const x = rect.x + rect.width / 2;
  const y = rect.y + rect.height / 2;
  await page().mouse.move(x, y);
};
