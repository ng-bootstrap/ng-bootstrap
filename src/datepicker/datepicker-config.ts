import {Injectable, TemplateRef} from '@angular/core';
import {DayTemplateContext} from './datepicker-day-template-context';
import {NgbDateStruct} from './ngb-date-struct';

/**
 * Configuration service for the NgbDatepicker component.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the datepickers used in the application.
 */
@Injectable()
export class NgbDatepickerConfig {
  dayTemplate: TemplateRef<DayTemplateContext>;
  firstDayOfWeek = 1;
  markDisabled: (date: NgbDateStruct, current: {year: number, month: number}) => boolean;
  minDate: NgbDateStruct;
  maxDate: NgbDateStruct;
  outsideDays: 'visible' | 'collapsed' | 'hidden' = 'visible';
  showNavigation = true;
  showWeekdays = true;
  showWeekNumbers = false;
  startDate: {year: number, month: number};
}
