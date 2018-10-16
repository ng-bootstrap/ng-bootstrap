import {$} from 'protractor';
import {DatepickerPage} from './datepicker.po';

export class DatepickerFocusPage extends DatepickerPage {
  async preSelectDate() { await $('#selectDate').click(); }
}
