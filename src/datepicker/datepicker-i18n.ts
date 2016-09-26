import {Injectable} from '@angular/core';

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Type of the service supplying month and weekday names to to NgbDatepicker component.
 * See the i18n demo for how to extend this class and define a custom provider for i18n.
 */
@Injectable()
export abstract class NgbDatepickerI18n {
  /**
   * Returns the short week day name to display in the heading of the month view.
   * With default calendar we use ISO 8601: 'weekday' is 1=Mon ... 7=Sun
   */
  abstract getWeekdayName(weekday: number): string;

  /**
   * Returns the month name to display in the date picker navigation.
   * With default calendar we use ISO 8601: 'month' is 1=Jan ... 12=Dec
   */
  abstract getMonthName(month: number): string;
}

@Injectable()
export class NgbDatepickerI18nDefault extends NgbDatepickerI18n {
  getWeekdayName(weekday: number): string { return WEEKDAYS[weekday - 1]; }

  getMonthName(month: number): string { return MONTHS[month - 1]; }
}
