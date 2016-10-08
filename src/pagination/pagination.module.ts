import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NgbPagination} from './pagination';
import {NgbPaginationConfig} from './pagination-config';

export {NgbPagination} from './pagination';
export {NgbPaginationConfig} from './pagination-config';

@NgModule({declarations: [NgbPagination], exports: [NgbPagination], imports: [CommonModule]})
export class NgbPaginationModule {
  static forRoot(): ModuleWithProviders { return {ngModule: NgbPaginationModule, providers: [NgbPaginationConfig]}; }
}
