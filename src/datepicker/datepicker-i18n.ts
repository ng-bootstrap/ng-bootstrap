import {Injectable} from '@angular/core';

const WEEKDAYS_SHORT = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const WEEKDAYS_FULL = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_FULL = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November',
  'December'
];
const MSG = ['Go to previous month', 'Go to next month'];

/**
 * Type of the service supplying month and weekday names to to NgbDatepicker component.
 * See the i18n demo for how to extend this class and define a custom provider for i18n.
 */
@Injectable()
export abstract class NgbDatepickerI18n {
  /**
   * Returns the short weekday name to display in the heading of the month view.
   * With default calendar we use ISO 8601: 'weekday' is 1=Mon ... 7=Sun
   */
  abstract getWeekdayShortName(weekday: number): string;

  /**
   * Returns the full weekday name to be used in the aria-label of the default day view.
   * With default calendar we use ISO 8601: 'weekday' is 1=Mon ... 7=Sun
   */
  abstract getWeekdayFullName(weekday: number): string;

  /**
   * Returns the short month name to display in the date picker navigation.
   * With default calendar we use ISO 8601: 'month' is 1=Jan ... 12=Dec
   */
  abstract getMonthShortName(month: number): string;

  /**
   * Returns the full month name to display in the date picker navigation.
   * With default calendar we use ISO 8601: 'month' is 1=January ... 12=December
   */
  abstract getMonthFullName(month: number): string;

  /**
   * Return message for the text of accessibility elements like arrows.
   * 1: previous arrow message title
   * 2: next arrow message title
   */
  abstract getMsg(number: number): string;
}

@Injectable()
export class NgbDatepickerI18nDefault extends NgbDatepickerI18n {
  getWeekdayShortName(weekday: number): string { return WEEKDAYS_SHORT[weekday - 1]; }

  getMonthShortName(month: number): string { return MONTHS_SHORT[month - 1]; }

  getWeekdayFullName(weekday: number): string { return WEEKDAYS_FULL[weekday - 1]; }

  getMonthFullName(month: number): string { return MONTHS_FULL[month - 1]; }

  getMsg(number: number): string { return MSG[number - 1]; }
}
