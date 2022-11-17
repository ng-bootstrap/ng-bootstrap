import { Component } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-dropdown-manual',
	standalone: true,
	imports: [NgbDropdownModule],
	templateUrl: './dropdown-manual.html',
})
export class NgbdDropdownManual {}
