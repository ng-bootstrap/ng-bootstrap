import {
  Component,
  Directive,
  Input,
  ChangeDetectionStrategy,
  OnInit,
  AfterViewChecked,
  OnDestroy,
  Injector,
  Renderer,
  ComponentRef,
  ElementRef,
  TemplateRef,
  ViewContainerRef,
  ComponentFactoryResolver
} from '@angular/core';

import {listenToTriggers} from '../util/triggers';
import {Positioning} from '../util/positioning';
import {PopupService} from '../util/popup';

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
  @Input() placement: string = 'top';
}

/**
 * A lightweight, extensible directive for fancy tooltip creation.
 */
@Directive({selector: '[ngbTooltip]', exportAs: 'ngbTooltip'})
export class NgbTooltip implements OnInit, AfterViewChecked, OnDestroy {
  /**
   * Content to be displayed as tooltip.
   */
  @Input() ngbTooltip: string | TemplateRef<any>;
  /**
   * Placement of a tooltip. Accepts: "top", "bottom", "left", "right"
   */
  @Input() placement = 'top';
  /**
   * Specifies events that should trigger. Supports a space separated list of event names.
   */
  @Input() triggers = 'hover';

  private _popupService: PopupService<NgbTooltipWindow>;
  private _positioning = new Positioning();
  private _windowRef: ComponentRef<NgbTooltipWindow>;
  private _unregisterListenersFn;

  constructor(
      private _elementRef: ElementRef, private _renderer: Renderer, injector: Injector,
      componentFactoryResolver: ComponentFactoryResolver, viewContainerRef: ViewContainerRef) {
    this._popupService = new PopupService<NgbTooltipWindow>(
        NgbTooltipWindow, injector, viewContainerRef, _renderer, componentFactoryResolver);
  }

  open() {
    if (!this._windowRef) {
      this._windowRef = this._popupService.open(this.ngbTooltip);
      this._windowRef.instance.placement = this.placement;
    }
  }

  close(): void {
    this._popupService.close();
    this._windowRef = null;
  }

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

  ngAfterViewChecked() {
    if (this._windowRef) {
      const targetPosition = this._positioning.positionElements(
          this._elementRef.nativeElement, this._windowRef.location.nativeElement, this.placement, false);

      const targetStyle = this._windowRef.location.nativeElement.style;
      targetStyle.top = `${targetPosition.top}px`;
      targetStyle.left = `${targetPosition.left}px`;
    }
  }

  ngOnDestroy() { this._unregisterListenersFn(); }
}

export const NGB_TOOLTIP_DIRECTIVES = [NgbTooltip];
