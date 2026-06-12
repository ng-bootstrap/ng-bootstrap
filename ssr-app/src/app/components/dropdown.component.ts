import { Component } from '@angular/core';
import {
	NgbDropdown,
	NgbDropdownItem,
	NgbDropdownButtonItem,
	NgbDropdownMenu,
	NgbDropdownToggle,
} from '@ng-bootstrap/ng-bootstrap/dropdown';

@Component({
	selector: 'dropdown-component',
	imports: [NgbDropdown, NgbDropdownItem, NgbDropdownButtonItem, NgbDropdownMenu, NgbDropdownToggle],
	template: `
		<div ngbDropdown class="d-inline-block">
			<button class="btn btn-outline-primary" id="dropdown1" ngbDropdownToggle>Toggle dropdown</button>
			<div ngbDropdownMenu aria-labelledby="dropdown1">
				<button ngbDropdownItem>Action one</button>
				<button ngbDropdownItem>Action two</button>
			</div>
		</div>
	`,
})
export class DropdownComponent {}
