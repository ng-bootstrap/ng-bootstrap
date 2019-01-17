import {$} from 'protractor';
import {DatepickerPage} from '../datepicker.po';

export class DatepickerAutoClosePage extends DatepickerPage {
  getOpenStatus() { return $('#open-status'); }

  async closeDatepicker() { await $('#close').click(); }

  async clickOutside() { await $('#outside-button').click(); }

  async selectAutoClose(type: string) {
    await $('#autoclose-dropdown').click();
    await $(`#autoclose-${type}`).click();
  }

  async selectDisplayMonths(displayMonths: number) {
    await $('#displayMonths-dropdown').click();
    await $(`#displayMonths-${displayMonths}`).click();
  }

  async openDatepicker() {
    await $('#selectDate').click();
    await super.openDatepicker();
  }
}
