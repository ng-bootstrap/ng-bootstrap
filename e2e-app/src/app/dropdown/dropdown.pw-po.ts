import {test} from '../../../playwright.conf';
import {joinSelectors} from '../tools.pw-po';

export class DropdownPage {
  getDropdownSelector(dropDownSelector = '') { return `${dropDownSelector}[ngbDropdown]`; }

  getDropdownMenuSelector(dropDownMenuSelector = 'div'): string { return `${dropDownMenuSelector}[ngbdropdownmenu]`; }

  getDropdownToggleSelector(toggleSelector = 'button'): string { return `${toggleSelector}[ngbDropdownToggle]`; }

  getDropdownMenuParentSelector(dropdownMenuSelector: string) {
    return joinSelectors(dropdownMenuSelector, 'xpath=//..');
  }

  getDropdownItemSelector(dropdownSelector = this.getDropdownSelector()) {
    return joinSelectors(dropdownSelector, '.dropdown-item');
  }

  getBodyContainers() { return test.page.$$('body > div.dropdown,body > div.dropup'); }

  async open(dropdownSelector: string) {
    await test.page.click(joinSelectors(dropdownSelector, `button[ngbDropdownToggle]`));
    expect(await this.isOpened(dropdownSelector)).toBeTruthy(`Dropdown should have been opened`);
  }

  async close(dropdownSelector: string) {
    await test.page.click(joinSelectors(dropdownSelector, `button[ngbDropdownToggle]`));
    expect(await this.isOpened(dropdownSelector)).toBeFalsy(`Dropdown should have been closed`);
  }

  async isOpened(dropdownSelector: string) {
    const classNames = await test.page.getAttribute(dropdownSelector, 'class');
    return classNames !.includes('show');
  }
}
