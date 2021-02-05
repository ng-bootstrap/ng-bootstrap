import {expectFocused, Key, openUrl, sendKey} from '../../tools.pw-po';
import {test} from '../../../../playwright.conf';
import {getTypeaheadValue, SELECTOR_TYPEAHEAD, SELECTOR_TYPEAHEAD_ITEMS, SELECTOR_TYPEAHEAD_WINDOW} from '../typeahead';

describe('Typeahead', () => {

  const expectTypeaheadFocused = async() => await expectFocused(SELECTOR_TYPEAHEAD, `Typeahead should be focused`);

  const expectDropdownOpen = async(suggestions = 10) => {
    await test.page.waitForSelector(SELECTOR_TYPEAHEAD_WINDOW);
    const items = await test.page.$$(SELECTOR_TYPEAHEAD_ITEMS);
    expect(items.length).toBe(suggestions, `Wrong numbre of suggestions`);
  };

  const expectDropDownClosed = async() =>
      await test.page.waitForSelector(SELECTOR_TYPEAHEAD_WINDOW, {state: 'detached'});

  const expectTypeaheadValue =
      async expectedValue => { expect(await getTypeaheadValue()).toBe(expectedValue, 'Wrong input value'); };

  const clickBefore = async() => await test.page.click('#first');

  beforeEach(async() => await openUrl('typeahead/focus'));

  it(`should be open after a second click`, async() => {
    await test.page.click(SELECTOR_TYPEAHEAD);
    await expectTypeaheadFocused();
    await test.page.click(SELECTOR_TYPEAHEAD);
    await expectDropdownOpen();
    await expectTypeaheadFocused();
  });

  it(`should preserve value previously selected with mouse when reopening with focus then closing without selection`,
     async() => {
       await test.page.click(SELECTOR_TYPEAHEAD);
       await test.page.type(SELECTOR_TYPEAHEAD, 'col');

       await expectDropdownOpen(2);
       await expectTypeaheadFocused();

       await test.page.click(`${SELECTOR_TYPEAHEAD_ITEMS}:first-child`);
       await expectTypeaheadValue('Colorado');
       await expectTypeaheadFocused();

       await clickBefore();
       await sendKey(Key.Tab);

       await expectTypeaheadFocused();
       await expectDropdownOpen(1);
       await expectTypeaheadValue('Colorado');

       await sendKey(Key.ESC);
       await expectTypeaheadFocused();
       await expectDropDownClosed();
       await expectTypeaheadValue('Colorado');
     });

  describe('Keyboard', () => {
    it(`should be focused on item selection`, async() => {
      await clickBefore();
      await sendKey(Key.Tab);
      await expectTypeaheadFocused();
      await expectDropdownOpen();

      await sendKey(Key.Enter);
      await expectTypeaheadValue('Alabama');
      await expectTypeaheadFocused();
    });

    if (process.env.BROWSER !== 'webkit') {
      it(`should select element on tab`, async() => {
        await test.page.focus(SELECTOR_TYPEAHEAD);
        await sendKey(Key.Tab);
        await expectTypeaheadFocused();
        await expectDropDownClosed();
        await expectTypeaheadValue('Alabama');
      });
    }
  });
});
