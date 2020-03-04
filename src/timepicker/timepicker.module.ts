import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NgbTimepicker, NgbTpInput, NgbTimepickerUnit} from './timepicker';

export {NgbTimepicker} from './timepicker';
export {NgbTpInput} from './timepicker';
export {NgbTimepickerUnit} from './timepicker';
export {NgbTimepickerConfig} from './timepicker-config';
export {NgbTimeStruct} from './ngb-time-struct';
export {NgbTimeAdapter} from './ngb-time-adapter';
export {NgbTimepickerI18n} from './timepicker-i18n';

@NgModule({
  declarations: [NgbTimepicker, NgbTpInput, NgbTimepickerUnit],
  exports: [NgbTimepicker],
  imports: [CommonModule],
  entryComponents: [NgbTimepicker]
})
export class NgbTimepickerModule {
}
