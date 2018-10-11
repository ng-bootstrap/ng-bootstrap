import {$, ElementFinder} from 'protractor';
import {expectFocused} from '../tools';

export class DropdownAutoClosePage {

  async close() {
    await $('#close').click();
  }

  async clickOutside() {
    await $('#outside-button').click();
  }

  getDropdown(dropDownSelector = '') {
    return $(`${dropDownSelector}[ngbDropdown]`);
  }

  getFirstItem(dropdown: ElementFinder) {
    return dropdown.$$(`.dropdown-item`).first();
  }

  async open(dropdown: ElementFinder) {
    await dropdown.$(`button[ngbDropdownToggle]`).click();
    expect(await this.isOpened(dropdown)).toBeTruthy(`Dropdown should have been opened`);
  }

  async selectAutoClose(type: string) {
    await $('#autoclose-dropdown').click();
    await $(`#autoclose-${type}`).click();
  }

  async isOpened(dropdown: ElementFinder) {
    const classNames = await dropdown.getAttribute('class');
    return classNames.includes('show');
  }

  async reset() {
    await this.close();
    const body = $('body');
    await body.click();

    await expectFocused(body, `Nothing should be focused initially`);

    const dropdown = this.getDropdown('#dropdown');
    expect(await this.isOpened(dropdown)).toBeFalsy(`Dropdown should be closed initially`);
  }
}
