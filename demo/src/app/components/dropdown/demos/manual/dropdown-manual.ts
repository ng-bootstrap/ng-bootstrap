import { Component } from '@angular/core';
import {
	NgbDropdown,
	NgbDropdownAnchor,
	NgbDropdownMenu,
	NgbDropdownItem,
	NgbDropdownButtonItem,
} from '@ng-bootstrap/ng-bootstrap/dropdown';

@Component({
	selector: 'ngbd-dropdown-manual',
	imports: [NgbDropdown, NgbDropdownAnchor, NgbDropdownMenu, NgbDropdownItem, NgbDropdownButtonItem],
	templateUrl: './dropdown-manual.html',
})
export class NgbdDropdownManual {}
