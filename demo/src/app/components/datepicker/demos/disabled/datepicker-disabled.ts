import {Component} from '@angular/core';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

const now = new Date();

@Component({
  selector: 'ngbd-datepicker-disabled',
  templateUrl: './datepicker-disabled.html'
})
export class NgbdDatepickerDisabled {

  model: NgbDateStruct = {year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate()};
  disabled = true;
}
