import {focusElement, waitForFocus, sendKey, timeoutMessage, js} from '../../tools.po';
import {test, getPage, setPage} from '../../../../baseTest';
import {SELECTOR_TYPEAHEAD, SELECTOR_TYPEAHEAD_ITEMS, SELECTOR_TYPEAHEAD_WINDOW} from '../typeahead.po';

test.use({testURL: 'typeahead/focus', testSelector: 'h3:text("Typeahead focus")'});
test.beforeEach(async({page}) => setPage(page));

test.describe('Typeahead', () => {

  const waitForTypeaheadFocused = async() => await waitForFocus(SELECTOR_TYPEAHEAD, `Typeahead should be focused`);

  const waitForDropdownOpen = async(suggestions = 10) => {
    await timeoutMessage(
        getPage().waitForFunction(
            js `document.querySelectorAll(${SELECTOR_TYPEAHEAD_ITEMS}).length === ${suggestions}`),
        `Wrong number of suggestions (expected ${suggestions})`);
  };

  const waitForDropDownClosed = async() =>
      await getPage().waitForSelector(SELECTOR_TYPEAHEAD_WINDOW, {state: 'detached'});

  const waitForTypeaheadValue = async expectedValue => {
    await timeoutMessage(
        getPage().waitForFunction(js `document.querySelector(${SELECTOR_TYPEAHEAD}).value === ${expectedValue}`),
        `Wrong input value (expected ${expectedValue})`);
  };

  const clickBefore = async() => await getPage().click('#first');

  test(`should be open after a second click`, async() => {
    await getPage().click(SELECTOR_TYPEAHEAD);
    await waitForTypeaheadFocused();
    await getPage().click(SELECTOR_TYPEAHEAD);
    await waitForDropdownOpen();
    await waitForTypeaheadFocused();
  });

  test(
      `should preserve value previously selected with mouse when reopening with focus then closing without selection`,
      async() => {
        await getPage().click(SELECTOR_TYPEAHEAD);
        await getPage().type(SELECTOR_TYPEAHEAD, 'col');

        await waitForDropdownOpen(2);
        await waitForTypeaheadFocused();

        await getPage().click(`${SELECTOR_TYPEAHEAD_ITEMS}:first-child`);
        await waitForTypeaheadValue('Colorado');
        await waitForTypeaheadFocused();

        await clickBefore();
        await sendKey('Tab');

        await waitForTypeaheadFocused();
        await waitForDropdownOpen(1);
        await waitForTypeaheadValue('Colorado');

        await sendKey('Escape');
        await waitForTypeaheadFocused();
        await waitForDropDownClosed();
        await waitForTypeaheadValue('Colorado');
      });

  test.describe('Keyboard', () => {

    test.beforeEach(async() => {
      // Be sure that the mouse does not interfere with the highlighted items in dropdown
      await clickBefore();
    });

    test(`should be focused on item selection`, async() => {
      await sendKey('Tab');
      await waitForTypeaheadFocused();
      await waitForDropdownOpen();

      await sendKey('Enter');
      await waitForTypeaheadValue('Alabama');
      await waitForTypeaheadFocused();
    });


    test(`should select element on tab`, async({browserName}) => {
      test.skip(browserName === 'webkit');
      await focusElement(SELECTOR_TYPEAHEAD);
      await sendKey('Tab');
      await waitForTypeaheadFocused();
      await waitForDropDownClosed();
      await waitForTypeaheadValue('Alabama');
    });

  });
});
