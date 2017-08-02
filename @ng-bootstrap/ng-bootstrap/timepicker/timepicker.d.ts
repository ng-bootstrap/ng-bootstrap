import { OnChanges, SimpleChanges } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { NgbTime } from './ngb-time';
import { NgbTimepickerConfig } from './timepicker-config';
/**
 * A lightweight & configurable timepicker directive.
 */
export declare class NgbTimepicker implements ControlValueAccessor, OnChanges {
    disabled: boolean;
    model: NgbTime;
    /**
     * Whether to display 12H or 24H mode.
     */
    meridian: boolean;
    /**
     * Whether to display the spinners above and below the inputs.
     */
    spinners: boolean;
    /**
     * Whether to display seconds input.
     */
    seconds: boolean;
    /**
     * Number of hours to increase or decrease when using a button.
     */
    hourStep: number;
    /**
     * Number of minutes to increase or decrease when using a button.
     */
    minuteStep: number;
    /**
     * Number of seconds to increase or decrease when using a button.
     */
    secondStep: number;
    /**
     * To make timepicker readonly
     */
    readonlyInputs: boolean;
    constructor(config: NgbTimepickerConfig);
    onChange: (_: any) => void;
    onTouched: () => void;
    writeValue(value: any): void;
    registerOnChange(fn: (value: any) => any): void;
    registerOnTouched(fn: () => any): void;
    setDisabledState(isDisabled: boolean): void;
    changeHour(step: number): void;
    changeMinute(step: number): void;
    changeSecond(step: number): void;
    updateHour(newVal: string): void;
    updateMinute(newVal: string): void;
    updateSecond(newVal: string): void;
    toggleMeridian(): void;
    formatHour(value: number): string;
    formatMinSec(value: number): string;
    ngOnChanges(changes: SimpleChanges): void;
    private propagateModelChange(touched?);
}
