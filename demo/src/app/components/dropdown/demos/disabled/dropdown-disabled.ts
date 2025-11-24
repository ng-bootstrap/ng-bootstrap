import { Component } from '@angular/core';
import {
	NgbDropdown,
	NgbDropdownToggle,
	NgbDropdownMenu,
	NgbDropdownItem,
	NgbDropdownButtonItem,
} from '@ng-bootstrap/ng-bootstrap/dropdown';

@Component({
	selector: 'ngbd-dropdown-disabled',
	imports: [NgbDropdown, NgbDropdownToggle, NgbDropdownMenu, NgbDropdownItem, NgbDropdownButtonItem],
	templateUrl: './dropdown-disabled.html',
})
export class NgbdDropdownDisabled {}
