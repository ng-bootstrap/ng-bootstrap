import {NgModule, ModuleWithProviders} from '@angular/core';
import {NgbRadio, NgbActiveLabel, NgbRadioGroup} from './radio';

export {NgbRadio, NgbActiveLabel, NgbRadioGroup} from './radio';

const NGB_RADIO_DIRECTIVES = [NgbRadio, NgbActiveLabel, NgbRadioGroup];

@NgModule({declarations: NGB_RADIO_DIRECTIVES, exports: NGB_RADIO_DIRECTIVES})
export class NgbButtonsModule {
  static forRoot(): ModuleWithProviders { return {ngModule: NgbButtonsModule, providers: []}; }
}
