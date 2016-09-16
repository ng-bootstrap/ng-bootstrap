import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NGB_TIMEPICKER_DIRECTIVES} from './timepicker';
import {NgbTimepickerConfig} from './timepicker-config';

export {NgbTimepickerConfig} from './timepicker-config';
export {NgbTimeStruct} from './ngb-time-struct';

@NgModule({
  declarations: NGB_TIMEPICKER_DIRECTIVES,
  exports: NGB_TIMEPICKER_DIRECTIVES,
  imports: [CommonModule],
  providers: [NgbTimepickerConfig]
})
export class NgbTimepickerModule {
}
