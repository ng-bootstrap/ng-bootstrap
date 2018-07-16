import { browser, by, element } from 'protractor';

export class DatepickerFocustrapPage {
  navigateTo() {
    return browser.get('#/datepicker/focustrap');
  }

  getDatepicker(selector = 'ngb-datepicker') {
    return element(by.css(selector));
  }
}
