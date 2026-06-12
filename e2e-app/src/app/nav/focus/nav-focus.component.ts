import { Component } from '@angular/core';
import {
	NgbDropdown,
	NgbDropdownItem,
	NgbDropdownButtonItem,
	NgbDropdownMenu,
	NgbDropdownModule,
	NgbDropdownToggle,
} from '@ng-bootstrap/ng-bootstrap/dropdown';
import {
	NgbNav,
	NgbNavContent,
	NgbNavItem,
	NgbNavItemRole,
	NgbNavLinkButton,
	NgbNavLinkBase,
	NgbNavModule,
	NgbNavOutlet,
} from '@ng-bootstrap/ng-bootstrap/nav';

@Component({
	selector: 'nav-focus-component',
	imports: [
		NgbDropdown,
		NgbDropdownItem,
		NgbDropdownButtonItem,
		NgbDropdownMenu,
		NgbDropdownModule,
		NgbDropdownToggle,
		NgbNav,
		NgbNavContent,
		NgbNavItem,
		NgbNavItemRole,
		NgbNavLinkButton,
		NgbNavLinkBase,
		NgbNavModule,
		NgbNavOutlet,
	],
	templateUrl: './nav-focus.component.html',
})
export class NavFocusComponent {
	active = 2;
	keyboard: boolean | 'changeWithArrows' = true;
}
