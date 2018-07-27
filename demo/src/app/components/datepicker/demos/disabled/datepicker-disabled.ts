import {Component} from '@angular/core';
import {NgbCalendar, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-datepicker-disabled',
  templateUrl: './datepicker-disabled.html'
})
export class NgbdDatepickerDisabled {

  model: NgbDateStruct;
  disabled = true;

  constructor(calendar: NgbCalendar) {
    this.model = calendar.getToday();
  }
}
