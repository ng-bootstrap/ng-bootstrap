import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NgbHighlight} from './highlight';
import {NgbTypeaheadWindow} from './typeahead-window';
import {NgbTypeahead} from './typeahead';

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
  /**
   * Importing with '.forRoot()' is no longer necessary, you can simply import the module.
   * Will be removed in 4.0.0.
   *
   * @deprecated 3.0.0
   */
  static forRoot(): ModuleWithProviders { return {ngModule: NgbTypeaheadModule}; }
}
