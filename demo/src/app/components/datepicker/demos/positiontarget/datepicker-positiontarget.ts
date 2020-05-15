import {Component} from '@angular/core';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-datepicker-positiontarget',
  templateUrl: './datepicker-positiontarget.html',
  styles: [`.input-group > .form-control {
    flex-basis: auto;
  }`],
})
export class NgbdDatepickerPositiontarget {
  model: NgbDateStruct;
  placement = 'bottom';
}
