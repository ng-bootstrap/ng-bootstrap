import {$, Key} from 'protractor';
import {expectFocused} from '../tools';
import {DatepickerPage} from './datepicker.po';

export class DatepickerFocusPage extends DatepickerPage {
  async clearDate() { await $('#clearDate').click(); }

  async preSelectDate() { await $('#selectDate').click(); }

  async reset() {
    await this.clearDate();
    const body = $('body');
    await body.click();
    await body.sendKeys(Key.ESCAPE);

    await expectFocused(body, `Nothing should be focused initially`);
    expect(await this.getDatepicker().isPresent()).toBeFalsy(`Datepicker should be closed initially`);
    expect(await this.getDatepickerInput().getAttribute('value'))
        .toBe('', `Datepicker input should be cleared initially`);
  }
}
