import {
  Injector,
  TemplateRef,
  ViewRef,
  ViewContainerRef,
  Renderer2,
  ComponentRef,
  ComponentFactoryResolver,
  ApplicationRef,
  NgZone
} from '@angular/core';
import {NgbRunTransition} from '../util/transition/ngbTransition';
import {NgbPopupFadingTransition} from '../util/transition/ngbFadingTransition';
import {take} from 'rxjs/operators';
import {of, Observable} from 'rxjs';

export class ContentRef {
  constructor(public nodes: any[], public viewRef?: ViewRef, public componentRef?: ComponentRef<any>) {}
}

export class PopupService<T> {
  private _windowRef: ComponentRef<T>| null = null;
  private _contentRef: ContentRef | null = null;

  constructor(
      private _type: any, private _injector: Injector, private _viewContainerRef: ViewContainerRef,
      private _renderer: Renderer2, private _ngZone: NgZone,
      private _componentFactoryResolver: ComponentFactoryResolver, private _applicationRef: ApplicationRef) {}

  open(content?: string | TemplateRef<any>, context?: any, animation = true): ComponentRef<T> {
    if (!this._windowRef) {
      this._contentRef = this._getContentRef(content, context);
      this._windowRef = this._viewContainerRef.createComponent(
          this._componentFactoryResolver.resolveComponentFactory<T>(this._type), this._viewContainerRef.length,
          this._injector, this._contentRef.nodes);
    }

    const element = this._windowRef.location.nativeElement;

    this._ngZone.onStable.pipe(take(1)).subscribe(
        () => { NgbRunTransition(element, NgbPopupFadingTransition, {animation, data: {showElement: true}}); });

    return this._windowRef;
  }

  close(animation = true): Observable<any> {
    let observable;
    if (this._windowRef) {
      const element = this._windowRef.location.nativeElement;
      observable =
          NgbRunTransition(element, NgbPopupFadingTransition, {animation: animation, data: {showElement: false}});
      observable.subscribe(() => {
        if (this._windowRef) {
          this._viewContainerRef.remove(this._viewContainerRef.indexOf(this._windowRef.hostView));
          this._windowRef = null;
        }
        if (this._contentRef?.viewRef) {
          this._applicationRef.detachView(this._contentRef.viewRef);
          this._contentRef.viewRef.destroy();
          this._contentRef = null;
        }
      });
    } else {
      observable = of();
    }
    return observable;
  }

  private _getContentRef(content?: string | TemplateRef<any>, context?: any): ContentRef {
    if (!content) {
      return new ContentRef([]);
    } else if (content instanceof TemplateRef) {
      const viewRef = content.createEmbeddedView(context);
      this._applicationRef.attachView(viewRef);
      return new ContentRef([viewRef.rootNodes], viewRef);
    } else {
      return new ContentRef([[this._renderer.createText(`${content}`)]]);
    }
  }
}
