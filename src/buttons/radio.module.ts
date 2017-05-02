import {NgModule, ModuleWithProviders} from '@angular/core';
import {NgbRadio, NgbRadioGroup} from './radio';
import {NgbCheckbox} from './checkbox';
import {NgbActiveLabel} from './label';

export {NgbRadio, NgbRadioGroup} from './radio';
export {NgbCheckbox} from './checkbox';
export {NgbActiveLabel} from './label';

const NGB_RADIO_DIRECTIVES = [NgbRadio, NgbActiveLabel, NgbRadioGroup, NgbCheckbox];

@NgModule({declarations: NGB_RADIO_DIRECTIVES, exports: NGB_RADIO_DIRECTIVES})
export class NgbButtonsModule {
  static forRoot(): ModuleWithProviders { return {ngModule: NgbButtonsModule, providers: []}; }
}
