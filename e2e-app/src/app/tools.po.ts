import {$, browser, Button, ElementFinder, Key, protractor, WebElement} from 'protractor';

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
 * Clicks on the given element with the right button of the mouse.
 * @param el element to right click on
 */
export const rightClick = async(el: ElementFinder) => {
  await browser.actions().click(el, Button.RIGHT).perform();
};

/**
 * Clicks on the given element with a given offset.
 * @param el element to right click on
 * @param offset {x, y} position, relative to the element
 */
export const offsetClick = async(el: ElementFinder, offset) => {
  await browser.actions().mouseMove(el, offset).click().perform();
};

/**
 * Expects provided element to be focused
 *
 * @param el element to check
 * @param message to display in case of error
 */
export const expectFocused = async(el: ElementFinder, message: string) => {
  await browser.wait(
      () => { return WebElement.equals(el.getWebElement(), browser.driver.switchTo().activeElement()); }, 100, message);
};

/**
 * Checks that there are no open modal windows in the document
 */
export const expectNoOpenModals = async(error = `There should be no open modal windows left after a modal test`) => {
  browser.wait(protractor.ExpectedConditions.invisibilityOf($('ngb-modal-window')), 1000, error);
};

/**
 * Reopens internal URL by navigating to home url and then to desired one
 */
export const openUrl = async(url: string) => {
  await $(`#navigate-home`).click();
  await $(`#navigate-${url.replace('/', '-')}`).click();
};

/**
 * Returns the caret position ({start, end}) of the given element (must be an input).
 */
export async function getCaretPosition(element: ElementFinder) {
  const[start, end] = await browser.executeScript<[number, number]>(
      `
    var element = arguments[0];
    return [element.selectionStart, element.selectionEnd];
  `,
      element.getWebElement());

  return {start, end};
}
