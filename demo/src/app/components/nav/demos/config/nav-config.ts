import { Component } from '@angular/core';
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
	constructor(config: NgbNavConfig) {
		// customize default values of navs used by this component tree
		config.destroyOnHide = false;
		config.roles = false;
	}
}
