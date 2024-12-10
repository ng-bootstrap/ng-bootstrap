import { Component } from '@angular/core';
import { NgbDropdownConfig, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-dropdown-config',
	imports: [NgbDropdownModule],
	templateUrl: './dropdown-config.html',
	providers: [NgbDropdownConfig],
})
export class NgbdDropdownConfig {
	constructor(config: NgbDropdownConfig) {
		// customize default values of dropdowns used by this component tree
		config.placement = 'top-start';
		config.autoClose = false;
	}
}
