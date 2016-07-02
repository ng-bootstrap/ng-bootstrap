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
  selector: 'ngb-popover-window',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {'[class]': '"popover in popover-" + placement', 'role': 'tooltip'},
  template: `
    <div class="popover-arrow"></div>
    <h3 class="popover-title">{{title}}</h3><div class="popover-content"><ng-content></ng-content></div>
    `
})
export class NgbPopoverWindow {
  @Input() placement: string = 'top';
  @Input() title: string;
}

/**
 * A lightweight, extensible directive for fancy popover creation.
 */
@Directive({selector: '[ngbPopover]', exportAs: 'ngbPopover'})
export class NgbPopover implements OnInit, AfterViewChecked {
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

  private _positioning = new Positioning();
  private _windowFactory: ComponentFactory<NgbPopoverWindow>;
  private _windowRef: ComponentRef<NgbPopoverWindow>;

  constructor(
      private _elementRef: ElementRef, private _viewContainerRef: ViewContainerRef, private _injector: Injector,
      private _renderer: Renderer, componentFactoryResolver: ComponentFactoryResolver) {
    this._windowFactory = componentFactoryResolver.resolveComponentFactory(NgbPopoverWindow);
  }

  open() {
    if (!this._windowRef) {
      const nodes = this._getContentNodes();
      this._windowRef = this._viewContainerRef.createComponent(this._windowFactory, 0, this._injector, nodes);
      this._windowRef.instance.placement = this.placement;
      this._windowRef.instance.title = this.title;
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
    if (this.ngbPopover instanceof TemplateRef) {
      return [this._viewContainerRef.createEmbeddedView(<TemplateRef<NgbPopoverWindow>>this.ngbPopover).rootNodes];
    } else {
      return [[this._renderer.createText(null, `${this.ngbPopover}`)]];
    }
  }
}

export const NGB_POPOVER_DIRECTIVES = [NgbPopover];
