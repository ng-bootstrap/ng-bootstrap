import {Component} from '@angular/core';
import {NGB_TIMEPICKER_DIRECTIVES} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-timepicker-steps',
  templateUrl: './timepicker-steps.html',
  directives: [NGB_TIMEPICKER_DIRECTIVES]
})
export class NgbdTimepickerSteps {
  time = {hour: 13, minute: 30, second: 10};
  secondStep = 1;
  minuteStep = 1;
  hourStep = 1;

}
