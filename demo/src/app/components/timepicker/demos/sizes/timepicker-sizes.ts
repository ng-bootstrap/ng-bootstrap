import {Component} from '@angular/core';

@Component({
  selector: 'ngbd-timepicker-sizes',
  templateUrl: './timepicker-sizes.html'
})
export class NgbdTimepickerSizes {
  time = {hour: 13, minute: 30};
  size: 'small' | 'medium' | 'large' = 'medium';
}
