import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgbDatepicker} from './datepicker';
import {NgbDatepickerMonthView} from './datepicker-month-view';
import {NgbDatepickerNavigation} from './datepicker-navigation';
import {NgbInputDatepicker} from './datepicker-input';
import {NgbDatepickerDayView} from './datepicker-day-view';
import {NgbDatepickerI18n, NgbDatepickerI18nDefault} from './datepicker-i18n';
import {NgbCalendar, NgbCalendarGregorian} from './ngb-calendar';
import {NgbDateParserFormatter, NgbDateISOParserFormatter} from './ngb-date-parser-formatter';
import {NgbDateAdapter, NgbDateStructAdapter} from './adapters/ngb-date-adapter';
import {NgbDatepickerNavigationSelect} from './datepicker-navigation-select';

export {NgbDatepicker, NgbDatepickerNavigateEvent} from './datepicker';
export {NgbInputDatepicker} from './datepicker-input';
export {NgbCalendar, NgbPeriod} from './ngb-calendar';
export {NgbCalendarIslamicCivil} from './hijri/ngb-calendar-islamic-civil';
export {NgbCalendarIslamicUmalqura} from './hijri/ngb-calendar-islamic-umalqura';
export {NgbDatepickerMonthView} from './datepicker-month-view';
export {NgbDatepickerDayView} from './datepicker-day-view';
export {NgbDatepickerNavigation} from './datepicker-navigation';
export {NgbDatepickerNavigationSelect} from './datepicker-navigation-select';
export {NgbDatepickerConfig} from './datepicker-config';
export {NgbDatepickerI18n} from './datepicker-i18n';
export {NgbDateStruct} from './ngb-date-struct';
export {NgbDate} from './ngb-date';
export {NgbDateAdapter} from './adapters/ngb-date-adapter';
export {NgbDateNativeAdapter} from './adapters/ngb-date-native-adapter';
export {NgbDateParserFormatter} from './ngb-date-parser-formatter';
export {NgbCalendarPersian} from './jalali/ngb-calendar-persian';

@NgModule({
  declarations: [
    NgbDatepicker, NgbDatepickerMonthView, NgbDatepickerNavigation, NgbDatepickerNavigationSelect, NgbDatepickerDayView,
    NgbInputDatepicker
  ],
  exports: [NgbDatepicker, NgbInputDatepicker],
  imports: [CommonModule, FormsModule],
  providers: [
    {provide: NgbCalendar, useClass: NgbCalendarGregorian},
    {provide: NgbDatepickerI18n, useClass: NgbDatepickerI18nDefault},
    {provide: NgbDateParserFormatter, useClass: NgbDateISOParserFormatter},
    {provide: NgbDateAdapter, useClass: NgbDateStructAdapter}, DatePipe
  ],
  entryComponents: [NgbDatepicker]
})
export class NgbDatepickerModule {
  /**
   * Importing with '.forRoot()' is no longer necessary, you can simply import the module.
   * Will be removed in 4.0.0.
   *
   * @deprecated 3.0.0
   */
  static forRoot(): ModuleWithProviders { return {ngModule: NgbDatepickerModule}; }
}
