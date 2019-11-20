import {Component} from '@angular/core';
import {NgbDatepickerI18n} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-datepicker-custommonth',
  templateUrl: './datepicker-custommonth.html',
  styles: [`
    ngb-datepicker {
      display: flex;
      border: none;
    }
    .custom-month-view {
      margin: 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      border: 1px solid gray;
      border-radius: 1rem 1rem 0 0;
    }
    .custom-month-view span{
      font-weight: bold;
    }
  `]
})
export class NgbdDatepickerCustommonth {
  constructor(public i18n: NgbDatepickerI18n) {}
}
