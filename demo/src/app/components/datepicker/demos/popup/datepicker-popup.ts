import {Component} from '@angular/core';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-datepicker-popup',
  templateUrl: './datepicker-popup.html',
  styles: [`.input-group > .form-control {
    flex-basis: auto;
  }`]
})
export class NgbdDatepickerPopup {
  model: NgbDateStruct;
}
