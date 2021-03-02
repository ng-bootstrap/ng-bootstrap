import {Inject, Injectable, LOCALE_ID} from '@angular/core';
import {FormStyle, getLocaleDayNames, getLocaleMonthNames, TranslationWidth, formatDate} from '@angular/common';
import {NgbDateStruct} from './ngb-date-struct';
import {NGB_DATEPICKER_WEEKDAY_FORMAT} from './datepicker-weekday-format';

export function NGB_DATEPICKER_18N_FACTORY(locale, weekDayFormat) {
  return new NgbDatepickerI18nDefault(locale, weekDayFormat);
}

/**
 * A service supplying i18n data to the datepicker component.
 *
 * The default implementation of this service uses the Angular locale and registered locale data for
 * weekdays and month names (as explained in the Angular i18n guide).
 *
 * It also provides a way to i18n data that depends on calendar calculations, like aria labels, day, week and year
 * numerals. For other static labels the datepicker uses the default Angular i18n.
 *
 * See the [i18n demo](#/components/datepicker/examples#i18n) and
 * [Hebrew calendar demo](#/components/datepicker/calendars#hebrew) on how to extend this class and define
 * a custom provider for i18n.
 */
@Injectable(
    {providedIn: 'root', useFactory: NGB_DATEPICKER_18N_FACTORY, deps: [LOCALE_ID, NGB_DATEPICKER_WEEKDAY_FORMAT]})
export abstract class NgbDatepickerI18n {
  /**
   * Returns the short weekday name to display in the heading of the month view.
   *
   * With default calendar we use ISO 8601: 'weekday' is 1=Mon ... 7=Sun.
   */
  abstract getWeekdayShortName(weekday: number): string;

  /**
 * Returns the weekday name to display in the heading of the month view.
 * By default the format is short, but it can be changed with the NGB_DATEPICKER_WEEKDAY_FORMAT token.
 *
 * With default calendar we use ISO 8601: 'weekday' is 1=Mon ... 7=Sun.
 */
  abstract getWeekdayName(weekday: number): string;

  /**
   * Returns the short month name to display in the date picker navigation.
   *
   * With default calendar we use ISO 8601: 'month' is 1=Jan ... 12=Dec.
   */
  abstract getMonthShortName(month: number, year?: number): string;

  /**
   * Returns the full month name to display in the date picker navigation.
   *
   * With default calendar we use ISO 8601: 'month' is 1=Jan ... 12=Dec.
   */
  abstract getMonthFullName(month: number, year?: number): string;

  /**
   * Returns the text label to display above the day view.
   *
   * @since 9.1.0
   */
  getMonthLabel(date: NgbDateStruct): string {
    return `${this.getMonthFullName(date.month, date.year)} ${this.getYearNumerals(date.year)}`;
  }

  /**
   * Returns the value of the `aria-label` attribute for a specific date.
   *
   * @since 2.0.0
   */
  abstract getDayAriaLabel(date: NgbDateStruct): string;

  /**
   * Returns the textual representation of a day that is rendered in a day cell.
   *
   * @since 3.0.0
   */
  getDayNumerals(date: NgbDateStruct): string { return `${date.day}`; }

  /**
   * Returns the textual representation of a week number rendered by datepicker.
   *
   * @since 3.0.0
   */
  getWeekNumerals(weekNumber: number): string { return `${weekNumber}`; }

  /**
   * Returns the textual representation of a year that is rendered in the datepicker year select box.
   *
   * @since 3.0.0
   */
  getYearNumerals(year: number): string { return `${year}`; }
}

/**
 * A service providing default implementation for the datepicker i18n.
 * It can be used as a base implementation if necessary.
 *
 * @since 9.1.0
 */
@Injectable()
export class NgbDatepickerI18nDefault extends NgbDatepickerI18n {
  private _weekdays: readonly string[];
  private _monthsShort: readonly string[];
  private _monthsFull: readonly string[];

  constructor(
      @Inject(LOCALE_ID) private _locale: string,
      @Inject(NGB_DATEPICKER_WEEKDAY_FORMAT) weekDayFormat: TranslationWidth) {
    super();
    const weekdaysStartingOnSunday = getLocaleDayNames(_locale, FormStyle.Standalone, weekDayFormat);
    this._weekdays = weekdaysStartingOnSunday.map((day, index) => weekdaysStartingOnSunday[(index + 1) % 7]);

    this._monthsShort = getLocaleMonthNames(_locale, FormStyle.Standalone, TranslationWidth.Abbreviated);
    this._monthsFull = getLocaleMonthNames(_locale, FormStyle.Standalone, TranslationWidth.Wide);
  }

  getWeekdayShortName(weekday: number): string { return this.getWeekdayName(weekday); }

  getWeekdayName(weekday: number): string { return this._weekdays[weekday - 1] || ''; }

  getMonthShortName(month: number): string { return this._monthsShort[month - 1] || ''; }

  getMonthFullName(month: number): string { return this._monthsFull[month - 1] || ''; }

  getDayAriaLabel(date: NgbDateStruct): string {
    const jsDate = new Date(date.year, date.month - 1, date.day);
    return formatDate(jsDate, 'fullDate', this._locale);
  }
}
