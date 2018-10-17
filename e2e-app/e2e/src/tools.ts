import {browser, ElementFinder, Key, WebElement, $, $$} from 'protractor';

/**
 * Sends keys to a currently focused element
 *
 * @param keys list of keys to send as a chord
 */
export const sendKey = async(...keys: string[]) => {
  const focused = await browser.driver.switchTo().activeElement();
  await focused.sendKeys(Key.chord(...keys));
};

/**
 * Expects provided element to be focused
 *
 * @param el element to check
 * @param message to display in case of error
 */
export const expectFocused = async(el: ElementFinder, message: string) => {
  const focused = await browser.driver.switchTo().activeElement();
  expect(await WebElement.equals(el.getWebElement(), focused)).toBeTruthy(message);
};

/**
 * Checks that there are no open modal windows in the document
 */
export const expectNoOpenModals = async() => {
  expect(await $$('ngb-modal-window').count()).toBe(0, `There should be no open modal windows left after a modal test`);
};

/**
 * Reopens internal URL by navigating to home url and then to desired one
 */
export const openUrl = async(url: string) => {
  await $(`#navigate-home`).click();
  await $(`#navigation-dropdown`).click();
  await $(`#navigate-${url.replace('/', '-')}`).click();
};
