import { AfterContentChecked, EventEmitter, QueryList, TemplateRef } from '@angular/core';
import { NgbAccordionConfig } from './accordion-config';
/**
 * This directive should be used to wrap accordion panel titles that need to contain HTML markup or other directives.
 */
export declare class NgbPanelTitle {
    templateRef: TemplateRef<any>;
    constructor(templateRef: TemplateRef<any>);
}
/**
 * This directive must be used to wrap accordion panel content.
 */
export declare class NgbPanelContent {
    templateRef: TemplateRef<any>;
    constructor(templateRef: TemplateRef<any>);
}
/**
 * The NgbPanel directive represents an in individual panel with the title and collapsible
 * content
 */
export declare class NgbPanel {
    /**
     * Defines if the tab control is focused
     */
    focused: boolean;
    /**
     *  A flag determining whether the panel is disabled or not.
     *  When disabled, the panel cannot be toggled.
     */
    disabled: boolean;
    /**
     *  An optional id for the panel. The id should be unique.
     *  If not provided, it will be auto-generated.
     */
    id: string;
    /**
     *  The title for the panel.
     */
    title: string;
    /**
     *  Accordion's types of panels to be applied per panel basis.
     *  Bootstrap 4 recognizes the following types: "success", "info", "warning" and "danger".
     */
    type: string;
    contentTpl: NgbPanelContent;
    titleTpl: NgbPanelTitle;
}
/**
 * The payload of the change event fired right before toggling an accordion panel
 */
export interface NgbPanelChangeEvent {
    /**
     * Id of the accordion panel that is toggled
     */
    panelId: string;
    /**
     * Whether the panel will be opened (true) or closed (false)
     */
    nextState: boolean;
    /**
     * Function that will prevent panel toggling if called
     */
    preventDefault: () => void;
}
/**
 * The NgbAccordion directive is a collection of panels.
 * It can assure that only panel can be opened at a time.
 */
export declare class NgbAccordion implements AfterContentChecked {
    /**
     * A map that stores each panel state
     */
    private _states;
    /**
     * A map that stores references to all panels
     */
    private _panelRefs;
    panels: QueryList<NgbPanel>;
    /**
     * An array or comma separated strings of panel identifiers that should be opened
     */
    activeIds: string | string[];
    /**
     *  Whether the other panels should be closed when a panel is opened
     */
    closeOtherPanels: boolean;
    /**
     *  Accordion's types of panels to be applied globally.
     *  Bootstrap 4 recognizes the following types: "success", "info", "warning" and "danger".
     */
    type: string;
    /**
     * A panel change event fired right before the panel toggle happens. See NgbPanelChangeEvent for payload details
     */
    panelChange: EventEmitter<NgbPanelChangeEvent>;
    constructor(config: NgbAccordionConfig);
    /**
     * Programmatically toggle a panel with a given id.
     */
    toggle(panelId: string): void;
    ngAfterContentChecked(): void;
    private _closeOthers(panelId);
    private _updateActiveIds();
    private _updateStates();
}
