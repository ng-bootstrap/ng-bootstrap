import {
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

/**
 * The interface that concrete tooltip-like window components must implement
 */
export interface ITooltipWindow { placement: string; }

/**
 * Base abstract class for tooltip-like components (i.e. tooltip and popover)
 */
export abstract class NgbAbstractTooltip<W extends ITooltipWindow> implements OnInit, AfterViewChecked {
  private _positioning = new Positioning();
  private _windowFactory: ComponentFactory<W>;
  private _windowRef: ComponentRef<W>;

  constructor(
      private _elementRef: ElementRef, private _viewContainerRef: ViewContainerRef, private _injector: Injector,
      /* tslint:disable because tslint rule contradicts clang rule regarding white space after `W;` */
      private _renderer: Renderer, componentFactoryResolver: ComponentFactoryResolver, windowType: {new (): W;}) {
    /* tslint:enable */
    this._windowFactory = componentFactoryResolver.resolveComponentFactory(windowType);
  }

  open() {
    if (!this._windowRef) {
      const nodes = this._getContentNodes();
      this._windowRef = this._viewContainerRef.createComponent(this._windowFactory, 0, this._injector, nodes);
      this._windowRef.instance.placement = this.getPlacementInput();
      this.customizeWindowRefInstance(this._windowRef.instance);
    }
  }

  /**
   * allows subclasses to customize the window instance after its placement has been set.
   * Does nothing by default.
   * @param window the window to customize
   */
  protected customizeWindowRefInstance(window: W) {
    // nothing to do
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
    const triggers = parseTriggers(this.getTriggersInput());

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
          this._elementRef.nativeElement, this._windowRef.location.nativeElement, this.getPlacementInput(), false);

      const targetStyle = this._windowRef.location.nativeElement.style;
      targetStyle.top = `${targetPosition.top}px`;
      targetStyle.left = `${targetPosition.left}px`;
    }
  }

  /**
   * Returns the value of the input containing the text or template to display
   */
  protected abstract getTooltipInput(): string | TemplateRef<any>;

  /**
   * Returns the value of the input containing the placement
   */
  protected abstract getPlacementInput(): string;

  /**
   * Returns the value of the input containing the triggers
   */
  protected abstract getTriggersInput(): string;

  private _getContentNodes() {
    const tooltipInput = this.getTooltipInput();
    if (tooltipInput instanceof TemplateRef) {
      return [this._viewContainerRef.createEmbeddedView(<TemplateRef<W>>tooltipInput).rootNodes];
    } else {
      return [[this._renderer.createText(null, `${tooltipInput}`)]];
    }
  }
}
