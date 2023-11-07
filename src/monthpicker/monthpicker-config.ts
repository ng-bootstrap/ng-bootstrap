import { Injectable, TemplateRef } from '@angular/core';
import { TranslationWidth } from '@angular/common';
import { MonthTemplateContext } from './monthpicker-month-template-context';
import { NgbMonthStruct } from './ngb-month-struct';

/**
 * A configuration service for the [`NgbMonthpicker`](#/components/monthpicker/api#NgbMonthpicker) component.
 *
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the monthpickers used in the application.
 */
@Injectable({ providedIn: 'root' })
export class NgbMonthpickerConfig {
	monthTemplate: TemplateRef<MonthTemplateContext>;
	monthTemplateData: (date: NgbMonthStruct, current?: { year: number; month: number }) => any;
	footerTemplate: TemplateRef<any>;
	displayYears = 1;
	markDisabled: (date: NgbMonthStruct, current?: { year: number; month: number }) => boolean;
	minDate: NgbMonthStruct;
	maxDate: NgbMonthStruct;
	navigation: 'select' | 'arrows' | 'none' = 'select';
	startDate: { year: number; month: number };
}
