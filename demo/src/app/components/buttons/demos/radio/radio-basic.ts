import {Component} from '@angular/core';
import {NGB_RADIO_DIRECTIVES} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-radio-basic',
  templateUrl: './radio-basic.html',
  directives: [NGB_RADIO_DIRECTIVES]
})
export class NgbdRadioBasic {
  model = 1;
}
