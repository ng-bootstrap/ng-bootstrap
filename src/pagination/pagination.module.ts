import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NGB_PAGINATION_DIRECTIVES} from './pagination';
import {NgbPaginationConfig} from './pagination-config';

export {NgbPaginationConfig} from './pagination-config';

@NgModule({
  declarations: NGB_PAGINATION_DIRECTIVES,
  exports: NGB_PAGINATION_DIRECTIVES,
  imports: [CommonModule],
  providers: [NgbPaginationConfig]
})
export class NgbPaginationModule {
}
