import {
  Component,
  Directive,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  Inject,
  Injector,
  Renderer2,
  ComponentRef,
  ElementRef,
  TemplateRef,
  ViewContainerRef,
  ComponentFactoryResolver,
  NgZone,
  ViewEncapsulation
} from '@angular/core';
import {DOCUMENT} from '@angular/common';

import {fromEvent, race} from 'rxjs';
import {filter, takeUntil} from 'rxjs/operators';

import {listenToTriggers} from '../util/triggers';
import {positionElements, Placement, PlacementArray} from '../util/positioning';
import {PopupService} from '../util/popup';
import {Key} from '../util/key';

import {NgbTooltipConfig} from './tooltip-config';

let nextId = 0;

@Component({
  selector: 'ngb-tooltip-window',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]':
        '"tooltip show bs-tooltip-" + placement.split("-")[0]+" bs-tooltip-" + placement + (tooltipClass ? " " + tooltipClass : "")',
    'role': 'tooltip',
    '[id]': 'id'
  },
  template: `<div class="arrow"></div><div class="tooltip-inner"><ng-content></ng-content></div>`,
  styleUrls: ['./tooltip.scss']
})
export class NgbTooltipWindow {
  @Input() placement: Placement = 'top';
  @Input() id: string;
  @Input() tooltipClass: string;

  constructor(private _element: ElementRef<HTMLElement>, private _renderer: Renderer2) {}

  applyPlacement(_placement: Placement) {
    // remove the current placement classes
    this._renderer.removeClass(this._element.nativeElement, 'bs-tooltip-' + this.placement.toString().split('-')[0]);
    this._renderer.removeClass(this._element.nativeElement, 'bs-tooltip-' + this.placement.toString());

    // set the new placement classes
    this.placement = _placement;

    // apply the new placement
    this._renderer.addClass(this._element.nativeElement, 'bs-tooltip-' + this.placement.toString().split('-')[0]);
    this._renderer.addClass(this._element.nativeElement, 'bs-tooltip-' + this.placement.toString());
  }
  /**
   * Tells whether the event has been triggered from this component's subtree or not.
   *
   * @param event the event to check
   *
   * @return whether the event has been triggered from this component's subtree or not.
   */
  isEventFrom(event: Event): boolean { return this._element.nativeElement.contains(event.target as HTMLElement); }
}

/**
 * A lightweight, extensible directive for fancy tooltip creation.
 */
@Directive({selector: '[ngbTooltip]', exportAs: 'ngbTooltip'})
export class NgbTooltip implements OnInit, OnDestroy {
  /**
   * Indicates whether the tooltip should be closed on Escape key and inside/outside clicks.
   *
   * - true (default): closes on both outside and inside clicks as well as Escape presses
   * - false: disables the autoClose feature (NB: triggers still apply)
   * - 'inside': closes on inside clicks as well as Escape presses
   * - 'outside': closes on outside clicks (sometimes also achievable through triggers)
   * as well as Escape presses
   *
   * @since 3.0.0
   */
  @Input() autoClose: boolean | 'inside' | 'outside';
  /**
    * Placement of a tooltip accepts:
    *    "top", "top-left", "top-right", "bottom", "bottom-left", "bottom-right",
    *    "left", "left-top", "left-bottom", "right", "right-top", "right-bottom"
    * and array of above values.
    */
  @Input() placement: PlacementArray;
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
   * A flag indicating if a given tooltip is disabled and should not be displayed.
   *
   * @since 1.1.0
   */
  @Input() disableTooltip: boolean;
  /**
   * An optional class applied to ngb-tooltip-window
   *
   * @since 3.2.0
   */
  @Input() tooltipClass: string;
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
      private _elementRef: ElementRef<HTMLElement>, private _renderer: Renderer2, injector: Injector,
      componentFactoryResolver: ComponentFactoryResolver, viewContainerRef: ViewContainerRef, config: NgbTooltipConfig,
      private _ngZone: NgZone, @Inject(DOCUMENT) private _document: any) {
    this.autoClose = config.autoClose;
    this.placement = config.placement;
    this.triggers = config.triggers;
    this.container = config.container;
    this.disableTooltip = config.disableTooltip;
    this.tooltipClass = config.tooltipClass;
    this._popupService = new PopupService<NgbTooltipWindow>(
        NgbTooltipWindow, injector, viewContainerRef, _renderer, componentFactoryResolver);

    this._zoneSubscription = _ngZone.onStable.subscribe(() => {
      if (this._windowRef) {
        this._windowRef.instance.applyPlacement(
            positionElements(
                this._elementRef.nativeElement, this._windowRef.location.nativeElement, this.placement,
                this.container === 'body'));
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
    if (!this._windowRef && this._ngbTooltip && !this.disableTooltip) {
      this._windowRef = this._popupService.open(this._ngbTooltip, context);
      this._windowRef.instance.tooltipClass = this.tooltipClass;
      this._windowRef.instance.id = this._ngbTooltipWindowId;

      this._renderer.setAttribute(this._elementRef.nativeElement, 'aria-describedby', this._ngbTooltipWindowId);

      if (this.container === 'body') {
        this._document.querySelector(this.container).appendChild(this._windowRef.location.nativeElement);
      }

      this._windowRef.instance.placement = Array.isArray(this.placement) ? this.placement[0] : this.placement;

      // apply styling to set basic css-classes on target element, before going for positioning
      this._windowRef.changeDetectorRef.detectChanges();
      this._windowRef.changeDetectorRef.markForCheck();

      // position tooltip along the element
      this._windowRef.instance.applyPlacement(
          positionElements(
              this._elementRef.nativeElement, this._windowRef.location.nativeElement, this.placement,
              this.container === 'body'));

      if (this.autoClose) {
        this._ngZone.runOutsideAngular(() => {
          // prevents automatic closing right after an opening by putting a guard for the time of one event handling
          // pass
          // use case: click event would reach an element opening the tooltip first, then reach the autoClose handler
          // which would close it
          let justOpened = true;
          requestAnimationFrame(() => justOpened = false);

          const escapes$ = fromEvent<KeyboardEvent>(this._document, 'keyup')
                               .pipe(
                                   takeUntil(this.hidden),
                                   // tslint:disable-next-line:deprecation
                                   filter(event => event.which === Key.Escape));

          const clicks$ = fromEvent<MouseEvent>(this._document, 'click')
                              .pipe(
                                  takeUntil(this.hidden), filter(() => !justOpened),
                                  filter(event => this._shouldCloseFromClick(event)));

          race<Event>([escapes$, clicks$]).subscribe(() => this._ngZone.run(() => this.close()));
        });
      }

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
    // This check is needed as it might happen that ngOnDestroy is called before ngOnInit
    // under certain conditions, see: https://github.com/ng-bootstrap/ng-bootstrap/issues/2199
    if (this._unregisterListenersFn) {
      this._unregisterListenersFn();
    }
    this._zoneSubscription.unsubscribe();
  }

  private _shouldCloseFromClick(event: MouseEvent) {
    if (event.button !== 2) {
      if (this.autoClose === true) {
        return true;
      } else if (this.autoClose === 'inside' && this._isEventFromTooltip(event)) {
        return true;
      } else if (this.autoClose === 'outside' && !this._isEventFromTooltip(event)) {
        return true;
      }
    }
    return false;
  }

  private _isEventFromTooltip(event: MouseEvent) {
    const popup = this._windowRef.instance;
    return popup ? popup.isEventFrom(event) : false;
  }
}
