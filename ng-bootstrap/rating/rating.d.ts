import { EventEmitter, OnInit, TemplateRef, OnChanges, SimpleChanges } from '@angular/core';
import { NgbRatingConfig } from './rating-config';
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
export declare class NgbRating implements OnInit, OnChanges {
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
    constructor(config: NgbRatingConfig);
    enter(value: number): void;
    getFillValue(index: number): number;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnInit(): void;
    reset(): void;
    update(value: number): void;
    private _buildTemplateObjects();
}
