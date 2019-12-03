import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {NgbAccordion, NgbPanel, NgbPanelTitle, NgbPanelContent, NgbPanelHeader, NgbPanelToggle} from './accordion';

export {
  NgbAccordion,
  NgbPanel,
  NgbPanelTitle,
  NgbPanelContent,
  NgbPanelChangeEvent,
  NgbPanelHeader,
  NgbPanelHeaderContext,
  NgbPanelToggle,
} from './accordion';
export {NgbAccordionConfig} from './accordion-config';

const NGB_ACCORDION_DIRECTIVES =
    [NgbAccordion, NgbPanel, NgbPanelTitle, NgbPanelContent, NgbPanelHeader, NgbPanelToggle];

@NgModule({
  declarations: NGB_ACCORDION_DIRECTIVES,
  exports: NGB_ACCORDION_DIRECTIVES,
  imports: [CommonModule, BrowserAnimationsModule]
})
export class NgbAccordionModule {
}
