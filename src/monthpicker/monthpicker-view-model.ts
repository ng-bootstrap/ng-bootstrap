import { NgbMonth } from './ngb-month';
import { NgbMonthStruct } from './ngb-month-struct';
import { DayTemplateContext } from './monthpicker-day-template-context';
import { TranslationWidth } from '@angular/common';

export type NgbMarkDisabled = (date: NgbMonthStruct, current?: { year: number; month: number }) => boolean;
export type NgbDayTemplateData = (date: NgbMonthStruct, current?: { year: number; month: number }) => any;

export type DayViewModel = {
	date: NgbMonth;
	context: DayTemplateContext;
	tabindex: number;
	ariaLabel: string;
	hidden: boolean;
};

export type WeekViewModel = {
	number: number;
	days: DayViewModel[];
	collapsed: boolean;
};

export type MonthViewModel = {
	firstDate: NgbMonth;
	lastDate: NgbMonth;
	number: number;
	year: number;
	weeks: WeekViewModel[];
};

export type MonthpickerViewModel = {
	dayTemplateData: NgbDayTemplateData | null;
	disabled: boolean;
	displayMonths: number;
	firstDate: NgbMonth | null;
	focusDate: NgbMonth | null;
	focusVisible: boolean;
	lastDate: NgbMonth | null;
	markDisabled: NgbMarkDisabled | null;
	maxDate: NgbMonth | null;
	minDate: NgbMonth | null;
	months: MonthViewModel[];
	navigation: 'select' | 'arrows' | 'none';
	prevDisabled: boolean;
	nextDisabled: boolean;
	selectBoxes: {
		years: number[];
		months: number[];
	};
	selectedDate: NgbMonth | null;
};

export enum NavigationEvent {
	PREV,
	NEXT,
}
