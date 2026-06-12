import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
	NgbDropdown,
	NgbDropdownToggle,
	NgbDropdownMenu,
	NgbDropdownItem,
	NgbDropdownButtonItem,
} from '@ng-bootstrap/ng-bootstrap/dropdown';

@Component({
	imports: [FormsModule, NgbDropdown, NgbDropdownToggle, NgbDropdownMenu, NgbDropdownItem, NgbDropdownButtonItem],
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
