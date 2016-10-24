import { OnChanges, TemplateRef, OnInit } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { NgbCalendar } from './ngb-calendar';
import { NgbDate } from './ngb-date';
import { NgbDatepickerService } from './datepicker-service';
import { MonthViewModel, NavigationEvent } from './datepicker-view-model';
import { DayTemplateContext } from './datepicker-day-template-context';
import { NgbDatepickerConfig } from './datepicker-config';
import { NgbDateStruct } from './ngb-date-struct';
/**
 * A lightweight and highly configurable datepicker directive
 */
export declare class NgbDatepicker implements OnChanges, OnInit, ControlValueAccessor {
    private _service;
    private _calendar;
    _date: NgbDate;
    _maxDate: NgbDate;
    _minDate: NgbDate;
    model: NgbDate;
    month: MonthViewModel;
    /**
     * Reference for the custom template for the day display
     */
    dayTemplate: TemplateRef<DayTemplateContext>;
    /**
     * First day of the week. With default calendar we use ISO 8601: 'weekday' is 1=Mon ... 7=Sun
     */
    firstDayOfWeek: number;
    /**
     * Callback to mark a given date as disabled.
     * 'Current' contains the month that will be displayed in the view
     */
    markDisabled: (date: NgbDateStruct, current: {
        year: number;
        month: number;
    }) => boolean;
    /**
     * Min date for the navigation. If not provided will be 10 years before today or `startDate`
     */
    minDate: NgbDateStruct;
    /**
     * Max date for the navigation. If not provided will be 10 years from today or `startDate`
     */
    maxDate: NgbDateStruct;
    /**
     * The way to display days that don't belong to current month: `visible` (default),
     * `hidden` (not displayed) or `collapsed` (not displayed with empty space collapsed)
     */
    outsideDays: 'visible' | 'collapsed' | 'hidden';
    /**
     * Whether to display navigation
     */
    showNavigation: boolean;
    /**
     * Whether to display days of the week
     */
    showWeekdays: boolean;
    /**
     * Whether to display week numbers
     */
    showWeekNumbers: boolean;
    /**
     * Date to open calendar with.
     * With default calendar we use ISO 8601: 'month' is 1=Jan ... 12=Dec.
     * If nothing provided, calendar will open with current month.
     * Use 'navigateTo(date)' as an alternative
     */
    startDate: {
        year: number;
        month: number;
    };
    disabled: boolean;
    onChange: (_: any) => void;
    onTouched: () => void;
    constructor(_service: NgbDatepickerService, _calendar: NgbCalendar, config: NgbDatepickerConfig);
    /**
     * Navigates current view to provided date.
     * With default calendar we use ISO 8601: 'month' is 1=Jan ... 12=Dec.
     * If nothing provided calendar will open current month.
     * Use 'startDate' input as an alternative
     */
    navigateTo(date?: {
        year: number;
        month: number;
    }): void;
    ngOnInit(): void;
    ngOnChanges(): void;
    onDateSelect(date: NgbDate): void;
    onNavigateDateSelect(date: NgbDate): void;
    onNavigateEvent(event: NavigationEvent): void;
    registerOnChange(fn: (value: any) => any): void;
    registerOnTouched(fn: () => any): void;
    writeValue(value: any): void;
    setDisabledState(isDisabled: boolean): void;
    private _setDates();
    private _setViewWithinLimits(date);
    private _updateData();
}
