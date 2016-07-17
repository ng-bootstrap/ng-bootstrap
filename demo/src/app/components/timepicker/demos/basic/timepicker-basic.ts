import {Component} from '@angular/core';
import {NGB_TIMEPICKER_DIRECTIVES} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-timepicker-basic',
  templateUrl: './timepicker-basic.html',
  directives: [NGB_TIMEPICKER_DIRECTIVES]
})
export class NgbdTimepickerBasic {
  time = {hour: 13, minute: 30};
}
