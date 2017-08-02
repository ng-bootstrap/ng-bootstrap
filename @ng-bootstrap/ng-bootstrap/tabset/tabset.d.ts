import { QueryList, TemplateRef, AfterContentChecked, EventEmitter } from '@angular/core';
import { NgbTabsetConfig } from './tabset-config';
/**
 * This directive should be used to wrap tab titles that need to contain HTML markup or other directives.
 */
export declare class NgbTabTitle {
    templateRef: TemplateRef<any>;
    constructor(templateRef: TemplateRef<any>);
}
/**
 * This directive must be used to wrap content to be displayed in a tab.
 */
export declare class NgbTabContent {
    templateRef: TemplateRef<any>;
    constructor(templateRef: TemplateRef<any>);
}
/**
 * A directive representing an individual tab.
 */
export declare class NgbTab {
    /**
     * Unique tab identifier. Must be unique for the entire document for proper accessibility support.
     */
    id: string;
    /**
     * Simple (string only) title. Use the "NgbTabTitle" directive for more complex use-cases.
     */
    title: string;
    /**
     * Allows toggling disabled state of a given state. Disabled tabs can't be selected.
     */
    disabled: boolean;
    contentTpl: NgbTabContent;
    titleTpl: NgbTabTitle;
}
/**
 * The payload of the change event fired right before the tab change
 */
export interface NgbTabChangeEvent {
    /**
     * Id of the currently active tab
     */
    activeId: string;
    /**
     * Id of the newly selected tab
     */
    nextId: string;
    /**
     * Function that will prevent tab switch if called
     */
    preventDefault: () => void;
}
/**
 * A component that makes it easy to create tabbed interface.
 */
export declare class NgbTabset implements AfterContentChecked {
    tabs: QueryList<NgbTab>;
    /**
     * An identifier of an initially selected (active) tab. Use the "select" method to switch a tab programmatically.
     */
    activeId: string;
    /**
     * Type of navigation to be used for tabs. Can be one of 'tabs' or 'pills'.
     */
    type: 'tabs' | 'pills';
    /**
     * A tab change event fired right before the tab selection happens. See NgbTabChangeEvent for payload details
     */
    tabChange: EventEmitter<NgbTabChangeEvent>;
    constructor(config: NgbTabsetConfig);
    /**
     * Selects the tab with the given id and shows its associated pane.
     * Any other tab that was previously selected becomes unselected and its associated pane is hidden.
     */
    select(tabId: string): void;
    ngAfterContentChecked(): void;
    private _getTabById(id);
}
