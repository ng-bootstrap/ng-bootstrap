import { Component } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-dropdown-disabled',
	standalone: true,
	imports: [NgbDropdownModule],
	templateUrl: './dropdown-disabled.html',
})
export class NgbdDropdownDisabled {}
