import {Component} from '@angular/core';

@Component({templateUrl: './datepicker-autoclose.component.html'})
export class DatepickerAutoCloseComponent {
  model = null;
  autoClose: boolean | 'inside' | 'outside' = true;
}
