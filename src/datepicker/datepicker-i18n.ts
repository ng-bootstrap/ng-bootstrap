import {Inject, Injectable, LOCALE_ID} from '@angular/core';
import {FormStyle, getLocaleDayNames, getLocaleMonthNames, TranslationWidth, formatDate} from '@angular/common';
import {NgbDateStruct} from './ngb-date-struct';

/**
 * Type of the service supplying month and weekday names to to NgbDatepicker component.
 * The default implementation of this service honors the Angular locale, and uses the registered locale data,
 * as explained in the Angular i18n guide.
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

  /**
   * Returns the value of the 'aria-label' attribute for a specific date
   *
   * @since 2.0.0
   */
  abstract getDayAriaLabel(date: NgbDateStruct): string;

  /**
   * Returns the textual representation of a day that is rendered in a day cell
   */
  getDayNumerals(date: NgbDateStruct): string { return `${date.day}`; }

  /**
   * Returns the textual representation of a week number rendered by date picker
   */
  getWeekNumerals(weekNumber: number): string { return `${weekNumber}`; }

  /**
   * Returns the textual representation of a year that is rendered
   * in date picker year select box
   */
  getYearNumerals(year: number): string { return `${year}`; }
}

@Injectable()
export class NgbDatepickerI18nDefault extends NgbDatepickerI18n {
  private _weekdaysShort: Array<string>;
  private _monthsShort: Array<string>;
  private _monthsFull: Array<string>;

  constructor(@Inject(LOCALE_ID) private _locale: string) {
    super();

    const weekdaysStartingOnSunday = getLocaleDayNames(_locale, FormStyle.Standalone, TranslationWidth.Short);
    this._weekdaysShort = weekdaysStartingOnSunday.map((day, index) => weekdaysStartingOnSunday[(index + 1) % 7]);

    this._monthsShort = getLocaleMonthNames(_locale, FormStyle.Standalone, TranslationWidth.Abbreviated);
    this._monthsFull = getLocaleMonthNames(_locale, FormStyle.Standalone, TranslationWidth.Wide);
  }

  getWeekdayShortName(weekday: number): string { return this._weekdaysShort[weekday - 1]; }

  getMonthShortName(month: number): string { return this._monthsShort[month - 1]; }

  getMonthFullName(month: number): string { return this._monthsFull[month - 1]; }

  getDayAriaLabel(date: NgbDateStruct): string {
    const jsDate = new Date(date.year, date.month - 1, date.day);
    return formatDate(jsDate, 'fullDate', this._locale);
  }
}
