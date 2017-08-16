import {Component} from '@angular/core';
import {NgbDropdownConfig} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-dropdown-config',
  templateUrl: './dropdown-config.html',
  providers: [NgbDropdownConfig] // add NgbDropdownConfig to the component providers
})
export class NgbdDropdownConfig {
  constructor(config: NgbDropdownConfig) {
    // customize default values of dropdowns used by this component tree
    config.placement = 'top-left';
    config.autoClose = false;
  }
}
