import {TypeaheadPage} from './typeahead.po';
import {Key} from 'protractor';
import {expectFocused, openUrl, sendKey} from '../tools';

describe('Typeahead', () => {
  let page: TypeaheadPage;

  const expectTypeaheadFocused =
      async() => { await expectFocused(await page.getTypeaheadInput(), `Typeahead should be focused`); };

  const expectDropdownOpen = async(expectedDropdownItems = 10) => {
    expect(page.getDropdown().isPresent()).toBeTruthy(`The dropdown should be open`);

    expect(page.getDropdownItems().count()).toBe(expectedDropdownItems, `Wrong number of dropdown items`);
  };

  const expectDropDownClosed =
      async() => { expect(await page.getDropdown().isPresent()).toBeFalsy(`The dropdown shouldn't be open`); };

  const expectTypeaheadValue =
      async expectedValue => { expect(await page.getTypeaheadValue()).toBe(expectedValue, 'Wrong input value'); };

  beforeAll(() => page = new TypeaheadPage());

  beforeEach(async() => await openUrl('typeahead/focus'));

  it(`should be focused on item click`, async() => {
    await page.getTypeaheadInput().click();
    expectDropdownOpen();

    await page.getDropdownItems().get(0).click();
    expectTypeaheadValue('Alabama');
    expectTypeaheadFocused();
  });

  it(`should be open after a second click`, async() => {
    await page.getTypeaheadInput().click();
    expectTypeaheadFocused();
    await page.getTypeaheadInput().click();
    expectDropdownOpen();
    expectTypeaheadFocused();
  });

  it(`should be close on click outside`, async() => {
    await page.getTypeaheadInput().click();
    await page.getInputBefore().click();
    expectDropDownClosed();
  });

  it(`should preserve value previously selected with mouse when reopening with focus then closing without selection`,
     async() => {
       const input = page.getTypeaheadInput();
       await input.click();
       await input.sendKeys('col');

       expectDropdownOpen(2);
       expectTypeaheadFocused();

       await page.getDropdownItems().get(0).click();
       expectTypeaheadValue('Colorado');
       // expectTypeaheadFocused();

       await page.getInputBefore().click();
       await sendKey(Key.TAB);

       expectTypeaheadFocused();
       expectDropdownOpen(1);
       expectTypeaheadValue('Colorado');

       await sendKey(Key.ESCAPE);
       expectTypeaheadFocused();
       expectDropDownClosed();
       expectTypeaheadValue('Colorado');
     });

  describe('Keyboard', () => {
    it(`should be focused on item selection`, async() => {
      await page.getInputBefore().click();
      await sendKey(Key.TAB);
      expectTypeaheadFocused();
      expectDropdownOpen();

      await sendKey(Key.ENTER);
      expectTypeaheadValue('Alabama');
      expectTypeaheadFocused();
    });

    it(`should select element on tab`, async() => {
      await page.getInputBefore().click();
      await sendKey(Key.TAB);
      await sendKey(Key.TAB);
      expectTypeaheadFocused();
      expectDropDownClosed();
      expectTypeaheadValue('Alabama');
    });
  });
});
