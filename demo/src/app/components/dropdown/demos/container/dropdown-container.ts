import { Component } from '@angular/core';
import {
	NgbDropdown,
	NgbDropdownToggle,
	NgbDropdownMenu,
	NgbDropdownItem,
	NgbDropdownButtonItem,
} from '@ng-bootstrap/ng-bootstrap/dropdown';

@Component({
	selector: 'ngbd-dropdown-container',
	imports: [NgbDropdown, NgbDropdownToggle, NgbDropdownMenu, NgbDropdownItem, NgbDropdownButtonItem],
	templateUrl: './dropdown-container.html',
})
export class NgbdDropdownContainer {}
