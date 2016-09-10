import {Injectable} from '@angular/core';

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Type of the service supplying month and weekday names to to NgbDatepicker component.
 * See the i18n demo for how to extend this class and define a custom provider for i18n.
 */
@Injectable()
export abstract class NgbDatepickerI18n {
  /**
   * Returns the short week day name to display in the heading of the month view.
   * `weekday` is 0 for Sunday, 1 for Monday, etc.
   */
  abstract getWeekdayName(weekday: number): string;

  /**
   * Returns the month name to display in the date picker navigation.
   * `month` is 0 for January, 1 for February, etc.
   */
  abstract getMonthName(month: number): string;
}

@Injectable()
export class NgbDatepickerI18nDefault extends NgbDatepickerI18n {
  getWeekdayName(weekday: number): string { return WEEKDAYS[weekday]; }

  getMonthName(month: number): string { return MONTHS[month]; }
}
