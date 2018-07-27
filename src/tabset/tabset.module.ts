import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NgbTabset, NgbTab, NgbTabContent, NgbTabTitle} from './tabset';

export {NgbTabset, NgbTab, NgbTabContent, NgbTabTitle, NgbTabChangeEvent} from './tabset';
export {NgbTabsetConfig} from './tabset-config';

const NGB_TABSET_DIRECTIVES = [NgbTabset, NgbTab, NgbTabContent, NgbTabTitle];

@NgModule({declarations: NGB_TABSET_DIRECTIVES, exports: NGB_TABSET_DIRECTIVES, imports: [CommonModule]})
export class NgbTabsetModule {
  /**
   * Importing with '.forRoot()' is no longer necessary, you can simply import the module.
   * Will be removed in 4.0.0.
   *
   * @deprecated 3.0.0
   */
  static forRoot(): ModuleWithProviders { return {ngModule: NgbTabsetModule}; }
}
