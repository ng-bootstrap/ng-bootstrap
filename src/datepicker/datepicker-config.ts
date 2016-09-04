import {Injectable, TemplateRef} from '@angular/core';
import {DayTemplateContext} from './datepicker-day-template-context';

/**
 * Configuration service for the NgbDatepicker component.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the datepickers used in the application.
 */
@Injectable()
export class NgbDatepickerConfig {
  dayTemplate: TemplateRef<DayTemplateContext>;
  firstDayOfWeek = 1;
  markDisabled: (date: {year: number, month: number, day: number}) => boolean;
  minDate: {year: number, month: number, day: number};
  maxDate: {year: number, month: number, day: number};
  showNavigation = true;
  showWeekdays = true;
  showWeekNumbers = false;
  startDate: {year: number, month: number};
}
