import {Key, ElementFinder} from 'protractor';

import {openUrl, expectFocused, sendKey, getCaretPosition} from '../../tools.po';

import {Page} from './timepicker-navigation.po';

describe('Timepicker', () => {
  let page: Page;

  beforeAll(() => page = new Page());
  beforeEach(async() => await openUrl('timepicker/navigation'));

  function focusInputBefore() { return page.getInputBefore().click(); }

  function goNext() { return sendKey(Key.TAB); }
  function goPrevious() { return sendKey(Key.SHIFT, Key.TAB); }

  function pressUp() { return sendKey(Key.ARROW_UP); }
  function pressDown() { return sendKey(Key.ARROW_DOWN); }
  function goToBeginningOfField() { return sendKey(Key.HOME); }
  function goToEndOfField() { return sendKey(Key.END); }

  async function expectCaretPosition(field: ElementFinder, position: number) {
    const {start, end} = await getCaretPosition(field);
    expect(end).toBe(end, 'Caret should be at single position (no range selected)');
    expect(start).toBe(position, `Caret is not at proper position for given field`);
  }

  describe('navigation', () => {
    it(`should jump between inputs`, async() => {
      await focusInputBefore();

      const[hourField, minuteField, secondField] = page.getFields();

      await goNext();
      await expectFocused(hourField, 'Hour field should be focused');
      await goNext();
      await expectFocused(minuteField, 'Minute field should be focused');
      await goNext();
      await expectFocused(secondField, 'Second field should be focused');
      await goNext();
      expectFocused(page.getInputAfter(), '...');

      await goPrevious();
      await expectFocused(secondField, 'Second field should be focused');
      await goPrevious();
      await expectFocused(minuteField, 'Minute field should be focused');
      await goPrevious();
      await expectFocused(hourField, 'Hour field should be focused');
      await goPrevious();
      expectFocused(page.getInputBefore(), '...');
    });
  });

  describe('arrow keys', () => {
    it(`should keep caret at the end of the input`, async() => {
      const testField = async(fieldElement: ElementFinder) => {
        await fieldElement.click();

        const endPosition = 2;
        const expectCaretAtEnd = () => expectCaretPosition(fieldElement, endPosition);

        await goToEndOfField();
        await expectCaretAtEnd();

        await pressUp();
        await expectCaretAtEnd();

        await pressDown();
        await expectCaretAtEnd();

        await goToBeginningOfField();
        await expectCaretPosition(fieldElement, 0);

        await pressUp();
        await expectCaretAtEnd();

        await pressDown();
        await expectCaretAtEnd();
      };

      for (const fieldElement of page.getFields()) {
        await testField(fieldElement);
      }
    });
  });
});
