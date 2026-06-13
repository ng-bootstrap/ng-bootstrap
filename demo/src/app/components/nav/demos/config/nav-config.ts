import { Component, inject } from '@angular/core';
import {
	NgbNavConfig,
	NgbNavContent,
	NgbNav,
	NgbNavItem,
	NgbNavItemRole,
	NgbNavLink,
	NgbNavLinkBase,
	NgbNavOutlet,
} from '@ng-bootstrap/ng-bootstrap/nav';

@Component({
	selector: 'ngbd-nav-config',
	imports: [NgbNavContent, NgbNav, NgbNavItem, NgbNavItemRole, NgbNavLink, NgbNavLinkBase, NgbNavOutlet],
	templateUrl: './nav-config.html',
	providers: [NgbNavConfig],
})
export class NgbdNavConfig {
	constructor() {
		// customize default values of navs used by this component tree
		const config = inject(NgbNavConfig);
		config.destroyOnHide = false;
		config.roles = false;
	}
}
