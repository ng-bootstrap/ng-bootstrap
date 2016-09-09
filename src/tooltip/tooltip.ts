import {
  Component,
  Directive,
  Input,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  Injector,
  Renderer,
  ComponentRef,
  ElementRef,
  TemplateRef,
  ViewContainerRef,
  ComponentFactoryResolver,
  NgZone
} from '@angular/core';

import {listenToTriggers} from '../util/triggers';
import {positionElements} from '../util/positioning';
import {PopupService} from '../util/popup';
import {NgbTooltipConfig} from './tooltip-config';

@Component({
  selector: 'ngb-tooltip-window',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {'[class]': '"tooltip in tooltip-" + placement', 'role': 'tooltip'},
  template: `
    <div class="tooltip-arrow"></div>
    <div class="tooltip-inner"><ng-content></ng-content></div>
    `
})
export class NgbTooltipWindow {
  @Input() placement: 'top' | 'bottom' | 'left' | 'right' = 'top';
}

/**
 * A lightweight, extensible directive for fancy tooltip creation.
 */
@Directive({selector: '[ngbTooltip]', exportAs: 'ngbTooltip'})
export class NgbTooltip implements OnInit, OnDestroy {
  /**
   * Content to be displayed as tooltip.
   */
  @Input() ngbTooltip: string | TemplateRef<any>;
  /**
   * Placement of a tooltip. Accepts: "top", "bottom", "left", "right"
   */
  @Input() placement: 'top' | 'bottom' | 'left' | 'right';
  /**
   * Specifies events that should trigger. Supports a space separated list of event names.
   */
  @Input() triggers: string;

  private _popupService: PopupService<NgbTooltipWindow>;
  private _windowRef: ComponentRef<NgbTooltipWindow>;
  private _unregisterListenersFn;
  private _zoneSubscription: any;

  constructor(
      private _elementRef: ElementRef, private _renderer: Renderer, injector: Injector,
      componentFactoryResolver: ComponentFactoryResolver, viewContainerRef: ViewContainerRef, config: NgbTooltipConfig,
      ngZone: NgZone) {
    this.placement = config.placement;
    this.triggers = config.triggers;
    this._popupService = new PopupService<NgbTooltipWindow>(
        NgbTooltipWindow, injector, viewContainerRef, _renderer, componentFactoryResolver);

    this._zoneSubscription = ngZone.onStable.subscribe(() => {
      if (this._windowRef) {
        positionElements(this._elementRef.nativeElement, this._windowRef.location.nativeElement, this.placement);
      }
    });
  }

  /**
   * Opens an element’s tooltip. This is considered a “manual” triggering of the tooltip.
   */
  open() {
    if (!this._windowRef) {
      this._windowRef = this._popupService.open(this.ngbTooltip);
      this._windowRef.instance.placement = this.placement;
    }
  }

  /**
   * Closes an element’s tooltip. This is considered a “manual” triggering of the tooltip.
   */
  close(): void {
    this._popupService.close();
    this._windowRef = null;
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

  ngOnInit() {
    this._unregisterListenersFn = listenToTriggers(
        this._renderer, this._elementRef.nativeElement, this.triggers, this.open.bind(this), this.close.bind(this),
        this.toggle.bind(this));
  }

  ngOnDestroy() {
    this._unregisterListenersFn();
    this._zoneSubscription.unsubscribe();
  }
}
