import {page} from '../../../../playwright/controller';
import {joinSelectors, rightClick, openUrl} from '../../tools.pw-po';

export class DropdownAutoClosePage {
  async loadThePage() {
    await openUrl('dropdown/autoclose');
    expect(await page().innerText('h3')).toContain('Dropdown autoclose tests');
  }

  async clickOutside() { await page().click('#outside-button'); }

  getDropdownSelector(dropDownSelector = ''): string { return `${dropDownSelector}[ngbDropdown]`; }

  getDropdownItemSelector(item: number): string { return `#item-${item}`; }

  getFormInputSelector(dropdownSelector: string): string { return joinSelectors(dropdownSelector, `input`); }

  getOpenStatusSelector(): string { return '#open-status'; }

  async rightClickOutside() { await rightClick('#outside-button'); }

  async toggleDropdown(dropdownSelector: string) {
    const expectedState = !(await this.isOpened(dropdownSelector));
    await page().click(joinSelectors(dropdownSelector, `button[ngbDropdownToggle]`));
    if (expectedState) {
      expect(await this.isOpened(dropdownSelector)).toBeTruthy(`Dropdown should have been opened`);
    } else {
      expect(await this.isOpened(dropdownSelector)).toBeFalsy(`Dropdown should have been closed`);
    }
  }

  async selectAutoClose(type: string) {
    await page().click('#autoclose-dropdown');
    await page().click(`#autoclose-${type}`);
  }

  async isOpened(dropdownSelector) {
    const classNames = await page().getAttribute(dropdownSelector, 'class');
    return classNames !.includes('show');
  }
}
