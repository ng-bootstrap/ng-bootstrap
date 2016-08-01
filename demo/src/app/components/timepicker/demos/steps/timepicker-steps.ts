import {Component} from '@angular/core';

@Component({
  selector: 'ngbd-timepicker-steps',
  templateUrl: './timepicker-steps.html'
})
export class NgbdTimepickerSteps {
  time = {hour: 13, minute: 30, second: 0};
  hourStep = 1;
  minuteStep = 15;
  secondStep = 30;
}
