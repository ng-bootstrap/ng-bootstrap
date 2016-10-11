import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NgbHighlight} from './highlight';
import {NgbTypeaheadWindow} from './typeahead-window';
import {NgbTypeahead, NgbTypeaheadSelectItemEvent} from './typeahead';
import {NgbTypeaheadConfig} from './typeahead-config';

export {NgbHighlight} from './highlight';
export {NgbTypeaheadWindow} from './typeahead-window';
export {NgbTypeaheadConfig} from './typeahead-config';
export {NgbTypeaheadSelectItemEvent} from './typeahead';

@NgModule({
  declarations: [NgbTypeahead, NgbHighlight, NgbTypeaheadWindow],
  exports: [NgbTypeahead],
  imports: [CommonModule],
  entryComponents: [NgbTypeaheadWindow]
})
export class NgbTypeaheadModule {
  static forRoot(): ModuleWithProviders { return {ngModule: NgbTypeaheadModule, providers: [NgbTypeaheadConfig]}; }
}
