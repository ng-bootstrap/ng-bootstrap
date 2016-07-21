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
  ComponentFactoryResolver,
} from '@angular/core';

import {listenToTriggers} from '../util/triggers';
import {Positioning} from '../util/positioning';
import {PopupService} from '../util/popup';

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
export class NgbPopover implements OnInit, AfterViewChecked, OnDestroy {
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

  private _popupService: PopupService<NgbPopoverWindow>;
  private _positioning = new Positioning();
  private _windowRef: ComponentRef<NgbPopoverWindow>;
  private _unregisterListenersFn;

  constructor(
      private _elementRef: ElementRef, private _renderer: Renderer, injector: Injector,
      componentFactoryResolver: ComponentFactoryResolver, viewContainerRef: ViewContainerRef) {
    this._popupService = new PopupService<NgbPopoverWindow>(
        NgbPopoverWindow, injector, viewContainerRef, _renderer, componentFactoryResolver);
  }

  open() {
    if (!this._windowRef) {
      this._windowRef = this._popupService.open(this.ngbPopover);
      this._windowRef.instance.placement = this.placement;
      this._windowRef.instance.title = this.title;
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

export const NGB_POPOVER_DIRECTIVES = [NgbPopover];
