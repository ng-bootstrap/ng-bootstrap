import {Component} from '@angular/core';

const now = new Date();

@Component({
  selector: 'ngbd-datepicker-disabled',
  templateUrl: './datepicker-disabled.html'
})
export class NgbdDatepickerDisabled {

  model = {year: now.getFullYear(), month: now.getMonth(), day: now.getDate()};
  disabled = true;
}
