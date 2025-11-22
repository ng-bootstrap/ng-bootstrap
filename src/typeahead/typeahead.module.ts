import { NgModule } from '@angular/core';

import { NgbHighlight } from './highlight';
import { NgbTypeahead } from './typeahead';

export { NgbHighlight } from './highlight';
export { NgbTypeaheadWindow } from './typeahead-window';
export { NgbTypeaheadConfig } from './typeahead-config';
export { NgbTypeahead, NgbTypeaheadSelectItemEvent } from './typeahead';

@NgModule({
	imports: [NgbHighlight, NgbTypeahead],
	exports: [NgbHighlight, NgbTypeahead],
})
export class NgbTypeaheadModule {}
