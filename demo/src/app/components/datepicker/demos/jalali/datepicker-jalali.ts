import {Component, Injectable} from '@angular/core';
import {NgbDateStruct, NgbCalendar, NgbDatepickerI18n, NgbCalendarPersian, NgbDatepickerI18nPersian} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-datepicker-jalali',
  templateUrl: './datepicker-jalali.html',
  providers: [
    {provide: NgbCalendar, useClass: NgbCalendarPersian},
    {provide: NgbDatepickerI18n, useClass: NgbDatepickerI18nPersian}
  ]
})
export class NgbdDatepickerJalali {

  private today: NgbDateStruct;

  model: NgbDateStruct;
  date: {year: number, month: number};

  constructor(calendar: NgbCalendar) {
    this.today = calendar.getToday();
  }

  selectToday() {
    this.model = {
      year: this.today.year,
      month: this.today.month,
      day: this.today.day
    };
  }
}
