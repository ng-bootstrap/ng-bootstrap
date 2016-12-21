export * from './pagination.component';

import {NgModule} from '@angular/core';

import {NgbdSharedModule} from '../../shared';
import {NgbdComponentsSharedModule} from '../shared';
import {NgbdPagination} from './pagination.component';
import {DEMO_DIRECTIVES} from './demos';

@NgModule({
  imports: [NgbdSharedModule, NgbdComponentsSharedModule],
  exports: [NgbdPagination],
  declarations: [NgbdPagination, ...DEMO_DIRECTIVES]
})
export class NgbdPaginationModule {}
