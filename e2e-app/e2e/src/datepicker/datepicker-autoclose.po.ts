import {$} from 'protractor';
import {expectFocused} from '../tools';
import {DatepickerPage} from './datepicker.po';

export class DatepickerAutoClosePage extends DatepickerPage {
  async clearDate() { await $('#clearDate').click(); }

  async close() { await $('#close').click(); }

  async clickOutside() { await $('#outside-button').click(); }

  async selectAutoClose(type: string) {
    await $('#autoclose-dropdown').click();
    await $(`#autoclose-${type}`).click();
  }

  async reset() {
    await this.close();
    await this.clearDate();
    const body = $('body');
    await body.click();

    await expectFocused(body, `Nothing should be focused initially`);
    expect(await this.getDatepicker().isPresent()).toBeFalsy(`Datepicker should be closed initially`);
    expect(await this.getDatepickerInput().getAttribute('value'))
        .toBe('', `Datepicker input should be cleared initially`);
  }
}
