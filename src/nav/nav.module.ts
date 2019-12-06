import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NgbNavDirective, NgbNavContent, NgbNavItemDirective, NgbNavLinkDirective} from './nav';
import {NgbNavOutlet} from './nav-outlet';
import {NgbNavConfig} from './nav-config';

export {NgbNavDirective, NgbNavContent, NgbNavItemDirective, NgbNavLinkDirective, NgbNavChangeEvent} from './nav';
export {NgbNavOutlet} from './nav-outlet';
export {NgbNavConfig} from './nav-config';

const NGB_NAV_DIRECTIVES = [NgbNavContent, NgbNavDirective, NgbNavItemDirective, NgbNavLinkDirective, NgbNavOutlet];

@NgModule({declarations: NGB_NAV_DIRECTIVES, exports: NGB_NAV_DIRECTIVES, imports: [CommonModule]})
export class NgbNavModule {
}
