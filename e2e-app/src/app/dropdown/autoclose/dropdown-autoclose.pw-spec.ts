import {test} from '../../../../playwright.conf';
import {waitForFocus, getBoundingBox, Key, offsetClick, openUrl, sendKey} from '../../tools.pw-po';
import {
  clickDropdownItem,
  clickOutside,
  closeDropdown,
  expectDropdownToBeHidden,
  expectDropdownToBeVisible,
  openDropdown,
  rightClickDropdownItem,
  rightClickOutside,
  selectAutoClose,
  SELECTOR_DROPDOWN_ITEM,
  SELECTOR_DROPDOWN_MENU,
  SELECTOR_FORM_INPUT
} from './dropdown-autoclose';


const containers = [null, 'body'];
containers.forEach((container) => {
  describe(`Dropdown Autoclose with container = ${container}`, () => {

    beforeEach(async() => await openUrl('dropdown/autoclose', 'h3:text("Dropdown autoclose")'));

    it(`should not close when right clicking`, async() => {
      await selectAutoClose('true');

      await openDropdown(`Opening dropdown for right clicks`);
      await rightClickDropdownItem();
      await expectDropdownToBeVisible(`Dropdown should NOT be closed on right click inside`);

      await rightClickOutside();
      await expectDropdownToBeVisible(`Dropdown should NOT be closed on right click outside`);
    });

    it(`should work when autoClose === true`, async() => {
      await selectAutoClose('true');

      // escape
      await openDropdown(`Opening dropdown for escape`);
      await sendKey(Key.ESC);
      await expectDropdownToBeHidden(`Dropdown should be closed on ESC`);

      // outside click
      await openDropdown(`Opening dropdown for outside click`);
      await clickOutside();
      await expectDropdownToBeHidden(`Dropdown should be closed on outside click`);

      // inside click
      await openDropdown(`Opening dropdown for inside click`);
      await clickDropdownItem();
      await expectDropdownToBeHidden(`Dropdown should be closed on inside click`);

      // enter
      await openDropdown(`Opening dropdown for enter`);
      await sendKey(Key.ArrowDown);
      await waitForFocus(SELECTOR_DROPDOWN_ITEM, `first dropdown item should be focused`);
      await sendKey(Key.Enter);
      await expectDropdownToBeHidden(`Dropdown should be closed on Enter`);

      // space
      await openDropdown(`Opening dropdown for space`);
      await sendKey(Key.ArrowDown);
      await waitForFocus(SELECTOR_DROPDOWN_ITEM, `first dropdown item should be focused`);
      await sendKey(Key.Space);
      await expectDropdownToBeHidden(`Dropdown should be closed on Space`);
    });

    it(`should't close when interacting with the form inside the dropdown menu`, async() => {
      await selectAutoClose('true');

      // form input click
      await openDropdown(`Opening dropdown`);
      await test.page.click(SELECTOR_FORM_INPUT);
      await expectDropdownToBeVisible(`Dropdown should stay open on click in the form`);

      // form enter / space
      await sendKey(Key.Enter, SELECTOR_FORM_INPUT);
      await expectDropdownToBeVisible(`Dropdown should stay open on Enter in the form`);
      await sendKey(Key.Space, SELECTOR_FORM_INPUT);
      await expectDropdownToBeVisible(`Dropdown should stay open on Space in the form`);
    });

    it(`should't close when clicking on the scrollbar`, async() => {
      await selectAutoClose('true');

      await openDropdown(`Opening dropdown`);

      const {width, height} = await getBoundingBox(SELECTOR_DROPDOWN_MENU);
      await offsetClick(SELECTOR_DROPDOWN_MENU, {x: width - 5, y: height / 2});
      await expectDropdownToBeVisible(`Dropdown should be open`);

    });

    it(`should work when autoClose === false`, async() => {
      await selectAutoClose('false');

      // escape
      await openDropdown(`Opening dropdown for escape`);
      await sendKey(Key.ESC);
      await expectDropdownToBeVisible(`Dropdown should NOT be closed on ESC`);

      // outside click
      await clickOutside();
      await expectDropdownToBeVisible(`Dropdown should NOT be closed on outside click`);

      // inside click
      await clickDropdownItem();
      await expectDropdownToBeVisible(`Dropdown should NOT be closed on inside click`);

      // enter / space
      await closeDropdown('Close dropdown');
      await openDropdown('Reopen dropdown');
      await sendKey(Key.ArrowDown);
      await waitForFocus(SELECTOR_DROPDOWN_ITEM, `first dropdown item should be focused`);
      await sendKey(Key.Enter);
      await expectDropdownToBeVisible(`Dropdown should NOT be closed on Enter`);
      await sendKey(Key.Space);
      await expectDropdownToBeVisible(`Dropdown should NOT be closed on Space`);
    });

    it(`should work when autoClose === 'outside'`, async() => {
      await selectAutoClose('outside');

      // escape
      await openDropdown(`Opening dropdown for escape`);
      await sendKey(Key.ESC);
      await expectDropdownToBeHidden(`Dropdown should be closed on ESC`);

      // outside click
      await openDropdown(`Opening dropdown for outside click`);
      await clickOutside();
      await expectDropdownToBeHidden(`Dropdown should be closed on outside click`);

      // inside click
      await openDropdown(`Opening dropdown for inside click`);
      await clickDropdownItem();
      await expectDropdownToBeVisible(`Dropdown should NOT be closed on inside click`);

      // enter / space
      await closeDropdown('Close dropdown');
      await openDropdown('Reopen dropdown');
      await sendKey(Key.ArrowDown);
      await waitForFocus(SELECTOR_DROPDOWN_ITEM, `first dropdown item should be focused`);
      await sendKey(Key.Enter);
      await expectDropdownToBeVisible(`Dropdown should NOT be closed on Enter`);
      await sendKey(Key.Space);
      await expectDropdownToBeVisible(`Dropdown should NOT be closed on Space`);
    });

    it(`should work when autoClose === 'inside'`, async() => {
      await selectAutoClose('inside');

      // escape
      await openDropdown(`Opening dropdown for escape`);
      await sendKey(Key.ESC);
      await expectDropdownToBeHidden(`Dropdown should be closed on ESC`);

      // outside click
      await openDropdown(`Opening dropdown for outside click`);
      await clickOutside();
      await expectDropdownToBeVisible(`Dropdown should NOT be closed on outside click`);

      // inside click
      await clickDropdownItem();
      await expectDropdownToBeHidden(`Dropdown should be closed on inside click`);

      // enter
      await openDropdown(`Opening dropdown for enter`);
      await sendKey(Key.ArrowDown);
      await waitForFocus(SELECTOR_DROPDOWN_ITEM, `first dropdown item should be focused`);
      await sendKey(Key.Enter);
      await expectDropdownToBeHidden(`Dropdown should be closed on Enter`);

      // space
      await openDropdown(`Opening dropdown for space`);
      await sendKey(Key.ArrowDown);
      await waitForFocus(SELECTOR_DROPDOWN_ITEM, `first dropdown item should be focused`);
      await sendKey(Key.Space);
      await expectDropdownToBeHidden(`Dropdown should be closed on Space`);
    });
  });
});
