import {Component} from '@angular/core';
import {NgbCalendar, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-datepicker-footertemplate',
  templateUrl: './datepicker-footertemplate.html',
  styles: [`.input-group > .form-control {
    flex-basis: auto;
  }`]
})
export class NgbdDatepickerFootertemplate {
  model: NgbDateStruct;
  today = this.calendar.getToday();

  constructor(private calendar: NgbCalendar) {}
}
