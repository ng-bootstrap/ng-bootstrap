import { Component, signal } from '@angular/core';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap/alert';
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
	selector: 'ngbd-nav-keep',
	imports: [
		NgbNavContent,
		NgbNav,
		NgbNavItem,
		NgbNavItemRole,
		NgbNavLinkButton,
		NgbNavLinkBase,
		NgbNavOutlet,
		NgbAlert,
	],
	templateUrl: './nav-keep-content.html',
})
export class NgbdNavKeep {
	readonly active = signal(1);
}
