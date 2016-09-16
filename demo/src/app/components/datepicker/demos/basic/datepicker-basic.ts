import {Component} from '@angular/core';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

const now = new Date();

@Component({
  selector: 'ngbd-datepicker-basic',
  templateUrl: './datepicker-basic.html'
})
export class NgbdDatepickerBasic {

  model: NgbDateStruct;

  selectToday() {
    this.model = {year: now.getFullYear(), month: now.getMonth(), day: now.getDate()};
  }
}
