import { Component } from '@angular/core';
import {
	NgbDropdown,
	NgbDropdownToggle,
	NgbDropdownMenu,
	NgbDropdownItem,
	NgbDropdownButtonItem,
} from '@ng-bootstrap/ng-bootstrap/dropdown';
import {
	NgbScrollSpy,
	NgbScrollSpyItem,
	NgbScrollSpyFragment,
	NgbScrollSpyMenu,
} from '@ng-bootstrap/ng-bootstrap/scrollspy';

@Component({
	selector: 'ngbd-scrollspy-navbar',
	imports: [
		NgbScrollSpy,
		NgbScrollSpyItem,
		NgbScrollSpyFragment,
		NgbScrollSpyMenu,
		NgbDropdown,
		NgbDropdownToggle,
		NgbDropdownMenu,
		NgbDropdownItem,
		NgbDropdownButtonItem,
	],
	templateUrl: './scrollspy-navbar.html',
})
export class NgbdScrollSpyNavbar {}
