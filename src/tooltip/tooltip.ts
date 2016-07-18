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
  ComponentFactoryResolver
} from '@angular/core';

import {parseTriggers, Trigger} from '../util/triggers';
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

  private _popupService: PopupService<NgbTooltipWindow>;
  private _positioning = new Positioning();
  private _windowRef: ComponentRef<NgbTooltipWindow>;

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

  close(): void { this._popupService.close(); }

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
}

export const NGB_TOOLTIP_DIRECTIVES = [NgbTooltip];
