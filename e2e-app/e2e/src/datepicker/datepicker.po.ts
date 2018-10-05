import {$, Key} from 'protractor';
import {expectFocused} from '../tools';

export class DatepickerPage {

  getDatepicker(selector = 'ngb-datepicker') {
    return $(selector);
  }

  getDatepickerInput(selector = 'input[ngbDatepicker]') {
    return $(selector);
  }

  getToggle() {
    return $('#toggle');
  }

  getClearDateButton() {
    return $('#clearDate');
  }

  getSelectDateButton() {
    return $('#selectDate');
  }

  getDayElement(date: Date) {
    const ariaLabel = date.toLocaleString('en', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    return this.getDatepicker().$(`div.ngb-dp-day[aria-label="${ariaLabel}"]`);
  }

  getToday() {
    return this.getDayElement(new Date());
  }

  getPrevMonthArrow() {
    return this.getDatepicker().$(`button[aria-label="Previous month"]`);
  }

  getMonthSelect() {
    return this.getDatepicker().$(`select[aria-label="Select month"]`);
  }

  getYearSelect() {
    return this.getDatepicker().$(`select[aria-label="Select year"]`);
  }

  getNextMonthArrow() {
    return this.getDatepicker().$(`button[aria-label="Next month"]`);
  }

  async clearDate() {
    await this.getClearDateButton().click();
  }

  async preSelectDate() {
    await this.getSelectDateButton().click();
  }

  async openDatepicker() {
    await this.getToggle().click();
    expect(await this.getDatepicker().isPresent()).toBeTruthy(`Datepicker should be present on the page`);
  }

  async reset() {
    await this.clearDate();
    const body = $('body');
    await body.click();
    await body.sendKeys(Key.ESCAPE);

    await expectFocused(body, `Nothing should be focused initially`);
    expect(await this.getDatepicker().isPresent()).toBeFalsy(`Datepicker should be closed initially`);
    expect(await this.getDatepickerInput().getAttribute('value')).toBe('', `Datepicker input should be cleared initially`);
  }
}
