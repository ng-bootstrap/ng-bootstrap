import { Component } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-dropdown-basic',
	standalone: true,
	imports: [NgbDropdownModule],
	templateUrl: './dropdown-basic.html',
})
export class NgbdDropdownBasic {}
