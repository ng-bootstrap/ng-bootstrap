import { Component } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'ngbd-dropdown-navbar',
    imports: [NgbDropdownModule],
    templateUrl: './dropdown-navbar.html'
})
export class NgbdDropdownNavbar {
	collapsed = true;
}
