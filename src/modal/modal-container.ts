import {
  Directive,
  Injector,
  Renderer,
  TemplateRef,
  ViewContainerRef,
  ComponentFactoryResolver,
  ComponentFactory,
  ComponentRef
} from '@angular/core';

import {isDefined} from '../util/util';
import {ContentRef} from '../util/popup';

import {NgbModalBackdrop} from './modal-backdrop';
import {NgbModalWindow} from './modal-window';
import {NgbModalStack} from './modal-stack';
import {NgbModalRef} from './modal-ref';

class ModalContentContext {
  close(result?: any) {}
  dismiss(reason?: any) {}
}

@Directive({selector: 'template[ngbModalContainer]'})
export class NgbModalContainer {
  private _backdropFactory: ComponentFactory<NgbModalBackdrop>;
  private _windowFactory: ComponentFactory<NgbModalWindow>;

  constructor(
      private _injector: Injector, private _renderer: Renderer, private _viewContainerRef: ViewContainerRef,
      componentFactoryResolver: ComponentFactoryResolver, ngbModalStack: NgbModalStack) {
    this._backdropFactory = componentFactoryResolver.resolveComponentFactory(NgbModalBackdrop);
    this._windowFactory = componentFactoryResolver.resolveComponentFactory(NgbModalWindow);

    ngbModalStack.registerContainer(this);
  }

  open(content: string | TemplateRef<any>, options): NgbModalRef {
    const modalContentContext = new ModalContentContext();
    const contentRef = this._getContentRef(content, modalContentContext);
    const windowCmptRef =
        this._viewContainerRef.createComponent(this._windowFactory, 0, this._injector, contentRef.nodes);
    let backdropCmptRef: ComponentRef<NgbModalBackdrop>;
    let ngbModalRef: NgbModalRef;

    if (options.backdrop !== false) {
      backdropCmptRef = this._viewContainerRef.createComponent(this._backdropFactory, 0, this._injector);
    }
    ngbModalRef = new NgbModalRef(this._viewContainerRef, windowCmptRef, backdropCmptRef, contentRef.viewRef);

    modalContentContext.close = (result: any) => { ngbModalRef.close(result); };
    modalContentContext.dismiss = (reason: any) => { ngbModalRef.dismiss(reason); };

    this._applyWindowOptions(windowCmptRef.instance, options);

    return ngbModalRef;
  }

  private _applyWindowOptions(windowInstance: NgbModalWindow, options: Object): void {
    ['backdrop', 'keyboard', 'size', 'windowClass'].forEach((optionName: string) => {
      if (isDefined(options[optionName])) {
        windowInstance[optionName] = options[optionName];
      }
    });
  }

  private _getContentRef(content: string | TemplateRef<any>, context: ModalContentContext): ContentRef {
    if (!content) {
      return new ContentRef([]);
    } else if (content instanceof TemplateRef) {
      const viewRef = this._viewContainerRef.createEmbeddedView(<TemplateRef<ModalContentContext>>content, context);
      return new ContentRef([viewRef.rootNodes], viewRef);
    } else {
      return new ContentRef([[this._renderer.createText(null, `${content}`)]]);
    }
  }
}
