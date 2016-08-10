import {Component} from '@angular/core';

const now = new Date();

@Component({
  selector: 'ngbd-datepicker-basic',
  templateUrl: './datepicker-basic.html'
})
export class NgbdDatepickerBasic {

  model;

  selectToday() {
    this.model = {year: now.getFullYear(), month: now.getMonth(), day: now.getDate()};
  }
}
