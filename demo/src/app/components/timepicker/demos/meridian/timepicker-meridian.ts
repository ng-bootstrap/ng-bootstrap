import {Component} from '@angular/core';
import {NGB_TIMEPICKER_DIRECTIVES} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-timepicker-meridian',
  templateUrl: './timepicker-meridian.html',
  directives: [NGB_TIMEPICKER_DIRECTIVES]
})
export class NgbdTimepickerMeridian {
  time = {hour: 13, minute: 30};
  meridian = true;

  toggleMeridian() {
      this.meridian = !this.meridian;
  }
}
