import {Component} from '@angular/core';
import {NGB_DROPDOWN_DIRECTIVES} from '@ng-bootstrap/dropdown';

@Component({
  selector: 'ngbd-dropdown-basic',
  template: require('./dropdown-basic.html'),
  directives: [NGB_DROPDOWN_DIRECTIVES]
})
export class NgbdDropdownBasic {
}
