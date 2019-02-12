import {openUrl, expectFocused, sendKey, rightClick} from '../../tools.po';
import {TypeaheadAutoClosePage} from './typeahead-autoclose.po';
import {Key} from 'protractor';

describe('Typeahead Autoclose', () => {
  let page: TypeaheadAutoClosePage;

  const expectTypeaheadToBeOpen = async(message: string) => {
    expect(await page.getDropdown().isPresent()).toBeTruthy(message);
    expect(await page.getOpenStatus().getText()).toBe('open', message);
  };

  const expectTypeaheadToBeClosed = async(message: string) => {
    expect(await page.getDropdown().isPresent()).toBeFalsy(message);
    expect(await page.getOpenStatus().getText()).toBe('closed', message);
  };

  const openTypeahead = async() => {
    await page.setTypeaheadValue('o');
    await expectTypeaheadToBeOpen(`Opening typeahead`);
    expect(await page.getDropdownItems().count()).toBe(2);
  };

  beforeAll(() => page = new TypeaheadAutoClosePage());

  beforeEach(async() => await openUrl('typeahead/autoclose'));

  it(`should not close typeahead on right clicks`, async() => {
    await openTypeahead();

    await rightClick(page.getTypeaheadInput());
    await expectTypeaheadToBeOpen(`Dropdown should stay visible when right-clicking on the input`);

    await rightClick(page.getDropdownItems().get(0));
    await expectTypeaheadToBeOpen(`Dropdown should stay visible when right-clicking inside`);

    await page.rightClickOutside();
    await expectTypeaheadToBeOpen(`Dropdown should stay visible when right-clicking outside`);
  });

  it(`should close typeahead on outside click and lose focus`, async() => {
    await openTypeahead();

    await page.getOutsideButton().click();
    await expectTypeaheadToBeClosed(`Dropdown should become hidden`);
    await expectFocused(page.getOutsideButton(), `Clicked button should be focused`);
  });

  it(`should close typeahead on outside click and lose focus (with hint)`, async() => {
    await page.showHint(true);
    await openTypeahead();
    expect(await page.getTypeaheadValue()).toBe('one', `Hint should be shown`);

    await page.getOutsideButton().click();
    await expectTypeaheadToBeClosed(`Dropdown should become hidden`);
    await expectFocused(page.getOutsideButton(), `Clicked button should be focused`);
    expect(await page.getTypeaheadValue()).toBe('o', `Hint should have been removed`);
  });

  it(`should not close typeahead on input click and stay focused`, async() => {
    await openTypeahead();

    await page.getTypeaheadInput().click();
    await expectTypeaheadToBeOpen(`Dropdown should stay visible`);
    await expectFocused(page.getTypeaheadInput(), `Typeahead input should stay focused`);
  });

  it(`should close typeahead on item click and stay focused`, async() => {
    await openTypeahead();

    await page.getDropdownItems().get(0).click();
    await expectTypeaheadToBeClosed(`Dropdown should become hidden`);
    await expectFocused(page.getTypeaheadInput(), `Typeahead input should stay focused`);
  });

  it(`should close typeahead on Escape and stay focused`, async() => {
    await openTypeahead();

    await sendKey(Key.ESCAPE);
    await expectTypeaheadToBeClosed(`Dropdown should become hidden`);
    await expectFocused(page.getTypeaheadInput(), `Typeahead input should stay focused`);
  });

  it(`should close typeahead on Escape and stay focused (with hint)`, async() => {
    await page.showHint(true);
    await openTypeahead();
    expect(await page.getTypeaheadValue()).toBe('one', `Hint should be shown`);

    await sendKey(Key.ESCAPE);
    await expectTypeaheadToBeClosed(`Dropdown should become hidden`);
    await expectFocused(page.getTypeaheadInput(), `Typeahead input should stay focused`);
    expect(await page.getTypeaheadValue()).toBe('o', `Hint should have been removed`);
  });
});
