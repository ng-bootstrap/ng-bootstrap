import {browser, ElementFinder, Key, protractor} from 'protractor';
import {openUrl, sendKey} from '../../tools.po';
import {DropdownClickPage} from './dropdown-click.po';

describe(`Dropdown user (click) handler`, () => {

  let page: DropdownClickPage;
  let dropdown: ElementFinder;

  beforeAll(() => page = new DropdownClickPage());

  beforeEach(async() => {
    await openUrl('dropdown/click');
    dropdown = page.getDropdown();
  });

  it(`should call user (click) handler on 'Enter'`, async() => {
    await page.toggleItem(0);

    await sendKey(Key.ENTER);
    expect(await page.isOpened(dropdown)).toBeFalsy(`Dropdown should be hidden on Enter`);
    browser.wait(
        protractor.ExpectedConditions.presenceOf(page.getEnterClickLabel()), 0,
        `User click handler should have been called`);
    browser.wait(
        protractor.ExpectedConditions.presenceOf(page.getEnterKeyLabel()), 0,
        `User keydown.enter handler should have been called`);
  });

  it(`should call user (click) handler on 'Space'`, async() => {
    await page.toggleItem(1);

    await sendKey(Key.SPACE);
    expect(await page.isOpened(dropdown)).toBeFalsy(`Dropdown should be hidden on Space`);
    browser.wait(
        protractor.ExpectedConditions.presenceOf(page.getSpaceClickLabel()), 0,
        `User click handler should have been called`);
    browser.wait(
        protractor.ExpectedConditions.presenceOf(page.getSpaceKeyLabel()), 0,
        `User keyup.space handler should have been called`);
  });

});
