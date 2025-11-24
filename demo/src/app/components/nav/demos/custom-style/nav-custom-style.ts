import { Component } from '@angular/core';
import {
	NgbDropdown,
	NgbDropdownToggle,
	NgbDropdownMenu,
	NgbDropdownItem,
	NgbDropdownButtonItem,
} from '@ng-bootstrap/ng-bootstrap/dropdown';
import {
	NgbNavContent,
	NgbNav,
	NgbNavItem,
	NgbNavItemRole,
	NgbNavLinkButton,
	NgbNavLinkBase,
	NgbNavOutlet,
} from '@ng-bootstrap/ng-bootstrap/nav';

@Component({
	selector: 'ngbd-nav-custom-style',
	imports: [
		NgbNavContent,
		NgbNav,
		NgbNavItem,
		NgbNavItemRole,
		NgbNavLinkButton,
		NgbNavLinkBase,
		NgbNavOutlet,
		NgbDropdown,
		NgbDropdownToggle,
		NgbDropdownMenu,
		NgbDropdownItem,
		NgbDropdownButtonItem,
	],
	templateUrl: './nav-custom-style.html',
})
export class NgbdNavCustomStyle {}
