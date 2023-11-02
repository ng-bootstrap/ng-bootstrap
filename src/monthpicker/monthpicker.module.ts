import { NgModule } from '@angular/core';
import { NgbMonthpicker, NgbMonthpickerContent } from './monthpicker';
import { NgbMonthpickerMonth } from './monthpicker';
import { NgbInputDatepicker } from './datepicker-input';

export { NgbMonthpicker, NgbMonthpickerContent, NgbMonthpickerNavigateEvent, NgbMonthpickerState } from './monthpicker';
export { NgbInputDatepicker } from './datepicker-input';
export { NgbCalendar, NgbPeriod, NgbCalendarGregorian } from './ngb-calendar';
export { NgbMonthpickerMonth } from './monthpicker';
export { NgbMonthpickerNavigation } from './monthpicker-navigation';
export { NgbMonthpickerNavigationSelect } from './monthpicker-navigation-select';
export { NgbMonthpickerConfig } from './monthpicker-config';
export { NgbInputDatepickerConfig } from './datepicker-input-config';
export { NgbMonthpickerI18n, NgbMonthpickerI18nDefault } from './monthpicker-i18n';
export { NgbMonthStruct } from './ngb-month-struct';
export { NgbMonth } from './ngb-month';
export { NgbMonthAdapter, NgbMonthStructAdapter } from './adapters/ngb-date-adapter';
export { NgbMonthNativeAdapter } from './adapters/ngb-date-native-adapter';
export { NgbMonthNativeUTCAdapter } from './adapters/ngb-date-native-utc-adapter';
export { NgbMonthParserFormatter } from './ngb-date-parser-formatter';
export { NgbMonthpickerKeyboardService } from './monthpicker-keyboard-service';

const NGB_MONTHPICKER_DIRECTIVES = [NgbMonthpicker, NgbMonthpickerContent, NgbInputDatepicker, NgbMonthpickerMonth];

@NgModule({
	exports: NGB_MONTHPICKER_DIRECTIVES,
	imports: NGB_MONTHPICKER_DIRECTIVES,
})
export class NgbMonthpickerModule {}
