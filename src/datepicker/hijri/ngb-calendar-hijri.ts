import {NgbDate} from '../ngb-date';
import {NgbPeriod, NgbCalendar} from '../ngb-calendar';
import {Injectable} from '@angular/core';
import {isNumber} from '../../util/util';

@Injectable()
export abstract class NgbCalendarHijri extends NgbCalendar {
  getDaysPerWeek() { return 7; }

  getMonths() { return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; }

  getWeeksPerMonth() { return 6; }

  public setDay(date: NgbDate, dayValue: number): NgbDate {
    dayValue = +dayValue;
    let mdays = this.getDaysInIslamicMonth(date.month, date.year);
    if (dayValue <= 0) {
      while (dayValue <= 0) {
        date = this.setMonth(date, date.month - 1);
        mdays = this.getDaysInIslamicMonth(date.month, date.year);
        dayValue += mdays;
      }
    } else if (dayValue > mdays) {
      while (dayValue > mdays) {
        dayValue -= mdays;
        date = this.setMonth(date, date.month + 1);
        mdays = this.getDaysInIslamicMonth(date.month, date.year);
      }
    }
    date.day = dayValue;
    return date;
  }

  public setMonth(date: NgbDate, month: number): NgbDate {
    month = +month;
    date.year = date.year + Math.floor((month - 1) / 12);
    date.month = Math.floor(((month - 1) % 12 + 12) % 12) + 1;
    return date;
  }

  public setYear(date: NgbDate, yearValue: number): NgbDate {
    date.year = +yearValue;
    return date;
  }

  abstract getWeekday(date: NgbDate): number;
  abstract getNext(date: NgbDate, period?: NgbPeriod, number?: number): NgbDate;
  abstract getPrev(date: NgbDate, period?: NgbPeriod, number?: number): NgbDate;

  abstract getWeekNumber(week: NgbDate[], firstDayOfWeek: number): number;

  abstract getToday(): NgbDate;

  isValid(date: NgbDate): boolean {
    return date && isNumber(date.year) && isNumber(date.month) && isNumber(date.day) &&
        !isNaN(this.toGregorian(date).getTime());
  }

  /**
  * Returns the equivalent Hijri date value for a give input Gregorian date.
  * `gdate` is s JS Date to be converted to Hijri.
  */
  abstract fromGregorian(gdate: Date): NgbDate;
  /**
  * Converts the current Hijri date to Gregorian.
  */
  abstract toGregorian(hijriDate: NgbDate): Date;
  /**
  * Returns the number of days in a specific Hijri month.
  * `month` is 1 for Muharram, 2 for Safar, etc.
  * `year` is any Hijri year.
  */
  public abstract getDaysInIslamicMonth(month: number, year: number): number;

  protected _isIslamicLeapYear(year: number): boolean { return (14 + 11 * year) % 30 < 11; }
  /**
   * Returns the start of Hijri Month.
   * `month` is 0 for Muharram, 1 for Safar, etc.
   * `year` is any Hijri year.
   */
  protected _getMonthStart(year: number, month: number): number {
    return Math.ceil(29.5 * month) + (year - 1) * 354 + Math.floor((3 + 11 * year) / 30.0);
  }
  /**
   * Returns the start of Hijri year.
   * `year` is any Hijri year.
   */
  protected _getYearStart(year: number): number { return (year - 1) * 354 + Math.floor((3 + 11 * year) / 30.0); }
}
