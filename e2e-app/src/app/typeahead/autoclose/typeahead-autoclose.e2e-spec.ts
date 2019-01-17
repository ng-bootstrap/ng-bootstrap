import {openUrl, expectFocused, sendKey} from '../../tools.po';
import {TypeaheadAutoClosePage} from './typeahead-autoclose.po';
import {Key} from 'protractor';

describe('Typeahead Autoclose', () => {
  let page: TypeaheadAutoClosePage;

  beforeAll(() => page = new TypeaheadAutoClosePage());

  beforeEach(async() => await openUrl('typeahead/autoclose'));

  it(`should close typeahead on outside click and lose focus`, async() => {
    await page.setTypeaheadValue('o');
    expect(page.getDropdownItems().count()).toBe(2);

    await page.getOutsideButton().click();
    expect(await page.getDropdown().isPresent()).toBeFalsy(`Dropdown should become hidden`);
    expectFocused(page.getOutsideButton(), `Clicked button should be focused`);
  });

  it(`should close typeahead on outside click and lose focus (with hint)`, async() => {
    await page.showHint(true);
    await page.setTypeaheadValue('o');
    expect(page.getDropdownItems().count()).toBe(2);
    expect(page.getTypeaheadValue()).toBe('one', `Hint should be shown`);

    await page.getOutsideButton().click();
    expect(await page.getDropdown().isPresent()).toBeFalsy(`Dropdown should become hidden`);
    expectFocused(page.getOutsideButton(), `Clicked button should be focused`);
    expect(page.getTypeaheadValue()).toBe('o', `Hint should have been removed`);
  });

  it(`should not close typeahead on input click and stay focused`, async() => {
    await page.setTypeaheadValue('o');
    expect(page.getDropdownItems().count()).toBe(2);

    await page.getTypeaheadInput().click();
    expect(await page.getDropdown().isPresent()).toBeTruthy(`Dropdown should stay visible`);
    expectFocused(page.getTypeaheadInput(), `Typeahead input should stay focused`);
  });

  it(`should close typeahead on item click and stay focused`, async() => {
    await page.setTypeaheadValue('o');
    expect(page.getDropdownItems().count()).toBe(2);

    await page.getDropdownItems().get(0).click();
    expect(await page.getDropdown().isPresent()).toBeFalsy(`Dropdown should become hidden`);
    expectFocused(page.getTypeaheadInput(), `Typeahead input should stay focused`);
  });

  it(`should close typeahead on Escape and stay focused`, async() => {
    await page.setTypeaheadValue('o');
    expect(page.getDropdownItems().count()).toBe(2);

    sendKey(Key.ESCAPE);
    expect(await page.getDropdown().isPresent()).toBeFalsy(`Dropdown should become hidden`);
    expectFocused(page.getTypeaheadInput(), `Typeahead input should stay focused`);
  });

  it(`should close typeahead on Escape and stay focused (with hint)`, async() => {
    await page.showHint(true);
    await page.setTypeaheadValue('o');
    expect(page.getDropdownItems().count()).toBe(2);
    expect(page.getTypeaheadValue()).toBe('one', `Hint should be shown`);

    sendKey(Key.ESCAPE);
    expect(await page.getDropdown().isPresent()).toBeFalsy(`Dropdown should become hidden`);
    expectFocused(page.getTypeaheadInput(), `Typeahead input should stay focused`);
    expect(page.getTypeaheadValue()).toBe('o', `Hint should have been removed`);
  });
});
