import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NGB_PAGINATION_DIRECTIVES} from './pagination';

@NgModule({declarations: NGB_PAGINATION_DIRECTIVES, exports: NGB_PAGINATION_DIRECTIVES, imports: [CommonModule]})
export class NgbPaginationModule {
}
