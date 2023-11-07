import { NgbMonth } from './ngb-month';
import { NgbMonthStruct } from './ngb-month-struct';
import { MonthTemplateContext } from './monthpicker-month-template-context';
import { TranslationWidth } from '@angular/common';

export type NgbMarkDisabled = (date: NgbMonthStruct, current?: { year: number; month: number }) => boolean;
export type NgbMonthTemplateData = (date: NgbMonthStruct, current?: { year: number; month: number }) => any;

export type YearMonthViewModel = {
	date: NgbMonth;
	context: MonthTemplateContext;
	tabindex: number;
	ariaLabel: string;
};

export type YearViewModel = {
	firstDate: NgbMonth;
	lastDate: NgbMonth;
	year: number;
	months: YearMonthViewModel[];
};

export type MonthpickerViewModel = {
	monthTemplateData: NgbMonthTemplateData | null;
	disabled: boolean;
	firstDate: NgbMonth | null;
	focusDate: NgbMonth | null;
	focusVisible: boolean;
	lastDate: NgbMonth | null;
	markDisabled: NgbMarkDisabled | null;
	maxDate: NgbMonth | null;
	minDate: NgbMonth | null;
	years: YearViewModel[];
	navigation: 'select' | 'arrows' | 'none';
	prevDisabled: boolean;
	nextDisabled: boolean;
	selectBoxes: {
		years: number[];
	};
	selectedDate: NgbMonth | null;
};

export enum NavigationEvent {
	PREV,
	NEXT,
}
