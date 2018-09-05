import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NgbTabset, NgbTab, NgbTabTitle} from './tabset';
import {
  NgbTabContent,
  NgbTabsetDirective,
  NgbTabDirective,
  NgbTabLinkDirective,
  NgbTabsetOutlet,
  NgbSelfControlledTabset
} from './tabset-directives';

export {NgbTabset, NgbTab, NgbTabTitle} from './tabset';
export {
  NgbTabContent,
  NgbTabsetDirective,
  NgbTabDirective,
  NgbTabLinkDirective,
  NgbTabsetOutlet,
  NgbTabChangeEvent,
  NgbSelfControlledTabset
} from './tabset-directives';
export {NgbTabsetConfig} from './tabset-config';

const NGB_TABSET_DIRECTIVES = [
  NgbTabset, NgbTab, NgbTabContent, NgbTabsetDirective, NgbTabDirective, NgbTabLinkDirective, NgbTabTitle,
  NgbTabsetOutlet, NgbSelfControlledTabset
];

@NgModule({declarations: NGB_TABSET_DIRECTIVES, exports: NGB_TABSET_DIRECTIVES, imports: [CommonModule]})
export class NgbTabsetModule {
}
