import { EventEmitter, TemplateRef, OnInit } from '@angular/core';
import { toString } from '../util/util';
/**
 * Context for the typeahead result template in case you want to override the default one
 */
export interface ResultTemplateContext {
    /**
     * Your typeahead result data model
     */
    result: any;
    /**
     * Search term from the input used to get current result
     */
    term: string;
}
export declare class NgbTypeaheadWindow implements OnInit {
    activeIdx: number;
    /**
     * Flag indicating if the first row should be active initially
     */
    focusFirst: boolean;
    /**
     * Typeahead match results to be displayed
     */
    results: any;
    /**
     * Search term used to get current results
     */
    term: string;
    /**
     * A function used to format a given result before display. This function should return a formatted string without any
     * HTML markup
     */
    formatter: typeof toString;
    /**
     * A template to override a matching result default display
     */
    resultTemplate: TemplateRef<ResultTemplateContext>;
    /**
     * Event raised when user selects a particular result row
     */
    selectEvent: EventEmitter<{}>;
    getActive(): any;
    markActive(activeIdx: number): void;
    next(): void;
    prev(): void;
    select(item: any): void;
    ngOnInit(): void;
}
