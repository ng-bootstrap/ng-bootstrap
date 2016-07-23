import {Component} from '@angular/core';
import {NGB_TIMEPICKER_DIRECTIVES} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-timepicker-seconds',
  templateUrl: './timepicker-seconds.html',
  directives: [NGB_TIMEPICKER_DIRECTIVES]
})
export class NgbdTimepickerSeconds {
  time = {hour: 13, minute: 30, second: 30};
  seconds = true;

  toggleSeconds() {
      this.seconds = !this.seconds;
  }
}
