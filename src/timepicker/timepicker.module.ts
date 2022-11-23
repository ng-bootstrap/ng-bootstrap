import { NgModule } from '@angular/core';

import { NgbTimepicker } from './timepicker';

export { NgbTimepicker } from './timepicker';
export { NgbTimepickerConfig } from './timepicker-config';
export { NgbTimeStruct } from './ngb-time-struct';
export { NgbTimeAdapter } from './ngb-time-adapter';
export { NgbTimepickerI18n } from './timepicker-i18n';

@NgModule({
	imports: [NgbTimepicker],
	exports: [NgbTimepicker],
})
export class NgbTimepickerModule {}
