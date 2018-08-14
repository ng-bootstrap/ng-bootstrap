import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NgbPagination} from './pagination';

export {NgbPagination} from './pagination';
export {NgbPaginationConfig} from './pagination-config';

@NgModule({declarations: [NgbPagination], exports: [NgbPagination], imports: [CommonModule]})
export class NgbPaginationModule {
  /**
   * Importing with '.forRoot()' is no longer necessary, you can simply import the module.
   * Will be removed in 4.0.0.
   *
   * @deprecated 3.0.0
   */
  static forRoot(): ModuleWithProviders { return {ngModule: NgbPaginationModule}; }
}
