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
    const nodes = this._getContentNodes(content, modalContentContext);
    const windowCmptRef = this._viewContainerRef.createComponent(this._windowFactory, 0, this._injector, nodes);
    let backdropCmptRef: ComponentRef<NgbModalBackdrop>;
    let ngbModalRef: NgbModalRef;

    if (options.backdrop !== false) {
      backdropCmptRef = this._viewContainerRef.createComponent(this._backdropFactory, 0, this._injector);
    }
    ngbModalRef = new NgbModalRef(this._viewContainerRef, windowCmptRef, backdropCmptRef);

    modalContentContext.close = (result: any) => { ngbModalRef.close(result); };
    modalContentContext.dismiss = (reason: any) => { ngbModalRef.dismiss(reason); };

    this._applyWindowOptions(windowCmptRef.instance, options);

    return ngbModalRef;
  }

  private _applyWindowOptions(windowInstance: NgbModalWindow, options: Object): void {
    ['backdrop', 'keyboard', 'size'].forEach((optionName: string) => {
      if (isDefined(options[optionName])) {
        windowInstance[optionName] = options[optionName];
      }
    });
  }

  private _getContentNodes(content: string | TemplateRef<any>, context: ModalContentContext): any[] {
    if (!content) {
      return [];
    } else if (content instanceof TemplateRef) {
      return [this._viewContainerRef.createEmbeddedView(<TemplateRef<ModalContentContext>>content, context).rootNodes];
    } else {
      return [[this._renderer.createText(null, `${content}`)]];
    }
  }
}
