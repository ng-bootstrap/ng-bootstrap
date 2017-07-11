import {NgbDate} from './ngb-date';
import {Injectable} from '@angular/core';
import {isInteger} from '../util/util';

function fromJSDate(jsDate: Date) {
  return new NgbDate(jsDate.getFullYear(), jsDate.getMonth() + 1, jsDate.getDate());
}
function toJSDate(date: NgbDate) {
  const jsDate = new Date(date.year, date.month - 1, date.day, 12);
  // this is done avoid 30 -> 1930 conversion
  if (!isNaN(jsDate.getTime())) {
    jsDate.setFullYear(date.year);
  }
  return jsDate;
}

export type NgbPeriod = 'y' | 'm' | 'd';

@Injectable()
export abstract class NgbCalendar {
  abstract getDaysPerWeek(): number;
  abstract getMonths(): number[];
  abstract getWeeksPerMonth(): number;
  abstract getWeekday(date: NgbDate): number;

  abstract getNext(date: NgbDate, period?: NgbPeriod, number?: number): NgbDate;
  abstract getPrev(date: NgbDate, period?: NgbPeriod, number?: number): NgbDate;

  abstract getWeekNumber(week: NgbDate[], firstDayOfWeek: number): number;

  abstract getToday(): NgbDate;

  abstract isValid(date: NgbDate): boolean;
}

@Injectable()
export class NgbCalendarGregorian extends NgbCalendar {
  getDaysPerWeek() { return 7; }

  getMonths() { return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; }

  getWeeksPerMonth() { return 6; }

  getNext(date: NgbDate, period: NgbPeriod = 'd', number = 1) {
    let jsDate = toJSDate(date);

    switch (period) {
      case 'y':
        return new NgbDate(date.year + number, 1, 1);
      case 'm':
        jsDate = new Date(date.year, date.month + number - 1, 1, 12);
        break;
      case 'd':
        jsDate.setDate(jsDate.getDate() + number);
        break;
      default:
        return date;
    }

    return fromJSDate(jsDate);
  }

  getPrev(date: NgbDate, period: NgbPeriod = 'd', number = 1) { return this.getNext(date, period, -number); }

  getWeekday(date: NgbDate) {
    let jsDate = toJSDate(date);
    let day = jsDate.getDay();
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

    const jsDate = toJSDate(date);
    jsDate.setDate(jsDate.getDate() + 4 - (jsDate.getDay() || 7));  // Thursday
    const time = jsDate.getTime();
    jsDate.setMonth(0);  // Compare with Jan 1
    jsDate.setDate(1);
    return Math.floor(Math.round((time - jsDate.getTime()) / 86400000) / 7) + 1;
  }

  getToday(): NgbDate { return fromJSDate(new Date()); }

  isValid(date: NgbDate): boolean {
    if (!date || !isInteger(date.year) || !isInteger(date.month) || !isInteger(date.day)) {
      return false;
    }

    const jsDate = toJSDate(date);

    return !isNaN(jsDate.getTime()) && jsDate.getFullYear() === date.year && jsDate.getMonth() + 1 === date.month &&
        jsDate.getDate() === date.day;
  }
}
