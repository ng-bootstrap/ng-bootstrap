import {Component} from '@angular/core';

@Component({
  selector: 'ngbd-timepicker-seconds',
  templateUrl: './timepicker-seconds.html'
})
export class NgbdTimepickerSeconds {
  time = {hour: 13, minute: 30, second: 30};
  seconds = true;

  toggleSeconds() {
      this.seconds = !this.seconds;
  }
}
