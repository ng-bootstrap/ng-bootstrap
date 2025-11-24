import { Component } from '@angular/core';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap/collapse';
import { RouterLink } from '@angular/router';

@Component({
	selector: 'ngbd-collapse-navbar',
	imports: [NgbCollapse, RouterLink],
	templateUrl: './collapse-navbar.html',
})
export class NgbdCollapseNavbar {
	// Step 1:
	// Create a property to track whether the menu is open.
	// Start with the menu collapsed so that it does not
	// appear initially when the page loads on a small screen!
	isMenuCollapsed = true;
}
