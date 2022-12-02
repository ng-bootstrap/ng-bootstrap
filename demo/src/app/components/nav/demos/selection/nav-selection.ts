import { Component } from '@angular/core';
import { NgbNavChangeEvent, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-nav-selection',
	standalone: true,
	imports: [NgbNavModule],
	templateUrl: './nav-selection.html',
})
export class NgbdNavSelection {
	active;
	disabled = true;

	onNavChange(changeEvent: NgbNavChangeEvent) {
		if (changeEvent.nextId === 3) {
			changeEvent.preventDefault();
		}
	}

	toggleDisabled() {
		this.disabled = !this.disabled;
		if (this.disabled) {
			this.active = 1;
		}
	}
}
