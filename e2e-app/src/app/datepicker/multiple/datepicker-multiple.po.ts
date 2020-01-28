import {DatepickerPage} from './../datepicker.po';
import {expectFocused} from '../../tools.po';

export class DatepickerMultiplePage extends DatepickerPage {
  async expectActive(date: Date, datepicker) {
    const dateElement = this.getDayElement(date, datepicker);
    expect(await dateElement.$('.active').isPresent()).toBeTruthy(`The date should be active`);
    await expectFocused(dateElement, `active date should be focused`);
  }
}
