import { ElementRef, ViewContainerRef, Renderer, ComponentFactoryResolver, NgZone, TemplateRef } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { DayTemplateContext } from './datepicker-day-template-context';
import { NgbDateParserFormatter } from './ngb-date-parser-formatter';
import { NgbDateStruct } from './ngb-date-struct';
/**
 * A directive that makes it possible to have datepickers on input fields.
 * Manages integration with the input field itself (data entry) and ngModel (validation etc.).
 */
export declare class NgbInputDatepicker implements ControlValueAccessor {
    private _parserFormatter;
    private _elRef;
    private _vcRef;
    private _renderer;
    private _cfr;
    private _cRef;
    private _model;
    private _zoneSubscription;
    /**
     * Reference for the custom template for the day display
     */
    dayTemplate: TemplateRef<DayTemplateContext>;
    /**
    * First day of the week. With default calendar we use ISO 8601: 1=Mon ... 7=Sun
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
    private _onChange;
    private _onTouched;
    constructor(_parserFormatter: NgbDateParserFormatter, _elRef: ElementRef, _vcRef: ViewContainerRef, _renderer: Renderer, _cfr: ComponentFactoryResolver, ngZone: NgZone);
    registerOnChange(fn: (value: any) => any): void;
    registerOnTouched(fn: () => any): void;
    writeValue(value: any): void;
    setDisabledState(isDisabled: boolean): void;
    manualDateChange(value: string): void;
    isOpen(): boolean;
    /**
     * Opens the datepicker with the selected date indicated by the ngModel value.
     */
    open(): void;
    /**
     * Closes the datepicker popup.
     */
    close(): void;
    /**
     * Toggles the datepicker popup (opens when closed and closes when opened).
     */
    toggle(): void;
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
    private _applyDatepickerInputs(datepickerInstance);
    private _applyPopupStyling(nativeElement);
    private _writeModelValue(model);
}
