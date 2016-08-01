import {Component} from '@angular/core';

@Component({
  selector: 'ngbd-timepicker-meridian',
  templateUrl: './timepicker-meridian.html'
})
export class NgbdTimepickerMeridian {
  time = {hour: 13, minute: 30};
  meridian = true;

  toggleMeridian() {
      this.meridian = !this.meridian;
  }
}
