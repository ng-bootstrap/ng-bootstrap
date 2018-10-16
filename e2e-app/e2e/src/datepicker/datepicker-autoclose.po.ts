import {$} from 'protractor';
import {DatepickerPage} from './datepicker.po';

export class DatepickerAutoClosePage extends DatepickerPage {
  async close() { await $('#close').click(); }

  async clickOutside() { await $('#outside-button').click(); }

  async selectAutoClose(type: string) {
    await $('#autoclose-dropdown').click();
    await $(`#autoclose-${type}`).click();
  }
}
