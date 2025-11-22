import { Component } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap/dropdown';

@Component({
	selector: 'ngbd-dropdown-navbar',
	imports: [NgbDropdownModule],
	templateUrl: './dropdown-navbar.html',
})
export class NgbdDropdownNavbar {
	collapsed = true;
}
