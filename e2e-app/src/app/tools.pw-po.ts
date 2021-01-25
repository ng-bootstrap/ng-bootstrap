import {baseUrl, page} from '../../playwright.conf';
import {ElementHandle} from 'playwright';

type BoundingBox = {
  /**
   * the x coordinate of the element in pixels.
   */
  x: number;

  /**
   * the y coordinate of the element in pixels.
   */
  y: number;

  /**
   * the width of the element in pixels.
   */
  width: number;

  /**
   * the height of the element in pixels.
   */
  height: number;
};

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
};

/**
 * Sends keys to a currently focused element
 *
 * @param keys list of keys to send
 * https://playwright.dev/#path=docs%2Fapi.md&q=keyboardpresskey-options
 * See
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
 * Expects provided element to be focused
 *
 * @param el element to check
 * @param message to display in case of error
 */
export const expectFocused = async(selector, message) => {
  const foo1Isfocused = await page().$eval(selector, (el) => el === document.activeElement);
  expect(foo1Isfocused).toBeTruthy(message);
};

/**
 * Reopens internal URL by navigating to home url and then to desired one
 */
let hasBeenLoaded = false;
export const openUrl = async(url: string) => {
  const currentPage = page();
  if (hasBeenLoaded) {
    await currentPage.click(`#navigate-home`);
    await currentPage.waitForSelector('ng-component', {state: 'detached'});
    await currentPage.click(`#navigate-${url.replace('/', '-')}`);
    await currentPage.waitForSelector('ng-component');
  } else {
    console.log('Go to page', `${baseUrl}/${url}`);
    await currentPage.goto(`${baseUrl}/${url}`);
    await currentPage.waitForSelector('app-root');
    hasBeenLoaded = true;
  }
};

/**
 * Reopens internal URL by navigating to home url and then to desired one
 */
export const getBoundindClientRect = async(selector: string): Promise<BoundingBox> => {
  const element = await page().$(selector);
  const boundingBox = element ? await element.boundingBox() : {x: 0, y: 0, width: 0, height: 0};
  return boundingBox !;
};
