import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NGB_TABSET_DIRECTIVES} from './tabset';

export {NgbTabChangeEvent} from './tabset';

@NgModule({declarations: NGB_TABSET_DIRECTIVES, exports: NGB_TABSET_DIRECTIVES, imports: [CommonModule]})
export class NgbTabsetModule {
}
