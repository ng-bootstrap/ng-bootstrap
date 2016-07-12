import {
  Component,
  Directive,
  Input,
  ChangeDetectionStrategy,
  Injector,
  Renderer,
  ElementRef,
  TemplateRef,
  ViewContainerRef,
  ComponentFactoryResolver
} from '@angular/core';

import {ITooltipWindow, NgbAbstractTooltip} from '../tooltip/abstract-tooltip';

@Component({
  selector: 'ngb-popover-window',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {'[class]': '"popover in popover-" + placement', 'role': 'tooltip'},
  template: `
    <div class="popover-arrow"></div>
    <h3 class="popover-title">{{title}}</h3><div class="popover-content"><ng-content></ng-content></div>
    `
})
export class NgbPopoverWindow implements ITooltipWindow {
  @Input() placement: string = 'top';
  @Input() title: string;
}

/**
 * A lightweight, extensible directive for fancy popover creation.
 */
@Directive({selector: '[ngbPopover]', exportAs: 'ngbPopover'})
export class NgbPopover extends NgbAbstractTooltip<NgbPopoverWindow> {
  /**
   * Content to be displayed as popover.
   */
  @Input() ngbPopover: string | TemplateRef<any>;
  /**
   * Title of a popover.
   */
  @Input() title: string;
  /**
   * Placement of a popover. Accepts: "top", "bottom", "left", "right"
   */
  @Input() placement = 'top';
  /**
   * Specifies events that should trigger. Supports a space separated list of event names.
   */
  @Input() triggers = 'click';

  constructor(
      elementRef: ElementRef, viewContainerRef: ViewContainerRef, injector: Injector, renderer: Renderer,
      componentFactoryResolver: ComponentFactoryResolver) {
    super(elementRef, viewContainerRef, injector, renderer, componentFactoryResolver, NgbPopoverWindow);
  }

  protected customizeWindowRefInstance(window: NgbPopoverWindow) { window.title = this.title; }

  protected getTooltipInput(): string | TemplateRef<any> { return this.ngbPopover; }

  protected getPlacementInput(): string { return this.placement; }

  protected getTriggersInput(): string { return this.triggers; }
}

export const NGB_POPOVER_DIRECTIVES = [NgbPopover];
