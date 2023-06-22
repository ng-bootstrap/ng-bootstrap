import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	standalone: true,
	imports: [FormsModule, NgIf, NgbModule],
	templateUrl: './dropdown-position.component.html',
})
export class DropdownPositionComponent {
	isInDom = true;
	placement = 'top-start';
	container: null | 'body' = null;

	togglePlacement(placement) {
		this.placement = placement;
	}

	toggleContainer(container) {
		this.container = container;
	}
}
