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
import {NgbPopoverConfig} from './popover-config';

@Component({
  selector: 'ngb-popover-window',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {'[class]': '"popover in popover-" + placement', 'role': 'tooltip'},
  template: `
    <div class="popover-arrow"></div>
    <h3 class="popover-title">{{title}}</h3><div class="popover-content"><ng-content></ng-content></div>
    `
})
export class NgbPopoverWindow {
  @Input() placement: 'top' | 'bottom' | 'left' | 'right' = 'top';
  @Input() title: string;
}

/**
 * A lightweight, extensible directive for fancy popover creation.
 */
@Directive({selector: '[ngbPopover]', exportAs: 'ngbPopover'})
export class NgbPopover implements OnInit, OnDestroy {
  /**
   * Content to be displayed as popover.
   */
  @Input() ngbPopover: string | TemplateRef<any>;
  /**
   * Title of a popover.
   */
  @Input() popoverTitle: string;
  /**
   * Placement of a popover. Accepts: "top", "bottom", "left", "right"
   */
  @Input() placement: 'top' | 'bottom' | 'left' | 'right';
  /**
   * Specifies events that should trigger. Supports a space separated list of event names.
   */
  @Input() triggers: string;

  private _popupService: PopupService<NgbPopoverWindow>;
  private _windowRef: ComponentRef<NgbPopoverWindow>;
  private _unregisterListenersFn;
  private _zoneSubscription: any;

  constructor(
      private _elementRef: ElementRef, private _renderer: Renderer, injector: Injector,
      componentFactoryResolver: ComponentFactoryResolver, viewContainerRef: ViewContainerRef, config: NgbPopoverConfig,
      ngZone: NgZone) {
    this.placement = config.placement;
    this.triggers = config.triggers;
    this._popupService = new PopupService<NgbPopoverWindow>(
        NgbPopoverWindow, injector, viewContainerRef, _renderer, componentFactoryResolver);

    this._zoneSubscription = ngZone.onStable.subscribe(() => {
      if (this._windowRef) {
        positionElements(this._elementRef.nativeElement, this._windowRef.location.nativeElement, this.placement);
      }
    });
  }


  /**
   * Opens an element’s popover. This is considered a “manual” triggering of the popover.
   */
  open() {
    if (!this._windowRef) {
      this._windowRef = this._popupService.open(this.ngbPopover);
      this._windowRef.instance.placement = this.placement;
      this._windowRef.instance.title = this.popoverTitle;
      // we need to manually invoke change detection since events registered via
      // Renderer::listen() are not picked up by change detection with the OnPush strategy
      this._windowRef.changeDetectorRef.markForCheck();
    }
  }

  /**
   * Closes an element’s popover. This is considered a “manual” triggering of the popover.
   */
  close(): void {
    this._popupService.close();
    this._windowRef = null;
  }

  /**
   * Toggles an element’s popover. This is considered a “manual” triggering of the popover.
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

export const NGB_POPOVER_DIRECTIVES = [NgbPopover, NgbPopoverWindow];
