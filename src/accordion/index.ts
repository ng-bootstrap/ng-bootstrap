import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NGB_ACCORDION_DIRECTIVES} from './accordion';

export {NgbPanelChangeEvent} from './accordion';

@NgModule({declarations: NGB_ACCORDION_DIRECTIVES, exports: NGB_ACCORDION_DIRECTIVES, imports: [CommonModule]})
export class NgbAccordionModule {
}
