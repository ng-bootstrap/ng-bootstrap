import {NgModule, ModuleWithProviders} from '@angular/core';
import {NGB_RADIO_DIRECTIVES} from './radio';

@NgModule({declarations: NGB_RADIO_DIRECTIVES, exports: NGB_RADIO_DIRECTIVES})
export class NgbButtonsModule {
  static forRoot(): ModuleWithProviders { return {ngModule: NgbButtonsModule, providers: []}; }
}
