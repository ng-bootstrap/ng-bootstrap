import {Component} from '@angular/core';
import {NGB_RADIO_DIRECTIVES} from '@ng-bootstrap/buttons';

@Component({
  selector: 'ngbd-buttons-radio',
  template: require('./radio.html'),
  directives: [NGB_RADIO_DIRECTIVES]
})
export class NgbdButtonsRadio {
  model = 1;
}
