import {page} from '../../../../playwright/controller';
// import {page} from '@test';
import {openUrl, rightClick} from '../../tools.pw-po';

import {DatepickerPage} from '../datepicker.pw-po';

const statusSelector = '#open-status';

export class DatepickerAutoClosePage extends DatepickerPage {
  async loadThePage() {
    await openUrl('datepicker/autoclose');
    expect(await page().innerText('h3')).toContain('Datepicker autoclose tests closed');
  }

  getOpenStatus() { return statusSelector; }

  async closeDatepicker() { await page().click('#close'); }

  async clickOutside() { await page().click('#outside-button'); }

  async rightClickOutside() { await rightClick('#outside-button'); }

  async selectAutoClose(type: string) {
    await page().click('#autoclose-dropdown');
    await page().click(`#autoclose-${type}`);
  }

  async selectDisplayMonths(displayMonths: number) {
    await page().click('#displayMonths-dropdown');
    await page().click(`#displayMonths-${displayMonths}`);
  }

  async openDatepicker() {
    await page().click('#selectDate');
    await super.openDatepicker();
  }

  async expectDatepickerToBeOpen(message) {
    await page().waitForSelector(this.getDatepicker());
    expect(await page().innerText(this.getOpenStatus())).toEqual('open', message);
  }
}
