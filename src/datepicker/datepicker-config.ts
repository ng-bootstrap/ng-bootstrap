import { Service, TemplateRef } from '@angular/core';
import { DayTemplateContext } from './datepicker-day-template-context';
import { NgbDateStruct } from './ngb-date-struct';

/**
 * A configuration service for the [`NgbDatepicker`](#/components/datepicker/api#NgbDatepicker) component.
 *
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the datepickers used in the application.
 */
@Service()
export class NgbDatepickerConfig {
	dayTemplate?: TemplateRef<DayTemplateContext> | null;
	dayTemplateData?: ((date: NgbDateStruct, current?: { year: number; month: number }) => any) | null;
	footerTemplate?: TemplateRef<any> | null;
	displayMonths = 1;
	firstDayOfWeek = 1;
	markDisabled?: ((date: NgbDateStruct, current?: { year: number; month: number }) => boolean) | null;
	minDate?: NgbDateStruct | null;
	maxDate?: NgbDateStruct | null;
	navigation: 'select' | 'arrows' | 'none' = 'select';
	outsideDays: 'visible' | 'collapsed' | 'hidden' = 'visible';
	showWeekNumbers = false;
	startDate?: { year: number; month: number; day?: number } | null;
	weekdays: Exclude<Intl.DateTimeFormatOptions['weekday'], undefined> | boolean = 'narrow';
}
