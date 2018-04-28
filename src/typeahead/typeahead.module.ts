import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NgbHighlight} from './highlight';
import {NgbTypeaheadWindow} from './typeahead-window';
import {NgbTypeahead, NgbTypeaheadSelectItemEvent} from './typeahead';
import {NgbTypeaheadConfig} from './typeahead-config';
import {Live, ARIA_LIVE_DELAY, DEFAULT_ARIA_LIVE_DELAY} from './../util/accessibility/live';

export {NgbHighlight} from './highlight';
export {NgbTypeaheadWindow} from './typeahead-window';
export {NgbTypeaheadConfig} from './typeahead-config';
export {NgbTypeahead, NgbTypeaheadSelectItemEvent} from './typeahead';

@NgModule({
  declarations: [NgbTypeahead, NgbHighlight, NgbTypeaheadWindow],
  exports: [NgbTypeahead, NgbHighlight],
  imports: [CommonModule],
  entryComponents: [NgbTypeaheadWindow]
})
export class NgbTypeaheadModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: NgbTypeaheadModule,
      providers: [Live, NgbTypeaheadConfig, {provide: ARIA_LIVE_DELAY, useValue: DEFAULT_ARIA_LIVE_DELAY}]
    };
  }
}
