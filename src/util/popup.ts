import {
  Injector,
  TemplateRef,
  ViewContainerRef,
  Renderer,
  ComponentRef,
  ComponentFactory,
  ComponentFactoryResolver
} from '@angular/core';

export class PopupService<T> {
  private _windowFactory: ComponentFactory<T>;
  private _windowRef: ComponentRef<T>;

  constructor(
      type: any, private _injector: Injector, private _viewContainerRef: ViewContainerRef, private _renderer: Renderer,
      componentFactoryResolver: ComponentFactoryResolver) {
    this._windowFactory = componentFactoryResolver.resolveComponentFactory<T>(type);
  }

  open(content?: string | TemplateRef<any>): ComponentRef<T> {
    if (!this._windowRef) {
      const nodes = this._getContentNodes(content);
      this._windowRef = this._viewContainerRef.createComponent(this._windowFactory, 0, this._injector, nodes);
    }

    return this._windowRef;
  }

  close() {
    if (this._windowRef) {
      this._viewContainerRef.remove(this._viewContainerRef.indexOf(this._windowRef.hostView));
      this._windowRef = null;
    }
  }

  private _getContentNodes(content: string | TemplateRef<any>) {
    if (!content) {
      return [];
    } else if (content instanceof TemplateRef) {
      return [this._viewContainerRef.createEmbeddedView(<TemplateRef<T>>content).rootNodes];
    } else {
      return [[this._renderer.createText(null, `${content}`)]];
    }
  }
}
