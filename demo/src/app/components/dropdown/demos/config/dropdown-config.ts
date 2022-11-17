import { Component } from '@angular/core';
import { NgbDropdownConfig, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-dropdown-config',
	standalone: true,
	imports: [NgbDropdownModule],
	templateUrl: './dropdown-config.html',
	providers: [NgbDropdownConfig], // add NgbDropdownConfig to the component providers
})
export class NgbdDropdownConfig {
	constructor(config: NgbDropdownConfig) {
		// customize default values of dropdowns used by this component tree
		config.placement = 'top-start';
		config.autoClose = false;
	}
}
