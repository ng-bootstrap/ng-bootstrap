import { EventEmitter, OnInit, OnDestroy, Injector, Renderer, ElementRef, TemplateRef, ViewContainerRef, ComponentFactoryResolver, NgZone } from '@angular/core';
import { NgbTooltipConfig } from './tooltip-config';
export declare class NgbTooltipWindow {
    placement: 'top' | 'bottom' | 'left' | 'right';
}
/**
 * A lightweight, extensible directive for fancy tooltip creation.
 */
export declare class NgbTooltip implements OnInit, OnDestroy {
    private _elementRef;
    private _renderer;
    /**
     * Placement of a tooltip. Accepts: "top", "bottom", "left", "right"
     */
    placement: 'top' | 'bottom' | 'left' | 'right';
    /**
     * Specifies events that should trigger. Supports a space separated list of event names.
     */
    triggers: string;
    /**
     * A selector specifying the element the tooltip should be appended to.
     * Currently only supports "body".
     */
    container: string;
    /**
   * Emits an event when the tooltip is shown
   */
    shown: EventEmitter<{}>;
    /**
     * Emits an event when the tooltip is hidden
     */
    hidden: EventEmitter<{}>;
    private _ngbTooltip;
    private _popupService;
    private _windowRef;
    private _unregisterListenersFn;
    private _zoneSubscription;
    constructor(_elementRef: ElementRef, _renderer: Renderer, injector: Injector, componentFactoryResolver: ComponentFactoryResolver, viewContainerRef: ViewContainerRef, config: NgbTooltipConfig, ngZone: NgZone);
    /**
     * Content to be displayed as tooltip. If falsy, the tooltip won't open.
     */
    ngbTooltip: string | TemplateRef<any>;
    /**
     * Opens an element’s tooltip. This is considered a “manual” triggering of the tooltip.
     * The context is an optional value to be injected into the tooltip template when it is created.
     */
    open(context?: any): void;
    /**
     * Closes an element’s tooltip. This is considered a “manual” triggering of the tooltip.
     */
    close(): void;
    /**
     * Toggles an element’s tooltip. This is considered a “manual” triggering of the tooltip.
     */
    toggle(): void;
    /**
     * Returns whether or not the tooltip is currently being shown
     */
    isOpen(): boolean;
    ngOnInit(): void;
    ngOnDestroy(): void;
}
