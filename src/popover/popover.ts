import {
  Component,
  Directive,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  Injector,
  Renderer2,
  ComponentRef,
  ElementRef,
  TemplateRef,
  ViewContainerRef,
  ComponentFactoryResolver,
  NgZone
} from '@angular/core';

import {listenToTriggers} from '../util/triggers';
import {positionElements, Placement, PlacementArray} from '../util/positioning';
import {PopupService} from '../util/popup';
import {NgbPopoverConfig} from './popover-config';
import {AutoCloseNotifyService} from '../util/autoclosenotify.service';

let nextId = 0;

@Component({
  selector: 'ngb-popover-window',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': '"popover bs-popover-" + placement.split("-")[0]+" bs-popover-" + placement',
    'role': 'tooltip',
    '[id]': 'id'
  },
  template: `
    <div class="arrow"></div>
    <h3 class="popover-header">{{title}}</h3><div class="popover-body"><ng-content></ng-content></div>`,
  styles: [`
    :host.bs-popover-top .arrow, :host.bs-popover-bottom .arrow {
      left: 50%;
    }

    :host.bs-popover-top-left .arrow, :host.bs-popover-bottom-left .arrow {
      left: 2em;
    }

    :host.bs-popover-top-right .arrow, :host.bs-popover-bottom-right .arrow {
      left: auto;
      right: 2em;
    }

    :host.bs-popover-left .arrow, :host.bs-popover-right .arrow {
      top: 50%;
    }
    
    :host.bs-popover-left-top .arrow, :host.bs-popover-right-top .arrow {
      top: 0.7em;
    }

    :host.bs-popover-left-bottom .arrow, :host.bs-popover-right-bottom .arrow {
      top: auto;
      bottom: 0.7em;
    }
  `]
})
export class NgbPopoverWindow {
  @Input() placement: Placement = 'top';
  @Input() title: string;
  @Input() id: string;

  constructor(private _element: ElementRef, private _renderer: Renderer2) {}

  applyPlacement(_placement: Placement) {
    // remove the current placement classes
    this._renderer.removeClass(this._element.nativeElement, 'bs-popover-' + this.placement.toString().split('-')[0]);
    this._renderer.removeClass(this._element.nativeElement, 'bs-popover-' + this.placement.toString());

    // set the new placement classes
    this.placement = _placement;

    // apply the new placement
    this._renderer.addClass(this._element.nativeElement, 'bs-popover-' + this.placement.toString().split('-')[0]);
    this._renderer.addClass(this._element.nativeElement, 'bs-popover-' + this.placement.toString());
  }
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
   * Placement of a popover accepts:
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
   * A selector specifying the element the popover should be appended to.
   * Currently only supports "body".
   */
  @Input() container: string;
  /**
   * Indicates that popover should be closed when selecting one of popover items (click) or pressing ESC.
   * When it is true (default) popover are automatically closed on both outside and inside (menu) clicks.
   * When it is false popover are never automatically closed.
   * When it is 'outside' popover are automatically closed on outside clicks but not on menu clicks.
   * When it is 'inside' popover are automatically on menu clicks but not on outside clicks.
   */
  @Input() autoClose: boolean | 'outside' | 'inside';
  /**
   * Emits an event when the popover is shown
   */
  @Output() shown = new EventEmitter();
  /**
   * Emits an event when the popover is hidden
   */
  @Output() hidden = new EventEmitter();

  private _ngbPopoverWindowId = `ngb-popover-${nextId++}`;
  private _popupService: PopupService<NgbPopoverWindow>;
  private _windowRef: ComponentRef<NgbPopoverWindow>;
  private _unregisterListenersFn;
  private _zoneSubscription: any;
  private _unregisterAutoCloseNotifyhandler: Function;

