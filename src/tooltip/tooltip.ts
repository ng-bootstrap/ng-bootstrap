import {
  Component,
  Directive,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  Injector,
  Renderer2,
  ComponentRef,
  ElementRef,
  TemplateRef,
  ViewContainerRef,
  ComponentFactoryResolver,
  NgZone
} from '@angular/core';
import {listenToTriggers} from '../util/triggers';
import {positionElements, Placement} from '../util/positioning';
import {PopupService} from '../util/popup';
import {NgbTooltipConfig} from './tooltip-config';

let nextId = 0;

@Component({
  selector: 'ngb-tooltip-window',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': '"tooltip show bs-tooltip-" + placement.split("-")[0]+" bs-tooltip-" + placement',
    'role': 'tooltip',
    '[id]': 'id'
  },
  template: `<div class="arrow"></div><div class="tooltip-inner"><ng-content></ng-content></div>`,
  styles: [`
    :host.bs-tooltip-top .arrow, :host.bs-tooltip-bottom .arrow {
      left: 50%;
    }

    :host.bs-tooltip-top-left .arrow, :host.bs-tooltip-bottom-left .arrow {
      left: 1em;
    }

    :host.bs-tooltip-top-right .arrow, :host.bs-tooltip-bottom-right .arrow {
      left: auto;
      right: 1em;
    }

    :host.bs-tooltip-left .arrow, :host.bs-tooltip-right .arrow {
      top: 50%;
    }
    
    :host.bs-tooltip-left-top .arrow, :host.bs-tooltip-right-top .arrow {
      top: 0.7em;
    }

    :host.bs-tooltip-left-bottom .arrow, :host.bs-tooltip-right-bottom .arrow {
      top: auto;
      bottom: 0.7em;
    }
  `]
})
export class NgbTooltipWindow {
  @Input() placement: Placement = 'top';
  @Input() id: string;
}

/**
 * A lightweight, extensible directive for fancy tooltip creation.
 */
@Directive({selector: '[ngbTooltip]', exportAs: 'ngbTooltip'})
export class NgbTooltip implements OnInit, OnDestroy {
  /**
   * Placement of a tooltip accepts:
   *    "top", "top-left", "top-right", "bottom", "bottom-left", "bottom-right",
   *    "left", "left-top", "left-bottom", "right", "right-top", "right-bottom"
   */
  @Input() placement: Placement;
  /**
   * Specifies events that should trigger. Supports a space separated list of event names.
   */
  @Input() triggers: string;
  /**
   * A selector specifying the element the tooltip should be appended to.
   * Currently only supports "body".
   */
  @Input() container: string;
  /**
   * Emits an event when the tooltip is shown
   */
  @Output() shown = new EventEmitter();
  /**
   * Emits an event when the tooltip is hidden
   */
  @Output() hidden = new EventEmitter();

  private _ngbTooltip: string | TemplateRef<any>;
  private _ngbTooltipWindowId = `ngb-tooltip-${nextId++}`;
  private _popupService: PopupService<NgbTooltipWindow>;
  private _windowRef: ComponentRef<NgbTooltipWindow>;
  private _unregisterListenersFn;
  private _zoneSubscription: any;

  constructor(
      private _elementRef: ElementRef, private _renderer: Renderer2, injector: Injector,
      componentFactoryResolver: ComponentFactoryResolver, viewContainerRef: ViewContainerRef, config: NgbTooltipConfig,
      ngZone: NgZone) {
    this.placement = config.placement;
    this.triggers = config.triggers;
    this.container = config.container;
    this._popupService = new PopupService<NgbTooltipWindow>(
        NgbTooltipWindow, injector, viewContainerRef, _renderer, componentFactoryResolver);

    this._zoneSubscription = ngZone.onStable.subscribe(() => {
      if (this._windowRef) {
        positionElements(
            this._elementRef.nativeElement, this._windowRef.location.nativeElement, this.placement.toString(),
            this.container === 'body');
      }
    });
  }

  /**
   * Content to be displayed as tooltip. If falsy, the tooltip won't open.
   */
  @Input()
  set ngbTooltip(value: string | TemplateRef<any>) {
    this._ngbTooltip = value;
    if (!value && this._windowRef) {
      this.close();
    }
  }

  get ngbTooltip() { return this._ngbTooltip; }

  /**
   * Opens an element’s tooltip. This is considered a “manual” triggering of the tooltip.
   * The context is an optional value to be injected into the tooltip template when it is created.
   */
  open(context?: any) {
    if (!this._windowRef && this._ngbTooltip) {
      this._windowRef = this._popupService.open(this._ngbTooltip, context);
      this._windowRef.instance.placement = this.placement;
      this._windowRef.instance.id = this._ngbTooltipWindowId;

      this._renderer.setAttribute(this._elementRef.nativeElement, 'aria-describedby', this._ngbTooltipWindowId);

      if (this.container === 'body') {
        window.document.querySelector(this.container).appendChild(this._windowRef.location.nativeElement);
      }

      // position tooltip along the element
      positionElements(
          this._elementRef.nativeElement, this._windowRef.location.nativeElement, this.placement.toString(),
          this.container === 'body');

      // we need to manually invoke change detection since events registered via
      // Renderer::listen() - to be determined if this is a bug in the Angular itself
      this._windowRef.changeDetectorRef.markForCheck();
      this.shown.emit();
    }
  }

  /**
   * Closes an element’s tooltip. This is considered a “manual” triggering of the tooltip.
   */
  close(): void {
    if (this._windowRef != null) {
      this._renderer.removeAttribute(this._elementRef.nativeElement, 'aria-describedby');
      this._popupService.close();
      this._windowRef = null;
      this.hidden.emit();
    }
  }

  /**
   * Toggles an element’s tooltip. This is considered a “manual” triggering of the tooltip.
   */
  toggle(): void {
    if (this._windowRef) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Returns whether or not the tooltip is currently being shown
   */
  isOpen(): boolean { return this._windowRef != null; }

  ngOnInit() {
    this._unregisterListenersFn = listenToTriggers(
        this._renderer, this._elementRef.nativeElement, this.triggers, this.open.bind(this), this.close.bind(this),
        this.toggle.bind(this));
  }

  ngOnDestroy() {
    this.close();
    this._unregisterListenersFn();
    this._zoneSubscription.unsubscribe();
  }
}
