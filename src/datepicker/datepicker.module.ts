import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbDatepicker} from './datepicker';
import {NgbDatepickerMonthView} from './datepicker-month-view';
import {NgbDatepickerNavigation} from './datepicker-navigation';
import {FormsModule} from '@angular/forms';
import {NgbDatepickerDayView} from './datepicker-day-view';
import {NgbDatepickerI18n, NgbDatepickerI18nDefault} from './datepicker-i18n';
import {NgbCalendar, NgbCalendarGregorian} from './ngb-calendar';
import {NgbDatepickerService} from './datepicker-service';
import {NgbDatepickerNavigationSelect} from './datepicker-navigation-select';
import {NgbDatepickerConfig} from './datepicker-config';

export {NgbDatepickerConfig} from './datepicker-config';
export {NgbDatepickerI18n} from './datepicker-i18n';

@NgModule({
  declarations: [
    NgbDatepicker, NgbDatepickerMonthView, NgbDatepickerNavigation, NgbDatepickerNavigationSelect, NgbDatepickerDayView
  ],
  exports: [NgbDatepicker],
  imports: [CommonModule, FormsModule],
  providers: [
    {provide: NgbCalendar, useClass: NgbCalendarGregorian},
    {provide: NgbDatepickerI18n, useClass: NgbDatepickerI18nDefault}, NgbDatepickerService, NgbDatepickerConfig
  ]
})
export class NgbDatepickerModule {
}
