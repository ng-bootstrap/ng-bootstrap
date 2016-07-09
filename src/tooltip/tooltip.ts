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

import {ITooltipWindow, NgbAbstractTooltip} from './abstract-tooltip';

@Component({
  selector: 'ngb-tooltip-window',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {'[class]': '"tooltip in tooltip-" + placement', 'role': 'tooltip'},
  template: `
    <div class="tooltip-arrow"></div>
    <div class="tooltip-inner"><ng-content></ng-content></div>
    `
})
export class NgbTooltipWindow implements ITooltipWindow {
  @Input() placement: string = 'top';
}

/**
 * A lightweight, extensible directive for fancy tooltip creation.
 */
@Directive({selector: '[ngbTooltip]', exportAs: 'ngbTooltip'})
export class NgbTooltip extends NgbAbstractTooltip<NgbTooltipWindow> {
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

  constructor(
      elementRef: ElementRef, viewContainerRef: ViewContainerRef, injector: Injector, renderer: Renderer,
      componentFactoryResolver: ComponentFactoryResolver) {
    super(elementRef, viewContainerRef, injector, renderer, componentFactoryResolver, NgbTooltipWindow);
  }

  protected getTooltipInput(): string | TemplateRef<any> { return this.ngbTooltip; }

  protected getPlacementInput(): string { return this.placement; }

  protected getTriggersInput(): string { return this.triggers; }
}

export const NGB_TOOLTIP_DIRECTIVES = [NgbTooltip];
