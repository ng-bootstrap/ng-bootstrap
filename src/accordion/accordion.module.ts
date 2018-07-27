import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NgbAccordion, NgbPanel, NgbPanelTitle, NgbPanelContent} from './accordion';

export {NgbAccordion, NgbPanel, NgbPanelTitle, NgbPanelContent, NgbPanelChangeEvent} from './accordion';
export {NgbAccordionConfig} from './accordion-config';

const NGB_ACCORDION_DIRECTIVES = [NgbAccordion, NgbPanel, NgbPanelTitle, NgbPanelContent];

@NgModule({declarations: NGB_ACCORDION_DIRECTIVES, exports: NGB_ACCORDION_DIRECTIVES, imports: [CommonModule]})
export class NgbAccordionModule {
  /**
   * Importing with '.forRoot()' is no longer necessary, you can simply import the module.
   * Will be removed in 4.0.0.
   *
   * @deprecated 3.0.0
   */
  static forRoot(): ModuleWithProviders { return {ngModule: NgbAccordionModule}; }
}
