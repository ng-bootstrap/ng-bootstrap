import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NGB_ALERT_DIRECTIVES, NgbAlert} from './alert';
import {NgbAlertConfig} from './alert-config';

export {NgbAlertConfig} from './alert-config';

@NgModule({
  declarations: NGB_ALERT_DIRECTIVES,
  exports: NGB_ALERT_DIRECTIVES,
  imports: [CommonModule],
  entryComponents: [NgbAlert]
})
export class NgbAlertModule {
  static forRoot(): ModuleWithProviders { return {ngModule: NgbAlertModule, providers: [NgbAlertConfig]}; }
}
