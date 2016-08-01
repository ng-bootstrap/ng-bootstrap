import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NGB_ALERT_DIRECTIVES, NgbAlert} from './alert';

@NgModule({
  declarations: NGB_ALERT_DIRECTIVES,
  exports: NGB_ALERT_DIRECTIVES,
  imports: [CommonModule],
  entryComponents: [NgbAlert]
})
export class NgbAlertModule {
}
