import { Component, inject } from '@angular/core';
import {
	NgbDropdownConfig,
	NgbDropdown,
	NgbDropdownToggle,
	NgbDropdownMenu,
	NgbDropdownItem,
	NgbDropdownButtonItem,
} from '@ng-bootstrap/ng-bootstrap/dropdown';

@Component({
	selector: 'ngbd-dropdown-config',
	imports: [NgbDropdown, NgbDropdownToggle, NgbDropdownMenu, NgbDropdownItem, NgbDropdownButtonItem],
	templateUrl: './dropdown-config.html',
	providers: [NgbDropdownConfig],
})
export class NgbdDropdownConfig {
	constructor() {
		// customize default values of dropdowns used by this component tree
		const config = inject(NgbDropdownConfig);
		config.placement = 'top-start';
		config.autoClose = false;
	}
}
