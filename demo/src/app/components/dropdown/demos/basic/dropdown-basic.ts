import { Component } from '@angular/core';
import {
	NgbDropdown,
	NgbDropdownToggle,
	NgbDropdownMenu,
	NgbDropdownItem,
	NgbDropdownButtonItem,
} from '@ng-bootstrap/ng-bootstrap/dropdown';

@Component({
	selector: 'ngbd-dropdown-basic',
	imports: [NgbDropdown, NgbDropdownToggle, NgbDropdownMenu, NgbDropdownItem, NgbDropdownButtonItem],
	templateUrl: './dropdown-basic.html',
})
export class NgbdDropdownBasic {}
