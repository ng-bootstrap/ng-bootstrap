import {$, ElementFinder} from 'protractor';

export class DropdownAutoClosePage {
  async clickOutside() { await $('#outside-button').click(); }

  getDropdown(dropDownSelector = '') { return $(`${dropDownSelector}[ngbDropdown]`); }

  getFirstItem(dropdown: ElementFinder) { return dropdown.$$(`.dropdown-item`).first(); }

  getOpenStatus() { return $('#open-status'); }

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
}
