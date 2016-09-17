import {NgbDateHijri} from './ngb-date-hijri';
import {Injectable} from '@angular/core';

/**
 * The civil calendar is one type of Hijri calendars used in islamic countries.
 * Uses a fixed cycle of alternating 29- and 30-day months,
 * with a leap day added to the last month of 11 out of every 30 years.
 * http://cldr.unicode.org/development/development-process/design-proposals/islamic-calendar-types
 */
@Injectable()
export class NgbDateIslamicCivil extends NgbDateHijri {
  private _GREGORIAN_EPOCH = 1721425.5;
  private _ISLAMIC_EPOCH = 1948439.5;

  public fromGregorian(gdate: Date): NgbDateIslamicCivil {
    let date = new Date(gdate);
    let gYear = date.getFullYear(), gMonth = date.getMonth(), gDay = date.getDate();

    let julianDay = this._GREGORIAN_EPOCH - 1 + 365 * (gYear - 1) + Math.floor((gYear - 1) / 4) +
        -Math.floor((gYear - 1) / 100) + Math.floor((gYear - 1) / 400) +
        Math.floor(
            (367 * (gMonth + 1) - 362) / 12 + (gMonth + 1 <= 2 ? 0 : this._isGregorianLeapYear(date) ? -1 : -2) + gDay);
    julianDay = Math.floor(julianDay) + 0.5;

    let days = julianDay - this._ISLAMIC_EPOCH;
    let hYear = Math.floor((30 * days + 10646) / 10631.0);
    let hMonth = Math.ceil((days - 29 - this._getYearStart(hYear)) / 29.5);
    hMonth = Math.min(hMonth, 11);
    let hDay = Math.ceil(days - this._getMonthStart(hYear, hMonth)) + 1;
    this.year = hYear;
    this.month = hMonth;
    this.day = hDay;
    return this;
  }

  public toGregorian(): Date {
    let hYear = this.year;
    let hMonth = this.month;
    let hDate = this.day;
    let julianDay = hDate + Math.ceil(29.5 * hMonth) + (hYear - 1) * 354 + Math.floor((3 + 11 * hYear) / 30) +
        this._ISLAMIC_EPOCH - 1;

    let wjd = Math.floor(julianDay - 0.5) + 0.5, depoch = wjd - this._GREGORIAN_EPOCH,
        quadricent = Math.floor(depoch / 146097), dqc = this._mod(depoch, 146097), cent = Math.floor(dqc / 36524),
        dcent = this._mod(dqc, 36524), quad = Math.floor(dcent / 1461), dquad = this._mod(dcent, 1461),
        yindex = Math.floor(dquad / 365), year = quadricent * 400 + cent * 100 + quad * 4 + yindex;
    if (!(cent === 4 || yindex === 4)) {
      year++;
    }

    let gYearStart = this._GREGORIAN_EPOCH + 365 * (year - 1) + Math.floor((year - 1) / 4) -
        Math.floor((year - 1) / 100) + Math.floor((year - 1) / 400);

    let yearday = wjd - gYearStart;

    let tjd = this._GREGORIAN_EPOCH - 1 + 365 * (year - 1) + Math.floor((year - 1) / 4) - Math.floor((year - 1) / 100) +
        Math.floor((year - 1) / 400) +
        Math.floor(739 / 12 + (this._isGregorianLeapYear(new Date(year, 3, 1)) ? -1 : -2) + 1);

    let leapadj = wjd < tjd ? 0 : this._isGregorianLeapYear(new Date(year, 3, 1)) ? 1 : 2;

    let month = Math.floor(((yearday + leapadj) * 12 + 373) / 367);
    let tjd2 = this._GREGORIAN_EPOCH - 1 + 365 * (year - 1) + Math.floor((year - 1) / 4) -
        Math.floor((year - 1) / 100) + Math.floor((year - 1) / 400) +
        Math.floor(
            (367 * month - 362) / 12 +
            (month <= 2 ? 0 : this._isGregorianLeapYear(new Date(year, month - 1, 1)) ? -1 : -2) + 1);

    let day = wjd - tjd2 + 1;

    return new Date(year, month - 1, day);
  }

  private _isGregorianLeapYear(dateObject: Date): boolean {
    let year = dateObject.getFullYear();
    return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
  }

  private _mod(a: number, b: number): number { return a - b * Math.floor(a / b); }

  protected _getDaysInIslamicMonth(month: number, year: number): number {
    let length = 0;
    year = year + Math.floor(month / 12);
    month = (month + 12) % 12;
    length = 29 + (month + 1) % 2;
    if (month === 11 && this._isIslamicLeapYear(year)) {
      length++;
    }
    return length;
  }
}
