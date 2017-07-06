import {Component, Injectable} from '@angular/core';
import {NgbDateStruct, NgbCalendar, NgbCalendarHebrew, NgbDatepickerI18n, NgbDatepickerConfig} from '@ng-bootstrap/ng-bootstrap';

const WEEKDAYS_SHORT = {
        'ltr': ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
        'rtl': ['\u05d1\u05f3', '\u05d2\u05f3', '\u05d3\u05f3', '\u05d4\u05f3', '\u05d5\u05f3', '\u05e9\u05f3', '\u05d0\u05f3']
};
const MONTHS_SHORT = {
        'ltr': ['Tish.', 'Chesv.', 'Kisl.', 'Tev.', 'Shv.', 'Adar', 'Nis.', 'Iyar', 'Siv.', 'Tam.', 'Av', 'Elul'],
        'rtl': ['\u05ea\u05e9\u05e8\u05d9', '\u05d7\u05e9\u05d6\u05d6\u05df', '\u05db\u05e1\u05dc\u05d5', '\u05d8\u05d1\u05ea',
               '\u05e9\u05d1\u05d8', '\u05d0\u05d3\u05e8', '\u05e0\u05d9\u05e1\u05df', '\u05d0\u05d9\u05d9\u05e8',
               '\u05e1\u05d9\u05d5\u05d5\u05df', '\u05ea\u05dd\u05d5\u05d6', '\u05d0\u05d1', '\u05d0\u05dc\u05d5\u05dc']
};
const MONTHS_FULL = {
        'ltr': ['Tishri', 'Chesvan', 'Kislev', 'Tevet', 'Shvat', 'Adar', 'Nissan', 'Iyyar', 'Sivan', 'Tamuz', 'Av', 'Elul'],
        'rtl': ['\u05ea\u05e9\u05e8\u05d9', '\u05d7\u05e9\u05d6\u05d6\u05df', '\u05db\u05e1\u05dc\u05d5', '\u05d8\u05d1\u05ea',
               '\u05e9\u05d1\u05d8', '\u05d0\u05d3\u05e8', '\u05e0\u05d9\u05e1\u05df', '\u05d0\u05d9\u05d9\u05e8',
               '\u05e1\u05d9\u05d5\u05d5\u05df', '\u05ea\u05dd\u05d5\u05d6', '\u05d0\u05d1', '\u05d0\u05dc\u05d5\u05dc']
};
const MONTHS_SHORT_LEAP = {
        'ltr': ['Tish.', 'Chesv.', 'Kisl.', 'Tev.', 'Shv.', 'Adar1', 'Adar2', 'Nis.', 'Iyar', 'Siv.', 'Tam.', 'Av', 'Elul'],
        'rtl': ['\u05ea\u05e9\u05e8\u05d9', '\u05d7\u05e9\u05d6\u05d6\u05df', '\u05db\u05e1\u05dc\u05d5', '\u05d8\u05d1\u05ea',
               '\u05e9\u05d1\u05d8', '\u05d0\u05d3\u05e8 \u05d0', '\u05d0\u05d3\u05e8 \u05d1', '\u05e0\u05d9\u05e1\u05df',
               '\u05d0\u05d9\u05d9\u05e8', '\u05e1\u05d9\u05d5\u05d5\u05df', '\u05ea\u05dd\u05d5\u05d6', '\u05d0\u05d1',
               '\u05d0\u05dc\u05d5\u05dc']
};
const MONTHS_FULL_LEAP = {
        'ltr': ['Tishri', 'Chesvan', 'Kislev', 'Tevet', 'Shvat', 'Adar 1', 'Adar 2', 'Nissan', 'Iyyar', 'Sivan', 'Tamuz', 'Av', 'Elul'],
        'rtl': ['\u05ea\u05e9\u05e8\u05d9', '\u05d7\u05e9\u05d6\u05d6\u05df', '\u05db\u05e1\u05dc\u05d5', '\u05d8\u05d1\u05ea',
               '\u05e9\u05d1\u05d8', '\u05d0\u05d3\u05e8 \u05d0\u05f3', '\u05d0\u05d3\u05e8 \u05d1\u05f3', '\u05e0\u05d9\u05e1\u05df',
               '\u05d0\u05d9\u05d9\u05e8', '\u05e1\u05d9\u05d5\u05d5\u05df', '\u05ea\u05dd\u05d5\u05d6', '\u05d0\u05d1',
               '\u05d0\u05dc\u05d5\u05dc']
};

@Injectable()
export class HebrewDatepickerlI18n extends NgbDatepickerI18n {

  direction: 'ltr' | 'rtl' = 'rtl';
  isHebrewLeapYear(year: number): boolean {
      let b = (year * 12 + 17) % 19;
      return b >= ((b < 0) ? -7 : 12);
  }

  getWeekdayShortName(weekday: number) {
    return WEEKDAYS_SHORT[this.direction][weekday - 1];
  }

  getMonthShortName(month: number, year?: number) {
    return year && this.isHebrewLeapYear(year) ? MONTHS_SHORT_LEAP[this.direction][month - 1] : MONTHS_SHORT[this.direction][month - 1];
  }

  getMonthFullName(month: number, year?: number) {
    return year && this.isHebrewLeapYear(year) ? MONTHS_FULL_LEAP[this.direction][month - 1] : MONTHS_FULL[this.direction][month - 1];
  }

  setDirection(dir: 'ltr' | 'rtl'): void {
      this.direction = dir;
  }
}

@Component({
  selector: 'ngbd-datepicker-heb',
  templateUrl: './datepicker-heb.html',
  providers: [NgbDatepickerConfig,
    {provide: NgbCalendar, useClass: NgbCalendarHebrew},
    {provide: NgbDatepickerI18n, useClass: HebrewDatepickerlI18n}
  ]
})

export class NgbdDatepickerHeb {

  private today: NgbDateStruct;

  model: NgbDateStruct;
  date: {year: number, month: number};
  direction: 'ltr' | 'rtl' = 'rtl';

  constructor(public calendar: NgbCalendar, config: NgbDatepickerConfig) {
    config.showWeekNumbers = true;
    this.today = this.date = calendar.getToday();
  }

  selectToday() {
    this.model = {
      year: this.today.year,
      month: this.today.month,
      day: this.today.day
    };
  }

  getGregorian(): string {
      let arr = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
      if (!this.model) {
          return '';
      }
      let date = this.model;
      let gDate = (<NgbCalendarHebrew>this.calendar).toGregorian(date);
      return arr[gDate.getDay()] + ', ' + gDate.getDate() + '.' + (gDate.getMonth() + 1) + '.' + gDate.getFullYear();
  }

  changeDirection(): void {
      if (this.direction === 'rtl') {
          this.direction = 'ltr';
      } else {
          this.direction = 'rtl';
      }
      this.calendar.setDirection(this.direction);
  }
}
