import {Component} from '@angular/core';

@Component({
  selector: 'ngbd-timepicker-spinners',
  templateUrl: './timepicker-spinners.html'
})
export class NgbdTimepickerSpinners {
  time = {hour: 13, minute: 30};
  spinners = true;

  toggleSpinners() {
      this.spinners = !this.spinners;
  }
}
