import {
  ApplicationRef,
  Injectable,
  Injector,
  ReflectiveInjector,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  TemplateRef
} from '@angular/core';

import {ContentRef} from '../util/popup';
import {isDefined, isString} from '../util/util';

import {NgbModalBackdrop} from './modal-backdrop';
import {NgbModalWindow} from './modal-window';
import {NgbActiveModal, NgbModalRef} from './modal-ref';

@Injectable()
export class NgbModalStack {
  private _backdropFactory: ComponentFactory<NgbModalBackdrop>;
  private _windowFactory: ComponentFactory<NgbModalWindow>;

  constructor(
      private _applicationRef: ApplicationRef, private _injector: Injector,
      private _componentFactoryResolver: ComponentFactoryResolver) {
    this._backdropFactory = _componentFactoryResolver.resolveComponentFactory(NgbModalBackdrop);
    this._windowFactory = _componentFactoryResolver.resolveComponentFactory(NgbModalWindow);
  }

  open(moduleCFR: ComponentFactoryResolver, contentInjector: Injector, content: any, options): NgbModalRef {
    const containerSelector = options.container || 'body';
    const containerEl = document.querySelector(containerSelector);

    if (!containerEl) {
      throw new Error(`The specified modal container "${containerSelector}" was not found in the DOM.`);
    }

    const activeModal = new NgbActiveModal();
    const contentRef = this._getContentRef(moduleCFR, contentInjector, content, activeModal);

    let windowCmptRef: ComponentRef<NgbModalWindow>;
    let backdropCmptRef: ComponentRef<NgbModalBackdrop>;
    let ngbModalRef: NgbModalRef;


    if (options.backdrop !== false) {
      backdropCmptRef = this._backdropFactory.create(this._injector);
      this._applicationRef.attachView(backdropCmptRef.hostView);
      containerEl.appendChild(backdropCmptRef.location.nativeElement);
    }
    windowCmptRef = this._windowFactory.create(this._injector, contentRef.nodes);
    this._applicationRef.attachView(windowCmptRef.hostView);
    containerEl.appendChild(windowCmptRef.location.nativeElement);

    ngbModalRef = new NgbModalRef(windowCmptRef, contentRef, backdropCmptRef);

    activeModal.close = (result: any) => { ngbModalRef.close(result); };
    activeModal.dismiss = (reason: any) => { ngbModalRef.dismiss(reason); };

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

  private _getContentRef(
      moduleCFR: ComponentFactoryResolver, contentInjector: Injector, content: any,
      context: NgbActiveModal): ContentRef {
    if (!content) {
      return new ContentRef([]);
    } else if (content instanceof TemplateRef) {
      const viewRef = content.createEmbeddedView(context);
      this._applicationRef.attachView(viewRef);
      return new ContentRef([viewRef.rootNodes], viewRef);
    } else if (isString(content)) {
      return new ContentRef([[document.createTextNode(`${content}`)]]);
    } else {
      const contentCmptFactory = moduleCFR.resolveComponentFactory(content);
      const modalContentInjector =
          ReflectiveInjector.resolveAndCreate([{provide: NgbActiveModal, useValue: context}], contentInjector);
      const componentRef = contentCmptFactory.create(modalContentInjector);
      this._applicationRef.attachView(componentRef.hostView);
      return new ContentRef([[componentRef.location.nativeElement]], componentRef.hostView, componentRef);
    }
  }
}
