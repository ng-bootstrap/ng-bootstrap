import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NgbNav, NgbNavContent, NgbNavItem, NgbNavLink, NgbNavButton} from './nav';
import {NgbNavOutlet, NgbNavPane} from './nav-outlet';

export {NgbNav, NgbNavContent, NgbNavContentContext, NgbNavItem, NgbNavLink, NgbNavButton, NgbNavChangeEvent} from './nav';
export {NgbNavOutlet, NgbNavPane} from './nav-outlet';
export {NgbNavConfig} from './nav-config';

const NGB_NAV_DIRECTIVES = [NgbNavContent, NgbNav, NgbNavItem, NgbNavLink, NgbNavButton, NgbNavOutlet, NgbNavPane];

@NgModule({declarations: NGB_NAV_DIRECTIVES, exports: NGB_NAV_DIRECTIVES, imports: [CommonModule]})
export class NgbNavModule {
}
