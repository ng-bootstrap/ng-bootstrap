import {Key, ElementFinder} from 'protractor';

import {openUrl, expectFocused, sendKey, getCaretPosition} from '../../tools.po';

import {TimepickerNavigationPage} from './timepicker-navigation.po';

describe('Timepicker', () => {
  let page: TimepickerNavigationPage;

  beforeAll(() => page = new TimepickerNavigationPage());
  beforeEach(async() => await openUrl('timepicker/navigation'));

  async function expectCaretPosition(field: ElementFinder, position: number) {
    const {start, end} = await getCaretPosition(field);
    expect(end).toBe(end, 'Caret should be at single position (no range selected)');
    expect(start).toBe(position, `Caret is not at proper position for given field`);
  }

  describe('navigation', () => {
    it(`should jump between inputs`, async() => {
      await page.focusInputBefore();

      const[hourField, minuteField, secondField] = page.getFields();

      await sendKey(Key.TAB);
      await expectFocused(hourField, 'Hour field should be focused');
      await sendKey(Key.TAB);
      await expectFocused(minuteField, 'Minute field should be focused');
      await sendKey(Key.TAB);
      await expectFocused(secondField, 'Second field should be focused');
      await sendKey(Key.TAB);
      await expectFocused(page.getInputAfter(), 'Input after should be focused');

      await sendKey(Key.SHIFT, Key.TAB);
      await expectFocused(secondField, 'Second field should be focused');
      await sendKey(Key.SHIFT, Key.TAB);
      await expectFocused(minuteField, 'Minute field should be focused');
      await sendKey(Key.SHIFT, Key.TAB);
      await expectFocused(hourField, 'Hour field should be focused');
      await sendKey(Key.SHIFT, Key.TAB);
      await expectFocused(page.getInputBefore(), 'Input before should be focused');
    });
  });

  describe('arrow keys', () => {
    it(`should keep caret at the end of the input`, async() => {
      const testField = async(fieldElement: ElementFinder) => {
        await fieldElement.click();

        const endPosition = 2;
        const expectCaretAtEnd = () => expectCaretPosition(fieldElement, endPosition);

        await sendKey(Key.END);
        await expectCaretAtEnd();

        await sendKey(Key.ARROW_UP);
        await expectCaretAtEnd();

        await sendKey(Key.ARROW_DOWN);
        await expectCaretAtEnd();

        await sendKey(Key.HOME);
        await expectCaretPosition(fieldElement, 0);

        await sendKey(Key.ARROW_UP);
        await expectCaretAtEnd();

        await sendKey(Key.ARROW_DOWN);
        await expectCaretAtEnd();
      };

      for (const fieldElement of page.getFields()) {
        await testField(fieldElement);
      }
    });
  });
});
