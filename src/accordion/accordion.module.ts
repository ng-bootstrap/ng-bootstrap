import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NGB_ACCORDION_DIRECTIVES} from './accordion';
import {NgbAccordionConfig} from './accordion-config';

export {NgbPanelChangeEvent} from './accordion';
export {NgbAccordionConfig} from './accordion-config';

@NgModule({declarations: NGB_ACCORDION_DIRECTIVES, exports: NGB_ACCORDION_DIRECTIVES, imports: [CommonModule]})
export class NgbAccordionModule {
  static forRoot(): ModuleWithProviders { return {ngModule: NgbAccordionModule, providers: [NgbAccordionConfig]}; }
}
