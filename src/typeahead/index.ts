import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NgbHighlight} from './highlight';
import {NgbTypeaheadWindow} from './typeahead-window';
import {NgbTypeahead} from './typeahead';

@NgModule({
  declarations: [NgbTypeahead, NgbHighlight, NgbTypeaheadWindow],
  exports: [NgbTypeahead],
  imports: [CommonModule],
  entryComponents: [NgbTypeaheadWindow]
})
export class NgbTypeaheadModule {
}
