import { Component } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap/dropdown';
import { NgbScrollSpyModule } from '@ng-bootstrap/ng-bootstrap/scrollspy';

@Component({
	selector: 'ngbd-scrollspy-navbar',
	imports: [NgbScrollSpyModule, NgbDropdownModule],
	templateUrl: './scrollspy-navbar.html',
})
export class NgbdScrollSpyNavbar {}
