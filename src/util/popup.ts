import {
  Injector,
  TemplateRef,
  ViewRef,
  ViewContainerRef,
  Renderer,
  ComponentRef,
  ComponentFactory,
  ComponentFactoryResolver
} from '@angular/core';

export class ContentRef {
  constructor(public nodes: any[], public viewRef?: ViewRef) {}
}

export class PopupService<T> {
  private _windowFactory: ComponentFactory<T>;
  private _windowRef: ComponentRef<T>;
  private _contentRef: ContentRef;

  constructor(
      type: any, private _injector: Injector, private _viewContainerRef: ViewContainerRef, private _renderer: Renderer,
      componentFactoryResolver: ComponentFactoryResolver) {
    this._windowFactory = componentFactoryResolver.resolveComponentFactory<T>(type);
  }

  open(content?: string | TemplateRef<any>): ComponentRef<T> {
    if (!this._windowRef) {
      this._contentRef = this._getContentRef(content);
      this._windowRef =
          this._viewContainerRef.createComponent(this._windowFactory, 0, this._injector, this._contentRef.nodes);
    }

    return this._windowRef;
  }

  close() {
    if (this._windowRef) {
      this._viewContainerRef.remove(this._viewContainerRef.indexOf(this._windowRef.hostView));
      this._windowRef = null;

      if (this._contentRef.viewRef) {
        this._viewContainerRef.remove(this._viewContainerRef.indexOf(this._contentRef.viewRef));
        this._contentRef = null;
      }
    }
  }

  private _getContentRef(content: string | TemplateRef<any>): ContentRef {
    if (!content) {
      return new ContentRef([]);
    } else if (content instanceof TemplateRef) {
      const viewRef = this._viewContainerRef.createEmbeddedView(<TemplateRef<T>>content);
      return new ContentRef([viewRef.rootNodes], viewRef);
    } else {
      return new ContentRef([[this._renderer.createText(null, `${content}`)]]);
    }
  }
}
