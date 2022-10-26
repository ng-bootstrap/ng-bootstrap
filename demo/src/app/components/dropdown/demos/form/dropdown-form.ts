import { Component } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-dropdown-form',
	standalone: true,
	imports: [NgbDropdownModule],
	templateUrl: './dropdown-form.html',
})
export class NgbdDropdownForm {}
