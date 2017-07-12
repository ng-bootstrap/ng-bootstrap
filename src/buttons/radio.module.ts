import {NgModule, ModuleWithProviders} from '@angular/core';
import {NgbRadio, NgbButtonLabel, NgbRadioGroup} from './radio';

export {NgbRadio, NgbButtonLabel, NgbRadioGroup} from './radio';

const NGB_RADIO_DIRECTIVES = [NgbRadio, NgbButtonLabel, NgbRadioGroup];

@NgModule({declarations: NGB_RADIO_DIRECTIVES, exports: NGB_RADIO_DIRECTIVES})
export class NgbButtonsModule {
  static forRoot(): ModuleWithProviders { return {ngModule: NgbButtonsModule, providers: []}; }
}
