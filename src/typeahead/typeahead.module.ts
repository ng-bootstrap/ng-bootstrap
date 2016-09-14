import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NgbHighlight} from './highlight';
import {NgbTypeaheadWindow} from './typeahead-window';
import {NgbTypeahead, NgbTypeaheadSelectItemEvent} from './typeahead';
import {NgbTypeaheadConfig} from './typeahead-config';

export {NgbTypeaheadConfig} from './typeahead-config';
export {NgbTypeaheadSelectItemEvent} from './typeahead';

@NgModule({
  declarations: [NgbTypeahead, NgbHighlight, NgbTypeaheadWindow],
  exports: [NgbTypeahead],
  imports: [CommonModule],
  entryComponents: [NgbTypeaheadWindow],
  providers: [NgbTypeaheadConfig]
})
export class NgbTypeaheadModule {
}
