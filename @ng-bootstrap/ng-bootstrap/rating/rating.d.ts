import { EventEmitter, OnInit, TemplateRef, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { NgbRatingConfig } from './rating-config';
import { ControlValueAccessor } from '@angular/forms';
/**
 * Context for the custom star display template
 */
export interface StarTemplateContext {
    /**
     * Star fill percentage. An integer value between 0 and 100
     */
    fill: number;
}
/**
 * Rating directive that will take care of visualising a star rating bar.
 */
export declare class NgbRating implements ControlValueAccessor, OnInit, OnChanges {
    private _changeDetectorRef;
    private _oldRate;
    range: number[];
    /**
     * Maximal rating that can be given using this widget.
     */
    max: number;
    /**
     * Current rating. Can be a decimal value like 3.75
     */
    rate: number;
    /**
     * A flag indicating if rating can be updated.
     */
    readonly: boolean;
    /**
     * A template to override star display.
     * Alternatively put a <template> as the only child of <ngb-rating> element
     */
    starTemplate: TemplateRef<StarTemplateContext>;
    /**
     * An event fired when a user is hovering over a given rating.
     * Event's payload equals to the rating being hovered over.
     */
    hover: EventEmitter<number>;
    /**
     * An event fired when a user stops hovering over a given rating.
     * Event's payload equals to the rating of the last item being hovered over.
     */
    leave: EventEmitter<number>;
    /**
     * An event fired when a user selects a new rating.
     * Event's payload equals to the newly selected rating.
     */
    rateChange: EventEmitter<number>;
    onChange: (_: any) => void;
    onTouched: () => void;
    constructor(config: NgbRatingConfig, _changeDetectorRef: ChangeDetectorRef);
    ariaValueText(): string;
    enter(value: number): void;
    handleKeyDown(event: KeyboardEvent): void;
    getFillValue(index: number): number;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnInit(): void;
    registerOnChange(fn: (value: any) => any): void;
    registerOnTouched(fn: () => any): void;
    reset(): void;
    update(value: number, internalChange?: boolean): void;
    writeValue(value: any): void;
}
