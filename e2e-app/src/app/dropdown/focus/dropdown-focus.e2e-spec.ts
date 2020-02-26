import {$, ElementFinder, Key} from 'protractor';
import {expectFocused, sendKey, openUrl} from '../../tools.po';
import {DropdownFocusPage} from './dropdown-focus.po';

describe(`Dropdown focus`, () => {

  let page: DropdownFocusPage;
  let dropdown: ElementFinder;
  let toggle: ElementFinder;

  beforeAll(() => page = new DropdownFocusPage());

  beforeEach(async() => {
    await openUrl('dropdown/focus');
    dropdown = page.getDropdown();
    toggle = page.getDropdownToggle();
  });

  const containers = ['inline', 'body'];
  containers.forEach((container) => {

    describe(`with container = ${container}`, () => {

      beforeEach(async() => {
        await page.selectContainer(container);
        await page.selectWithItems(true);
      });

      it(`should not be present on the page initially`,
         async() => { expect(await page.isOpened(dropdown)).toBeFalsy(`Dropdown should be closed initially`); });

      it(`should open dropdown with 'Space' and focus toggling element`, async() => {
        await page.focusToggle();
        await sendKey(Key.SPACE);
        await expectFocused(toggle, `Toggling element should be focused`);
        expect(await page.isOpened(dropdown)).toBeTruthy(`Dropdown should be opened on 'Space' press`);
      });

      it(`should open dropdown with 'Enter' and focus toggling element`, async() => {
        await page.focusToggle();
        await sendKey(Key.ENTER);
        await expectFocused(toggle, `Toggling element should be focused`);
        expect(await page.isOpened(dropdown)).toBeTruthy(`Dropdown should be opened on 'Enter' press`);
      });

      it(`should open dropdown with 'ArrowDown' and focus toggling element`, async() => {
        await page.focusToggle();
        await sendKey(Key.ARROW_DOWN);
        await expectFocused(toggle, `Toggling element should be focused`);
        expect(await page.isOpened(dropdown)).toBeTruthy(`Dropdown should be opened on 'ArrowDown' press`);
      });

      it(`should open dropdown with 'ArrowUp' and focus toggling element`, async() => {
        await page.focusToggle();
        await sendKey(Key.ARROW_UP);
        await expectFocused(toggle, `Toggling element should be focused`);
        expect(await page.isOpened(dropdown)).toBeTruthy(`Dropdown should be opened on 'ArrowUp' press`);
      });

      it(`should focus dropdown items with 'ArrowUp' / 'ArrowDown'`, async() => {
        // Open
        await page.open(dropdown);
        await expectFocused(toggle, `Toggling element should be focused`);

        // Down -> first
        await sendKey(Key.ARROW_DOWN);
        await expectFocused(page.getDropdownItem(1), `first dropdown item should be focused`);

        // Down -> second
        await sendKey(Key.ARROW_DOWN);
        await expectFocused(page.getDropdownItem(2), `second dropdown item should be focused`);

        // Down -> second
        await sendKey(Key.ARROW_DOWN);
        await expectFocused(page.getDropdownItem(2), `second dropdown item should stay focused`);

        // Up -> first
        await sendKey(Key.ARROW_UP);
        await expectFocused(page.getDropdownItem(1), `first dropdown item should be focused`);

        // Up -> first
        await sendKey(Key.ARROW_UP);
        await expectFocused(page.getDropdownItem(1), `first dropdown item should stay focused`);
      });

      it(`should focus dropdown first and last items with 'Home' / 'End'`, async() => {
        // Open
        await page.open(dropdown);
        await expectFocused(toggle, `Toggling element should be focused`);

        // End -> last
        await sendKey(Key.END);
        await expectFocused(page.getDropdownItem(2), `last dropdown item should be focused`);

        // Home -> first
        await sendKey(Key.HOME);
        await expectFocused(page.getDropdownItem(1), `first dropdown item should be focused`);
      });

      it(`should close dropdown with 'Escape' and focus toggling element (toggle was focused)`, async() => {
        await page.open(dropdown);
        await expectFocused(toggle, `Toggling element should be focused`);

        await sendKey(Key.ESCAPE);
        expect(await page.isOpened(dropdown)).toBeFalsy(`Dropdown should be closed on 'Escape' press`);
        await expectFocused(toggle, `Toggling element should be focused`);
      });

      it(`should close dropdown with 'Escape' and focus nothing (item was focused)`, async() => {
        await page.open(dropdown);
        await expectFocused(toggle, `Toggling element should be focused`);

        await sendKey(Key.ARROW_DOWN);
        await expectFocused(page.getDropdownItem(1), `first dropdown item should be focused`);

        await sendKey(Key.ESCAPE);
        expect(await page.isOpened(dropdown)).toBeFalsy(`Dropdown should be closed on 'Escape' press`);
        await expectFocused($('body'), `Nothing should be focused after dropdown is closed`);
      });

      it(`should focus dropdown first item with Tab when dropdown is opened (toggle was focused)`, async() => {
        await page.open(dropdown);
        await expectFocused(toggle, `Toggling element should be focused`);

        // Tab -> first
        await sendKey(Key.TAB);
        await expectFocused(page.getDropdownItem(1), `first dropdown item should be focused`);
      });

      it(`should close dropdown with 'Tab' when focus is moved to another element`, async() => {
        await page.open(dropdown);
        await expectFocused(toggle, `Toggling element should be focused`);

        // Down -> first
        await sendKey(Key.ARROW_DOWN);
        await expectFocused(page.getDropdownItem(1), `first dropdown item should be focused`);

        // Home -> last
        await sendKey(Key.END);
        await expectFocused(page.getDropdownItem(2), `second dropdown item should be focused`);

        // Tab -> another element
        await sendKey(Key.TAB);
        expect(await page.isOpened(dropdown)).toBeFalsy(`Dropdown should be closed`);
      });
    });
  });

  describe(`without ngbDropdownItems`, () => {

    beforeEach(async() => {
      await page.selectContainer('inline');
      await page.selectWithItems(false);
    });

    it(`should open dropdown with 'ArrowDown' and focus toggling element`, async() => {
      await page.focusToggle();
      await sendKey(Key.ARROW_DOWN);
      await expectFocused(toggle, `Toggling element should be focused`);
      expect(await page.isOpened(dropdown)).toBeTruthy(`Dropdown should be opened on 'ArrowDown' press`);
    });

    it(`should open dropdown with 'ArrowUp' and focus toggling element`, async() => {
      await page.focusToggle();
      await sendKey(Key.ARROW_UP);
      await expectFocused(toggle, `Toggling element should be focused`);
      expect(await page.isOpened(dropdown)).toBeTruthy(`Dropdown should be opened on 'ArrowUp' press`);
    });
  });

});
