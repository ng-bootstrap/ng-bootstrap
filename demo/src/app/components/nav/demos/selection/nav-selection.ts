import { Component, signal } from '@angular/core';
import {
	NgbNavChangeEvent,
	NgbNavContent,
	NgbNav,
	NgbNavItem,
	NgbNavItemRole,
	NgbNavLinkButton,
	NgbNavLinkBase,
	NgbNavOutlet,
} from '@ng-bootstrap/ng-bootstrap/nav';

@Component({
	selector: 'ngbd-nav-selection',
	imports: [NgbNavContent, NgbNav, NgbNavItem, NgbNavItemRole, NgbNavLinkButton, NgbNavLinkBase, NgbNavOutlet],
	templateUrl: './nav-selection.html',
})
export class NgbdNavSelection {
	readonly active = signal(1);
	readonly disabled = signal(true);

	onNavChange(changeEvent: NgbNavChangeEvent) {
		if (changeEvent.nextId === 3) {
			changeEvent.preventDefault();
		}
	}

	toggleDisabled() {
		this.disabled.update((value) => !value);
		if (this.disabled()) {
			this.active.set(1);
		}
	}
}
