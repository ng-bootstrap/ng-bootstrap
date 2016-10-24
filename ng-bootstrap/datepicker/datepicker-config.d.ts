import { TemplateRef } from '@angular/core';
import { DayTemplateContext } from './datepicker-day-template-context';
import { NgbDateStruct } from './ngb-date-struct';
/**
 * Configuration service for the NgbDatepicker component.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the datepickers used in the application.
 */
export declare class NgbDatepickerConfig {
    dayTemplate: TemplateRef<DayTemplateContext>;
    firstDayOfWeek: number;
    markDisabled: (date: NgbDateStruct, current: {
        year: number;
        month: number;
    }) => boolean;
    minDate: NgbDateStruct;
    maxDate: NgbDateStruct;
    outsideDays: 'visible' | 'collapsed' | 'hidden';
    showNavigation: boolean;
    showWeekdays: boolean;
    showWeekNumbers: boolean;
    startDate: {
        year: number;
        month: number;
    };
}
