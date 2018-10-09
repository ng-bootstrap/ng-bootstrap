import {$} from 'protractor';

export abstract class DatepickerPage {
  getDatepicker(selector = 'ngb-datepicker') {
    return $(selector);
  }

  getDatepickerInput(selector = 'input[ngbDatepicker]') {
    return $(selector);
  }

  getToggle() {
    return $('#toggle');
  }

  getDayElement(date: Date) {
    const ariaLabel = date.toLocaleString('en', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'});
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

  async openDatepicker() {
    await this.getToggle().click();
    expect(await this.getDatepicker().isPresent()).toBeTruthy(`Datepicker should be present on the page`);
  }
}
