import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NgbTabset, NgbTab, NgbTabContent, NgbTabTitle, NgbTabChangeEvent} from './tabset';
import {NgbTabsetConfig} from './tabset-config';

export {NgbTabset, NgbTab, NgbTabContent, NgbTabTitle, NgbTabChangeEvent} from './tabset';
export {NgbTabsetConfig} from './tabset-config';

const NGB_TABSET_DIRECTIVES = [NgbTabset, NgbTab, NgbTabContent, NgbTabTitle];

@NgModule({declarations: NGB_TABSET_DIRECTIVES, exports: NGB_TABSET_DIRECTIVES, imports: [CommonModule]})
export class NgbTabsetModule {
  static forRoot(): ModuleWithProviders { return {ngModule: NgbTabsetModule, providers: [NgbTabsetConfig]}; }
}
