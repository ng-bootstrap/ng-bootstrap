import {Injectable, Inject, LOCALE_ID} from '@angular/core';
import {DatePipe} from '@angular/common';

/**
 * NgbDatePicker automatically translates the days of week and months using the Date pipe of Angular,
 * using the locale specified with LOCALE_ID.
 *
 * If you want to customize the translations you can use this service,
 * supplying month and weekday names to to NgbDatepicker component.
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
   * Returns the short month name to display in the date picker navigation.
   * With default calendar we use ISO 8601: 'month' is 1=Jan ... 12=Dec
   */
  abstract getMonthShortName(month: number): string;

  /**
   * Returns the full month name to display in the date picker navigation.
   * With default calendar we use ISO 8601: 'month' is 1=January ... 12=December
   */
  abstract getMonthFullName(month: number): string;
}

@Injectable()
export class NgbDatepickerI18nDefault extends NgbDatepickerI18n {
  private _datePipe: DatePipe;

  private _weekDays = new Array<string>(7);

  private _months = new Array<string>(12);

  private _shortMonths = new Array<string>(12);

  constructor(@Inject(LOCALE_ID) locale: string) {
    super();
    this._datePipe = new DatePipe(locale);

    for (let i = 0; i < this._weekDays.length; i++) {
      const date = new Date(0);
      date.setDate(5 + i);
      this._weekDays[i] = this._datePipe.transform(date, 'EEE');
    }

    console.log(this._weekDays);

    for (let i = 0; i < this._months.length; i++) {
      const date = new Date(0);
      date.setMonth(i);
      this._months[i] = this._datePipe.transform(date, 'MMMM');
      this._shortMonths[i] = this._datePipe.transform(date, 'MMM');
    }
  }

  getWeekdayShortName(weekday: number): string { return this._weekDays[weekday - 1]; }
  getMonthShortName(month: number): string { return this._shortMonths[month - 1]; }
  getMonthFullName(month: number): string { return this._months[month - 1]; }
}
