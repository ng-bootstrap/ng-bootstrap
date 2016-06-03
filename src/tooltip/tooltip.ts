import {
  Component,
  Directive,
  Input,
  ChangeDetectionStrategy,
  OnInit,
  AfterViewChecked,
  Injector,
  Renderer,
  ComponentRef,
  ElementRef,
  TemplateRef,
  ViewContainerRef,
  ComponentFactoryResolver,
  ComponentFactory
} from '@angular/core';

import {parseTriggers, Trigger} from '../util/triggers';
import {Positioning} from '../util/positioning';

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
export class NgbTooltip implements OnInit, AfterViewChecked {
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

  private _positioning = new Positioning();
  private _windowFactory: ComponentFactory<NgbTooltipWindow>;
  private _windowRef: ComponentRef<NgbTooltipWindow>;

  constructor(
      private _elementRef: ElementRef, private _viewContainerRef: ViewContainerRef, private _injector: Injector,
      private _renderer: Renderer, componentFactoryResolver: ComponentFactoryResolver) {
    this._windowFactory = componentFactoryResolver.resolveComponentFactory(NgbTooltipWindow);
  }

  open() {
    if (!this._windowRef) {
      const nodes = this._getContentNodes();
      this._windowRef = this._viewContainerRef.createComponent(this._windowFactory, 0, this._injector, nodes);
      this._windowRef.instance.placement = this.placement;
    }
  }

  close(): void {
    if (this._windowRef) {
      this._viewContainerRef.remove(this._viewContainerRef.indexOf(this._windowRef.hostView));
      this._windowRef = null;
    }
  }

  toggle(): void {
    if (this._windowRef) {
      this.close();
    } else {
      this.open();
    }
  }

  ngOnInit() {
    const triggers = parseTriggers(this.triggers);

    if (triggers.length === 1 && triggers[0].isManual()) {
      return;
    }

    triggers.forEach((trigger: Trigger) => {
      if (trigger.open === trigger.close) {
        this._renderer.listen(this._elementRef.nativeElement, trigger.open, () => { this.toggle(); });
      } else {
        this._renderer.listen(this._elementRef.nativeElement, trigger.open, () => { this.open(); });
        this._renderer.listen(this._elementRef.nativeElement, trigger.close, () => { this.close(); });
      }
    });
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

  private _getContentNodes() {
    if (this.ngbTooltip instanceof TemplateRef) {
      return [this._viewContainerRef.createEmbeddedView(<TemplateRef<NgbTooltipWindow>>this.ngbTooltip).rootNodes];
    } else {
      return [[this._renderer.createText(null, `${this.ngbTooltip}`)]];
    }
  }
}

export const NGB_TOOLTIP_DIRECTIVES = [NgbTooltip];
