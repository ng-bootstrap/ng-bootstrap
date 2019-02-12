import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';

import {
  NgbPagination,
  NgbPaginationEllipsis,
  NgbPaginationFirst,
  NgbPaginationLast,
  NgbPaginationNext,
  NgbPaginationNumber,
  NgbPaginationPrevious
} from './pagination';

export {
  NgbPagination,
  NgbPaginationEllipsis,
  NgbPaginationFirst,
  NgbPaginationLast,
  NgbPaginationNext,
  NgbPaginationNumber,
  NgbPaginationPrevious
} from './pagination';
export {NgbPaginationConfig} from './pagination-config';

const DIRECTIVES = [
  NgbPagination, NgbPaginationEllipsis, NgbPaginationFirst, NgbPaginationLast, NgbPaginationNext, NgbPaginationNumber,
  NgbPaginationPrevious
];

@NgModule({declarations: DIRECTIVES, exports: DIRECTIVES, imports: [CommonModule]})
export class NgbPaginationModule {
  /**
   * Importing with '.forRoot()' is no longer necessary, you can simply import the module.
   * Will be removed in 4.0.0.
   *
   * @deprecated 3.0.0
   */
  static forRoot(): ModuleWithProviders { return {ngModule: NgbPaginationModule}; }
}
