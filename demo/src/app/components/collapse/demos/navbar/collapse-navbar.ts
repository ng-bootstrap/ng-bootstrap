import { Component } from '@angular/core';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterLink } from '@angular/router';

@Component({
	selector: 'ngbd-collapse-navbar',
	standalone: true,
	imports: [NgbCollapseModule, RouterLink],
	templateUrl: './collapse-navbar.html',
})
export class NgbdCollapseNavbar {
	// Step 1:
	// Create a property to track whether the menu is open.
	// Start with the menu collapsed so that it does not
	// appear initially when the page loads on a small screen!
	isMenuCollapsed = true;
}
