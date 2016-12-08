import {NgbCalendarHijri} from './ngb-calendar-hijri';
import {NgbDate} from '../ngb-date';
import {NgbPeriod, NgbCalendar} from '../ngb-calendar';
import {Injectable} from '@angular/core';

/**
 * The civil calendar is one type of Hijri calendars used in islamic countries.
 * Uses a fixed cycle of alternating 29- and 30-day months,
 * with a leap day added to the last month of 11 out of every 30 years.
 * http://cldr.unicode.org/development/development-process/design-proposals/islamic-calendar-types
 * All the calculations here are based on the equations from "Calendrical Calculations" By Edward M. Reingold, Nachum
 * Dershowitz.
 */

const GREGORIAN_EPOCH = 1721425.5;
const ISLAMIC_EPOCH = 1948439.5;
@Injectable()
export class NgbCalendarIslamicCivil extends NgbCalendarHijri {
  /**
  * Returns the equivalent islamic(civil) date value for a give input Gregorian date.
  * `gdate` is a JS Date to be converted to Hijri.
  */
  public fromGregorian(gdate: Date): NgbDate {
    let date = new Date(gdate);
    let gYear = date.getFullYear(), gMonth = date.getMonth(), gDay = date.getDate();

    let julianDay = GREGORIAN_EPOCH - 1 + 365 * (gYear - 1) + Math.floor((gYear - 1) / 4) +
        -Math.floor((gYear - 1) / 100) + Math.floor((gYear - 1) / 400) +
        Math.floor(
            (367 * (gMonth + 1) - 362) / 12 + (gMonth + 1 <= 2 ? 0 : this._isGregorianLeapYear(date) ? -1 : -2) + gDay);
    julianDay = Math.floor(julianDay) + 0.5;

    let days = julianDay - ISLAMIC_EPOCH;
    let hYear = Math.floor((30 * days + 10646) / 10631.0);
    let hMonth = Math.ceil((days - 29 - this._getYearStart(hYear)) / 29.5);
    hMonth = Math.min(hMonth, 11);
    let hDay = Math.ceil(days - this._getMonthStart(hYear, hMonth)) + 1;
    return new NgbDate(hYear, hMonth + 1, hDay);
  }
  /**
  * Returns the equivalent JS date value for a give input islamic(civil) date.
  * `hijriDate` is an islamic(civil) date to be converted to Gregorian.
  */
  public toGregorian(hijriDate: NgbDate): Date {
    let hYear = hijriDate.year;
    let hMonth = hijriDate.month - 1;
    let hDate = hijriDate.day;
    let julianDay =
        hDate + Math.ceil(29.5 * hMonth) + (hYear - 1) * 354 + Math.floor((3 + 11 * hYear) / 30) + ISLAMIC_EPOCH - 1;

    let wjd = Math.floor(julianDay - 0.5) + 0.5, depoch = wjd - GREGORIAN_EPOCH,
        quadricent = Math.floor(depoch / 146097), dqc = this._mod(depoch, 146097), cent = Math.floor(dqc / 36524),
        dcent = this._mod(dqc, 36524), quad = Math.floor(dcent / 1461), dquad = this._mod(dcent, 1461),
        yindex = Math.floor(dquad / 365), year = quadricent * 400 + cent * 100 + quad * 4 + yindex;
    if (!(cent === 4 || yindex === 4)) {
      year++;
    }

    let gYearStart = GREGORIAN_EPOCH + 365 * (year - 1) + Math.floor((year - 1) / 4) - Math.floor((year - 1) / 100) +
        Math.floor((year - 1) / 400);

    let yearday = wjd - gYearStart;

    let tjd = GREGORIAN_EPOCH - 1 + 365 * (year - 1) + Math.floor((year - 1) / 4) - Math.floor((year - 1) / 100) +
        Math.floor((year - 1) / 400) +
        Math.floor(739 / 12 + (this._isGregorianLeapYear(new Date(year, 3, 1)) ? -1 : -2) + 1);

    let leapadj = wjd < tjd ? 0 : this._isGregorianLeapYear(new Date(year, 3, 1)) ? 1 : 2;

    let month = Math.floor(((yearday + leapadj) * 12 + 373) / 367);
    let tjd2 = GREGORIAN_EPOCH - 1 + 365 * (year - 1) + Math.floor((year - 1) / 4) - Math.floor((year - 1) / 100) +
        Math.floor((year - 1) / 400) +
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
  /**
  * Returns the number of days in a specific Hijri month.
  * `month` is 1 for Muharram, 2 for Safar, etc.
  * `year` is any Hijri year.
  */
  public getDaysInIslamicMonth(month: number, year: number): number {
    let length = 0;
    year = year + Math.floor(month / 13);
    month = ((month - 1) % 12) + 1;
    length = 29 + month % 2;
    if (month === 12 && this._isIslamicLeapYear(year)) {
      length++;
    }
    return length;
  }

  getNext(date: NgbDate, period: NgbPeriod = 'd', number = 1) {
    switch (period) {
      case 'y':
        date = this.setYear(date, date.year + number);
        date.month = 1;
        date.day = 1;
        return date;
      case 'm':
        date = this.setMonth(date, date.month + number);
        date.day = 1;
        return date;
      case 'd':
        return this.setDay(date, date.day + number);
      default:
        return date;
    }
  }

  getPrev(date: NgbDate, period: NgbPeriod = 'd', number = 1) { return this.getNext(date, period, -number); }

  getWeekday(date: NgbDate) {
    let day = this.toGregorian(date).getDay();
    // in JS Date Sun=0, in ISO 8601 Sun=7
    return day === 0 ? 7 : day;
  }

  getWeekNumber(week: NgbDate[], firstDayOfWeek: number) {
    // in JS Date Sun=0, in ISO 8601 Sun=7
    if (firstDayOfWeek === 7) {
      firstDayOfWeek = 0;
    }

    const thursdayIndex = (4 + 7 - firstDayOfWeek) % 7;
    let date = week[thursdayIndex];

    const jsDate = this.toGregorian(date);
    jsDate.setDate(jsDate.getDate() + 4 - (jsDate.getDay() || 7));  // Thursday
    const time = jsDate.getTime();
    let MuhDate = this.toGregorian(new NgbDate(date.year, 1, 1));  // Compare with Muharram 1
    return Math.floor(Math.round((time - MuhDate.getTime()) / 86400000) / 7) + 1;
  }

  getToday(): NgbDate { return this.fromGregorian(new Date()); }
}
