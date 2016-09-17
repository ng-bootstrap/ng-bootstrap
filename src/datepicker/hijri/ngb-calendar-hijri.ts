import {NgbDateHijri} from './ngb-date-hijri';
import {NgbPeriod, NgbCalendar} from '../ngb-calendar';
import {Injectable} from '@angular/core';

@Injectable()
export class NgbCalendarHijri extends NgbCalendar {
  constructor(public dateModel: {new (...args: number[]): NgbDateHijri}) { super(); }
  getDaysPerWeek() { return 7; }

  getMonths() { return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]; }

  getWeeksPerMonth() { return 6; }

  getNext(date: NgbDateHijri, period: NgbPeriod = 'd', number = 1) {
    let islamicDate = new this.dateModel(date.year, date.month, date.day);
    switch (period) {
      case 'y':
        return new this.dateModel(date.year + number, 0, 1);
      case 'm':
        islamicDate.setMonth(islamicDate.month + number);
        islamicDate.setDay(1);
        return islamicDate;
      case 'd':
        islamicDate.setDay(islamicDate.day + number);
        return islamicDate;
      default:
        return date;
    }
  }

  getPrev(date: NgbDateHijri, period: NgbPeriod = 'd', number = 1) { return this.getNext(date, period, -number); }

  getWeekday(date: NgbDateHijri) {
    let islamicDate = new this.dateModel(date.year, date.month, date.day);
    return islamicDate.toGregorian().getDay();
  }

  getWeekNumber(week: NgbDateHijri[], firstDayOfWeek: number) {
    const thursdayIndex = (4 + 7 - firstDayOfWeek) % 7;
    let date = week[thursdayIndex];

    const islamicDate = new this.dateModel(date.year, date.month, date.day);
    const time = islamicDate.getTime();
    islamicDate.setMonth(0);  // Compare with Muh 1
    islamicDate.setDay(1);
    return Math.floor(Math.round((time - islamicDate.getTime()) / 86400000) / 7) + 1;
  }

  getToday(): NgbDateHijri { return new this.dateModel(); }
}
