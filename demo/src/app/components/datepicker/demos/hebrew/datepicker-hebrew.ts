import {Component} from '@angular/core';
import {
  NgbCalendar,
  NgbCalendarHebrew,
  NgbDatepickerI18n,
  NgbDatepickerI18nHebrew,
  NgbDateStruct
} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-datepicker-hebrew',
  templateUrl: './datepicker-hebrew.html',
  providers: [
    {provide: NgbCalendar, useClass: NgbCalendarHebrew},
    {provide: NgbDatepickerI18n, useClass: NgbDatepickerI18nHebrew}
  ]
})
export class NgbdDatepickerHebrew {

  model: NgbDateStruct;

  constructor(private calendar: NgbCalendar) {}

  selectToday() {
    this.model = this.calendar.getToday();
  }
}