  constructor(
      private _elementRef: ElementRef, private _renderer: Renderer2, injector: Injector,
      componentFactoryResolver: ComponentFactoryResolver, viewContainerRef: ViewContainerRef, config: NgbPopoverConfig,
      ngZone: NgZone, private _autoCloseNotifyService: AutoCloseNotifyService) {
    this.placement = config.placement;
    this.triggers = config.triggers;
    this.container = config.container;
    this.autoClose = config.autoClose;
    this._popupService = new PopupService<NgbPopoverWindow>(
        NgbPopoverWindow, injector, viewContainerRef, _renderer, componentFactoryResolver);

    this._zoneSubscription = ngZone.onStable.subscribe(() => {
      if (this._windowRef) {
        this._windowRef.instance.applyPlacement(
            positionElements(
                this._elementRef.nativeElement, this._windowRef.location.nativeElement, this.placement,
                this.container === 'body'));
      }
    });
  }

  /**
   * Opens an element’s popover. This is considered a “manual” triggering of the popover.
   * The context is an optional value to be injected into the popover template when it is created.
   */
  open(context?: any) {
    if (!this._windowRef) {
      this._windowRef = this._popupService.open(this.ngbPopover, context);
      this._windowRef.instance.title = this.popoverTitle;
      this._windowRef.instance.id = this._ngbPopoverWindowId;

      this._renderer.setAttribute(this._elementRef.nativeElement, 'aria-describedby', this._ngbPopoverWindowId);

      if (this.container === 'body') {
        window.document.querySelector(this.container).appendChild(this._windowRef.location.nativeElement);
      }

      // apply styling to set basic css-classes on target element, before going for positioning
      this._windowRef.changeDetectorRef.detectChanges();
      this._windowRef.changeDetectorRef.markForCheck();

      // position popover along the element
      this._windowRef.instance.applyPlacement(
          positionElements(
              this._elementRef.nativeElement, this._windowRef.location.nativeElement, this.placement,
              this.container === 'body'));

      this.shown.emit();

      // register for click and esc key events
      this._unregisterAutoCloseNotifyhandler =
          this._autoCloseNotifyService.register(this.autoCloseNotifyHandler.bind(this));
    }
  }

  /**
   * Closes an element’s popover. This is considered a “manual” triggering of the popover.
   */
  close(): void {
    if (this._windowRef) {
      this._renderer.removeAttribute(this._elementRef.nativeElement, 'aria-describedby');
      this._popupService.close();
      this._windowRef = null;
      this.hidden.emit();
      this._unregisterAutoCloseNotifyhandler();
    }
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

  /**
   * Returns whether or not the popover is currently being shown
   */
  isOpen(): boolean { return this._windowRef != null; }

  ngOnInit() {
    this._unregisterListenersFn = listenToTriggers(
        this._renderer, this._elementRef.nativeElement, this.triggers, this.open.bind(this), this.close.bind(this),
        this.toggle.bind(this));
  }

  ngOnDestroy() {
    this.close();
    this._unregisterListenersFn();
    this._zoneSubscription.unsubscribe();
  }

  /**
   * handler for the AutoCloseNotifyService to recieve the click and esc events for autoclose feature
   */
  private autoCloseNotifyHandler(event: Event) {
    let isInside = false;
    let clickedComponent = event.target;
    if (event.type === this._autoCloseNotifyService.mouseEvent && this.autoClose &&
        clickedComponent !== this._elementRef.nativeElement) {
      do {
        if (clickedComponent === this._windowRef.location.nativeElement) {
          isInside = true;
          break;
        }
        clickedComponent = (<HTMLElement>clickedComponent).parentNode;
      } while (clickedComponent);

      this.closeFromClick(event, isInside);
    } else if (event.type === this._autoCloseNotifyService.keyboardEvent) {
      this.closeFromOutsideEsc();
    }
  }

  private closeFromClick($event, isInside: boolean) {
    if (this.autoClose === true) {
      this.close();
    } else if (this.autoClose === 'inside' && isInside) {
      this.close();
    } else if (this.autoClose === 'outside' && !isInside) {
      this.close();
    }
  }

  private closeFromOutsideEsc() {
    if (this.autoClose) {
      this.close();
    }
  }
}
