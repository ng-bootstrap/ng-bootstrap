import {NgbDate} from './ngb-date';
import {Injectable} from '@angular/core';

function fromJSDate(jsDate: Date) {
  return new NgbDate(jsDate.getFullYear(), jsDate.getMonth(), jsDate.getDate());
}
function toJSDate(date: NgbDate) {
  return new Date(date.year, date.month, date.day);
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
}

@Injectable()
export class NgbCalendarGregorian extends NgbCalendar {
  getDaysPerWeek() { return 7; }

  getMonths() { return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]; }

  getWeeksPerMonth() { return 6; }

  getNext(date: NgbDate, period: NgbPeriod = 'd', number = 1) {
    let jsDate = toJSDate(date);

    switch (period) {
      case 'y':
        return new NgbDate(date.year + number, 0, 1);
      case 'm':
        jsDate = new Date(date.year, date.month + number, 1);
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
    return jsDate.getDay();
  }

  getWeekNumber(week: NgbDate[], firstDayOfWeek: number) {
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
}
