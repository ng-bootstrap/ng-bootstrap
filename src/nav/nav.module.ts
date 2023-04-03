import { NgModule } from '@angular/core';

import { NgbNav, NgbNavContent, NgbNavItem, NgbNavItemRole, NgbNavLink, NgbNavLinkButton, NgbNavLinkBase } from './nav';

import { NgbNavOutlet, NgbNavPane } from './nav-outlet';

export {
	NgbNav,
	NgbNavContent,
	NgbNavContentContext,
	NgbNavItem,
	NgbNavItemRole,
	NgbNavLink,
	NgbNavLinkButton,
	NgbNavLinkBase,
	NgbNavChangeEvent,
} from './nav';
export { NgbNavOutlet, NgbNavPane } from './nav-outlet';
export { NgbNavConfig } from './nav-config';

const NGB_NAV_DIRECTIVES = [
	NgbNavContent,
	NgbNav,
	NgbNavItem,
	NgbNavItemRole,
	NgbNavLink,
	NgbNavLinkButton,
	NgbNavLinkBase,
	NgbNavOutlet,
	NgbNavPane,
];

@NgModule({
	imports: NGB_NAV_DIRECTIVES,
	exports: NGB_NAV_DIRECTIVES,
})
export class NgbNavModule {}
