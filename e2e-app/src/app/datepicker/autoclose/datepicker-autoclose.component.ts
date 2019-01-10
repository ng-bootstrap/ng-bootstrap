import {Component} from '@angular/core';

@Component({templateUrl: './datepicker-autoclose.component.html'})
export class DatepickerAutoCloseComponent {
  autoClose: boolean | 'inside' | 'outside' = true;
  model = null;
  displayMonths = 1;
}
