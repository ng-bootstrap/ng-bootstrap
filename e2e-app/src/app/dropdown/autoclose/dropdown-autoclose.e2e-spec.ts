import {Key, ElementFinder, browser} from 'protractor';
import {sendKey, openUrl, rightClick, offsetClick} from '../../tools.po';
import {DropdownAutoClosePage} from './dropdown-autoclose.po';
import {DropdownPage} from '../dropdown.po';

const containers = [null, 'body'];
containers.forEach((container) => {
  describe('Dropdown Autoclose with container = ' + container, () => {
    let page: DropdownAutoClosePage;
    let dropdownPage: DropdownPage;

    const expectDropdownToBeVisible = async(dropdown: ElementFinder, message: string) => {
      expect(await page.isOpened(dropdown)).toBeTruthy(message);
      expect(await page.getOpenStatus().getText()).toBe('open', message);
    };

    const expectDropdownToBeHidden = async(dropdown: ElementFinder, message: string) => {
      expect(await page.isOpened(dropdown)).toBeFalsy(message);
      expect(await page.getOpenStatus().getText()).toBe('closed', message);
    };

    const openDropdown = async(dropdown: ElementFinder, message: string) => {
      await page.open(dropdown);
      await expectDropdownToBeVisible(dropdown, message);
    };

    beforeAll(() => {
      page = new DropdownAutoClosePage();
      dropdownPage = new DropdownPage();
    });

    beforeEach(async() => await openUrl('dropdown/autoclose'));

    it(`should not close when right clicking`, async() => {
      await page.selectAutoClose('true');
      const dropdown = page.getDropdown('#dropdown');

      await openDropdown(dropdown, `Opening dropdown for right clicks`);
      await rightClick(page.getFirstItem(dropdown));
      await expectDropdownToBeVisible(dropdown, `Dropdown should NOT be closed on right click inside`);

      await page.rightClickOutside();
      await expectDropdownToBeVisible(dropdown, `Dropdown should NOT be closed on right click outside`);
    });

    it(`should work when autoClose === true`, async() => {
      await page.selectAutoClose('true');
      const dropdown = page.getDropdown('#dropdown');

      // escape
      await openDropdown(dropdown, `Opening dropdown for escape`);
      await sendKey(Key.ESCAPE);
      await expectDropdownToBeHidden(dropdown, `Dropdown should be closed on ESC`);

      // outside click
      await openDropdown(dropdown, `Opening dropdown for outside click`);
      await page.clickOutside();
      await expectDropdownToBeHidden(dropdown, `Dropdown should be closed on outside click`);

      // inside click
      await openDropdown(dropdown, `Opening dropdown for inside click`);
      await page.getFirstItem(dropdown).click();
      await expectDropdownToBeHidden(dropdown, `Dropdown should be closed on inside click`);
    });

    it(`should't close when clicking on the form input`, async() => {
      await page.selectAutoClose('true');
      const dropdown = page.getDropdown('#dropdown');

      await openDropdown(dropdown, `Opening dropdown`);
      await page.getFormInput(dropdown).click();
      await expectDropdownToBeVisible(dropdown, `Dropdown should be open`);

    });

    it(`should't close when clicking on the scrollbar`, async() => {
      await page.selectAutoClose('true');
      const dropdown = page.getDropdown('#dropdown');

      await openDropdown(dropdown, `Opening dropdown`);

      const dropdownMenu = dropdownPage.getDropdownMenu('#dropdownMenuId');
      const dropdownSize = await dropdownMenu.getSize();

      offsetClick(dropdownMenu, {x: dropdownSize.width - 5, y: dropdownSize.height / 2});
      await expectDropdownToBeVisible(dropdown, `Dropdown should be open`);

    });

    it(`should work when autoClose === false`, async() => {
      await page.selectAutoClose('false');
      const dropdown = page.getDropdown('#dropdown');

      // escape
      await openDropdown(dropdown, `Opening dropdown for escape`);
      await sendKey(Key.ESCAPE);
      await expectDropdownToBeVisible(dropdown, `Dropdown should NOT be closed on ESC`);

      // outside click
      await page.clickOutside();
      await expectDropdownToBeVisible(dropdown, `Dropdown should NOT be closed on outside click`);

      // inside click
      await page.getFirstItem(dropdown).click();
      await expectDropdownToBeVisible(dropdown, `Dropdown should NOT be closed on inside click`);
    });

    it(`should work when autoClose === 'outside'`, async() => {
      await page.selectAutoClose('outside');
      const dropdown = page.getDropdown('#dropdown');

      // escape
      await openDropdown(dropdown, `Opening dropdown for escape`);
      await sendKey(Key.ESCAPE);
      await expectDropdownToBeHidden(dropdown, `Dropdown should be closed on ESC`);

      // outside click
      await openDropdown(dropdown, `Opening dropdown for outside click`);
      await page.clickOutside();
      await expectDropdownToBeHidden(dropdown, `Dropdown should be closed on outside click`);

      // inside click
      await openDropdown(dropdown, `Opening dropdown for inside click`);
      await page.getFirstItem(dropdown).click();
      await expectDropdownToBeVisible(dropdown, `Dropdown should NOT be closed on inside click`);
    });

    it(`should work when autoClose === 'inside'`, async() => {
      await page.selectAutoClose('inside');
      const dropdown = page.getDropdown('#dropdown');

      // escape
      await openDropdown(dropdown, `Opening dropdown for escape`);
      await sendKey(Key.ESCAPE);
      await expectDropdownToBeHidden(dropdown, `Dropdown should be closed on ESC`);

      // outside click
      await openDropdown(dropdown, `Opening dropdown for outside click`);
      await page.clickOutside();
      await expectDropdownToBeVisible(dropdown, `Dropdown should NOT be closed on outside click`);

      // inside click
      await page.getFirstItem(dropdown).click();
      await expectDropdownToBeHidden(dropdown, `Dropdown should be closed on inside click`);
    });
  });
});
