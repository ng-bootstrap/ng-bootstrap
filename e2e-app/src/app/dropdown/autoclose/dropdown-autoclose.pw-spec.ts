import {page} from '../../../../playwright.conf';
import {sendKey, Key, rightClick, offsetClick, expectFocused, getBoundindClientRect} from '../../tools.pw-po';
import {DropdownAutoClosePage} from './dropdown-autoclose.pw-po';
import {DropdownPage} from '../dropdown.pw-po';


const containers = [null, 'body'];
containers.forEach((container) => {
  describe('Dropdown Autoclose with container = ' + container, () => {
    let po: DropdownAutoClosePage;
    let dropdownPo: DropdownPage;

    const expectDropdownToBeVisible = async(dropdownSelector: string, message: string) => {
      await page().waitForSelector(po.getDropdownItemSelector(1));
      expect(await po.isOpened(dropdownSelector)).toBeTruthy(message);
      expect(await page().textContent(po.getOpenStatusSelector())).toBe('open', message);
    };

    const expectDropdownToBeHidden = async(dropdownSelector: string, message: string) => {
      await page().waitForSelector(po.getDropdownItemSelector(1), {state: 'hidden'});
      expect(await po.isOpened(dropdownSelector)).toBeFalsy(message);
      expect(await page().textContent(po.getOpenStatusSelector())).toBe('closed', message);
    };

    const openDropdown = async(dropdownSelector: string, message: string) => {
      await po.toggleDropdown(dropdownSelector);
      await expectDropdownToBeVisible(dropdownSelector, message);
    };

    const closeDropdown = async(dropdownSelector: string, message: string) => {
      await po.toggleDropdown(dropdownSelector);
      await expectDropdownToBeHidden(dropdownSelector, message);
    };

    beforeAll(() => {
      po = new DropdownAutoClosePage();
      dropdownPo = new DropdownPage();
    });

    beforeEach(async() => await po.loadThePage());

    it(`should not close when right clicking`, async() => {
      await po.selectAutoClose('true');
      const dropdownSelector = po.getDropdownSelector('#dropdown');

      await openDropdown(dropdownSelector, `Opening dropdown for right clicks`);
      await rightClick(dropdownPo.getDropdownItemSelector(dropdownSelector));
      await expectDropdownToBeVisible(dropdownSelector, `Dropdown should NOT be closed on right click inside`);

      await po.rightClickOutside();
      await expectDropdownToBeVisible(dropdownSelector, `Dropdown should NOT be closed on right click outside`);
    });

    it(`should work when autoClose === true`, async() => {
      await po.selectAutoClose('true');
      const dropdownSelector = po.getDropdownSelector('#dropdown');

      // escape
      await openDropdown(dropdownSelector, `Opening dropdown for escape`);
      await sendKey(Key.ESC);
      await expectDropdownToBeHidden(dropdownSelector, `Dropdown should be closed on ESC`);

      // outside click
      await openDropdown(dropdownSelector, `Opening dropdown for outside click`);
      await po.clickOutside();
      await expectDropdownToBeHidden(dropdownSelector, `Dropdown should be closed on outside click`);

      // inside click
      await openDropdown(dropdownSelector, `Opening dropdown for inside click`);
      await page().click(dropdownPo.getDropdownItemSelector(dropdownSelector));
      await expectDropdownToBeHidden(dropdownSelector, `Dropdown should be closed on inside click`);

      // enter
      await openDropdown(dropdownSelector, `Opening dropdown for enter`);
      await sendKey(Key.ArrowDown);
      await expectFocused(po.getDropdownItemSelector(1), `first dropdown item should be focused`);
      await sendKey(Key.Enter);
      await expectDropdownToBeHidden(dropdownSelector, `Dropdown should be closed on Enter`);

      // space
      await openDropdown(dropdownSelector, `Opening dropdown for space`);
      await sendKey(Key.ArrowDown);
      await expectFocused(po.getDropdownItemSelector(1), `first dropdown item should be focused`);
      await sendKey(Key.Space);
      await expectDropdownToBeHidden(dropdownSelector, `Dropdown should be closed on Space`);
    });

    it(`should't close when interacting with the form inside the dropdown menu`, async() => {
      await po.selectAutoClose('true');
      const dropdownSelector = po.getDropdownSelector('#dropdown');

      // form input click
      const formInputSelector = po.getFormInputSelector(dropdownSelector);

      await openDropdown(dropdownSelector, `Opening dropdown`);
      await page().click(formInputSelector);
      await expectDropdownToBeVisible(dropdownSelector, `Dropdown should stay open on click in the form`);

      // form enter / space
      await sendKey(Key.Enter, formInputSelector);
      await expectDropdownToBeVisible(dropdownSelector, `Dropdown should stay open on Enter in the form`);
      await sendKey(Key.Space, formInputSelector);
      await expectDropdownToBeVisible(dropdownSelector, `Dropdown should stay open on Space in the form`);
    });

    it(`should't close when clicking on the scrollbar`, async() => {
      await po.selectAutoClose('true');
      const dropdownSelector = po.getDropdownSelector('#dropdown');

      await openDropdown(dropdownSelector, `Opening dropdown`);

      const dropdownMenuSelector = dropdownPo.getDropdownMenuSelector('#dropdownMenuId');
      const dropdownSize = await getBoundindClientRect(dropdownMenuSelector);

      offsetClick(dropdownMenuSelector, {x: dropdownSize.width - 5, y: dropdownSize.height / 2});
      await expectDropdownToBeVisible(dropdownSelector, `Dropdown should be open`);

    });

    it(`should work when autoClose === false`, async() => {
      await po.selectAutoClose('false');
      const dropdownSelector = po.getDropdownSelector('#dropdown');

      // escape
      await openDropdown(dropdownSelector, `Opening dropdown for escape`);
      await sendKey(Key.ESC);
      await expectDropdownToBeVisible(dropdownSelector, `Dropdown should NOT be closed on ESC`);

      // outside click
      await po.clickOutside();
      await expectDropdownToBeVisible(dropdownSelector, `Dropdown should NOT be closed on outside click`);

      // inside click
      await page().click(dropdownPo.getDropdownItemSelector(dropdownSelector));
      await expectDropdownToBeVisible(dropdownSelector, `Dropdown should NOT be closed on inside click`);

      // enter / space
      await closeDropdown(dropdownSelector, 'Close dropdown');
      await openDropdown(dropdownSelector, 'Reopen dropdown');
      await sendKey(Key.ArrowDown);
      await expectFocused(po.getDropdownItemSelector(1), `first dropdown item should be focused`);
      await sendKey(Key.Enter);
      await expectDropdownToBeVisible(dropdownSelector, `Dropdown should NOT be closed on Enter`);
      await sendKey(Key.Space);
      await expectDropdownToBeVisible(dropdownSelector, `Dropdown should NOT be closed on Space`);
    });

    it(`should work when autoClose === 'outside'`, async() => {
      await po.selectAutoClose('outside');
      const dropdownSelector = po.getDropdownSelector('#dropdown');

      // escape
      await openDropdown(dropdownSelector, `Opening dropdown for escape`);
      await sendKey(Key.ESC);
      await expectDropdownToBeHidden(dropdownSelector, `Dropdown should be closed on ESC`);

      // outside click
      await openDropdown(dropdownSelector, `Opening dropdown for outside click`);
      await po.clickOutside();
      await expectDropdownToBeHidden(dropdownSelector, `Dropdown should be closed on outside click`);

      // inside click
      await openDropdown(dropdownSelector, `Opening dropdown for inside click`);
      await page().click(dropdownPo.getDropdownItemSelector(dropdownSelector));
      await expectDropdownToBeVisible(dropdownSelector, `Dropdown should NOT be closed on inside click`);

      // enter / space
      await closeDropdown(dropdownSelector, 'Close dropdown');
      await openDropdown(dropdownSelector, 'Reopen dropdown');
      await sendKey(Key.ArrowDown);
      await expectFocused(po.getDropdownItemSelector(1), `first dropdown item should be focused`);
      await sendKey(Key.Enter);
      await expectDropdownToBeVisible(dropdownSelector, `Dropdown should NOT be closed on Enter`);
      await sendKey(Key.Space);
      await expectDropdownToBeVisible(dropdownSelector, `Dropdown should NOT be closed on Space`);
    });

    it(`should work when autoClose === 'inside'`, async() => {
      await po.selectAutoClose('inside');
      const dropdownSelector = po.getDropdownSelector('#dropdown');

      // escape
      await openDropdown(dropdownSelector, `Opening dropdown for escape`);
      await sendKey(Key.ESC);
      await expectDropdownToBeHidden(dropdownSelector, `Dropdown should be closed on ESC`);

      // outside click
      await openDropdown(dropdownSelector, `Opening dropdown for outside click`);
      await po.clickOutside();
      await expectDropdownToBeVisible(dropdownSelector, `Dropdown should NOT be closed on outside click`);

      // inside click
      await page().click(dropdownPo.getDropdownItemSelector(dropdownSelector));
      await expectDropdownToBeHidden(dropdownSelector, `Dropdown should be closed on inside click`);

      // enter
      await openDropdown(dropdownSelector, `Opening dropdown for enter`);
      await sendKey(Key.ArrowDown);
      await expectFocused(po.getDropdownItemSelector(1), `first dropdown item should be focused`);
      await sendKey(Key.Enter);
      await expectDropdownToBeHidden(dropdownSelector, `Dropdown should be closed on Enter`);

      // space
      await openDropdown(dropdownSelector, `Opening dropdown for space`);
      await sendKey(Key.ArrowDown);
      await expectFocused(po.getDropdownItemSelector(1), `first dropdown item should be focused`);
      await sendKey(Key.Space);
      await expectDropdownToBeHidden(dropdownSelector, `Dropdown should be closed on Space`);
    });
  });
});
