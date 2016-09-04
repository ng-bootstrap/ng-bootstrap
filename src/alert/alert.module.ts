import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NGB_ALERT_DIRECTIVES, NgbAlert} from './alert';
import {NgbAlertConfig, NgbSelfClosingAlertConfig} from './alert-config';

export {NgbAlertConfig, NgbSelfClosingAlertConfig} from './alert-config';

@NgModule({
  declarations: NGB_ALERT_DIRECTIVES,
  exports: NGB_ALERT_DIRECTIVES,
  imports: [CommonModule],
  entryComponents: [NgbAlert],
  providers: [NgbAlertConfig, NgbSelfClosingAlertConfig]
})
export class NgbAlertModule {
}
