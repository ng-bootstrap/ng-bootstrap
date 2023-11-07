import { NgModule } from '@angular/core';
import { NgbMonthpicker, NgbMonthpickerContent } from './monthpicker';
import { NgbMonthpickerYear } from './monthpicker';
import { NgbInputMonthpicker } from './monthpicker-input';

export { NgbMonthpicker, NgbMonthpickerContent, NgbMonthpickerNavigateEvent, NgbMonthpickerState } from './monthpicker';
export { NgbInputMonthpicker } from './monthpicker-input';
export { NgbMonthCalendar, NgbMonthPeriod, NgbMonthCalendarGregorian } from './ngb-month-calendar';
export { NgbMonthpickerYear } from './monthpicker';
export { NgbMonthpickerNavigation } from './monthpicker-navigation';
export { NgbMonthpickerNavigationSelect } from './monthpicker-navigation-select';
export { NgbMonthpickerConfig } from './monthpicker-config';
export { NgbInputMonthpickerConfig } from './monthpicker-input-config';
export { NgbMonthpickerI18n, NgbMonthpickerI18nDefault } from './monthpicker-i18n';
export { NgbMonthStruct } from './ngb-month-struct';
export { NgbMonth } from './ngb-month';
export { NgbMonthAdapter, NgbMonthStructAdapter } from './adapters/ngb-month-adapter';
export { NgbMonthNativeAdapter } from './adapters/ngb-month-native-adapter';
export { NgbMonthNativeUTCAdapter } from './adapters/ngb-month-native-utc-adapter';
export { NgbMonthParserFormatter } from './ngb-month-parser-formatter';
export { NgbMonthpickerKeyboardService } from './monthpicker-keyboard-service';

const NGB_MONTHPICKER_DIRECTIVES = [NgbMonthpicker, NgbMonthpickerContent, NgbInputMonthpicker, NgbMonthpickerYear];

@NgModule({
	exports: NGB_MONTHPICKER_DIRECTIVES,
	imports: NGB_MONTHPICKER_DIRECTIVES,
})
export class NgbMonthpickerModule {}
