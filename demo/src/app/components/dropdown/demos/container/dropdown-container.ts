import { Component } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-dropdown-container',
	standalone: true,
	imports: [NgbDropdownModule],
	templateUrl: './dropdown-container.html',
})
export class NgbdDropdownContainer {}
