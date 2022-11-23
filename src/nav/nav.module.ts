import { NgModule } from '@angular/core';

import { NgbNav, NgbNavContent, NgbNavItem, NgbNavLink } from './nav';
import { NgbNavOutlet, NgbNavPane } from './nav-outlet';

export { NgbNav, NgbNavContent, NgbNavContentContext, NgbNavItem, NgbNavLink, NgbNavChangeEvent } from './nav';
export { NgbNavOutlet, NgbNavPane } from './nav-outlet';
export { NgbNavConfig } from './nav-config';

const NGB_NAV_DIRECTIVES = [NgbNavContent, NgbNav, NgbNavItem, NgbNavLink, NgbNavOutlet, NgbNavPane];

@NgModule({
	imports: NGB_NAV_DIRECTIVES,
	exports: NGB_NAV_DIRECTIVES,
})
export class NgbNavModule {}
