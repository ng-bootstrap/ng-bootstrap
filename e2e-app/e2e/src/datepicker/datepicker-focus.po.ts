import {$} from 'protractor';
import {DatepickerPage} from './datepicker.po';

export class DatepickerFocusPage extends DatepickerPage {
  async preSelectDate() { await $('#selectDate').click(); }

  async selectStartDate(type: string) {
    await $('#start-date-dropdown').click();
    await $(`#start-date-${type}`).click();
  }
}
