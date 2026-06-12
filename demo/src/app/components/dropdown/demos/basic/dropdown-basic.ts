import { Component, ChangeDetectionStrategy } from '@angular/core';
import {
	NgbDropdown,
	NgbDropdownToggle,
	NgbDropdownMenu,
	NgbDropdownItem,
	NgbDropdownButtonItem,
} from '@ng-bootstrap/ng-bootstrap/dropdown';

@Component({
	selector: 'ngbd-dropdown-basic',
	imports: [NgbDropdown, NgbDropdownToggle, NgbDropdownMenu, NgbDropdownItem, NgbDropdownButtonItem],
	changeDetection: ChangeDetectionStrategy.Eager,
	templateUrl: './dropdown-basic.html',
})
export class NgbdDropdownBasic {}
