import { Component } from '@angular/core';
import { NgbDropdown, NgbDropdownToggle, NgbDropdownMenu, NgbDropdownItem } from '@ng-bootstrap/ng-bootstrap/dropdown';

@Component({
	selector: 'ngbd-dropdown-navbar',
	imports: [NgbDropdown, NgbDropdownToggle, NgbDropdownMenu, NgbDropdownItem],
	templateUrl: './dropdown-navbar.html',
})
export class NgbdDropdownNavbar {
	collapsed = true;
}
