import { Injectable, TemplateRef } from '@angular/core';
import { DayTemplateContext } from './datepicker-day-template-context';
import { NgbDateStruct } from './ngb-date-struct';
import { Subject } from 'rxjs';

/**
 * A configuration service for the [`NgbDatepicker`](#/components/datepicker/api#NgbDatepicker) component.
 *
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the datepickers used in the application.
 */
@Injectable({ providedIn: 'root' })
export class NgbDatepickerConfig {
	/**
	 * Stream to emit from when config is changed.
	 * Use this to notify components to trigger change detection
	 */
	readonly changes: Subject<void> = new Subject<void>();

	selectMonthLabel = $localize`:@@ngb.datepicker.select-month:Select month`;
	selectYearLabel = $localize`:@@ngb.datepicker.select-year:Select year`;

	previousMonthLabel = $localize`:@@ngb.datepicker.previous-month:Previous month`;
	nextMonthLabel = $localize`:@@ngb.datepicker.next-month:Next month`;

	dayTemplate: TemplateRef<DayTemplateContext>;
	dayTemplateData: (date: NgbDateStruct, current?: { year: number; month: number }) => any;
	footerTemplate: TemplateRef<any>;
	displayMonths = 1;
	firstDayOfWeek = 1;
	markDisabled: (date: NgbDateStruct, current?: { year: number; month: number }) => boolean;
	minDate: NgbDateStruct;
	maxDate: NgbDateStruct;
	navigation: 'select' | 'arrows' | 'none' = 'select';
	outsideDays: 'visible' | 'collapsed' | 'hidden' = 'visible';
	showWeekNumbers = false;
	startDate: { year: number; month: number; day?: number };
	weekdays: Exclude<Intl.DateTimeFormatOptions['weekday'], undefined> | boolean = 'narrow';
}
