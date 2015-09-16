import {
  bind,
  forwardRef,
  Component,
  ComponentRef,
  Directive,
  DynamicComponentLoader,
  ElementRef,
  Host,
  Injectable,
  ResolvedBinding,
  SkipSelf,
  Injector,
  View,
  ViewEncapsulation
} from 'angular2/angular2/core';

import {ObservableWrapper, Promise, PromiseWrapper} from 'angular2/angular2/src/core/facade/async';
import {isPresent, Type} from 'angular2/angular2/src/core/facade/lang';
import {DOM} from 'angular2/angular2/src/core/dom/dom_adapter';
import {MouseEvent, KeyboardEvent} from 'angular2/angular2/src/core/facade/browser';
// TODO: pull key codes out from angular material or work with them to bring it into core?
import {KeyCodes} from 'angular2/angular2_material/src/core/key_codes';

export class UibModal {
  constructor(private loader: DynamicComponentLoader) {}

  open(type: Type, elementRef: ElementRef, options: UibModalConfig = null): Promise<UibModalRef> {
    let config = isPresent(options) ? options : new UibModalConfig();
    let modalRef = new UibModalRef();
    let bindings = Injector.resolve([bind(UibModalRef).toValue(modalRef)]);
    let backdropRefPromise = this._openBackdrop(elementRef, bindings);

    return this.componentLoader.loadNextToLocation(UibModalContainer, elementRef)
      .then(containerRef => {
        let modalElement = containerRef.location.nativeElement;
        DOM.appendChild(DOM.query('body'), dialogElement);

        if (isPresent(config.width)) {
          DOM.setStyle(modalElement, 'width', config.width);
        }

        if (isPresent(config.height)) {
          DOM.setStyle(modalElement, 'height', config.height);
        }

        modalRef.containerRef = containerRef;

        return this.componentLoader.loadNextToLocation(type, containerRef.instance.contentRef, bindings)
          .then(contentRef => {
            modalRef.contentRef = contentRef;
            containerRef.instance.modalRef = modalRef;

            backdropRefPromise.then(backdropRef => {
              modalRef.whenClosed.then(() => backdropRef.dispose());
            });

            return modalRef;
          });
      });
  }

  _openBackdrop(elementRef: ElementRef, bindings: ResolvedBinding[]): Promise<ComponentRef> {
    return this.componentLoader.loadNextToLocation(UibBackdrop, elementRef, bindings)
      .then(componentRef => {
        let backdropElement = componentRef.location.nativeElement;
        DOM.addClass(backdropElement, 'in');
        DOM.appendChild(DOM.query('body'), backdropElement);
        return componentRef;
      })
  }
}

export class UibModalRef {
  containerRef: ComponentRef;
  _contentRef: ComponentRef;
  isClosed: boolean;
  whenClosedDeferred: any;
  contentRefDeferred: any;

  constructor() {
    this._contentRef = null;
    this.containerRef = null;
    this.isClosed = false;

    this.contentRefDeferred = PromiseWrapper.completer();
    this.whenClosedDeferred = PromiseWrapper.completer();
  }

  set contentRef(value: ComponentRef) {
    this._contentRef = value;
    this.contentRefDeferred.resolve(value);
  }

  get instance() {
    if (isPresent(this._contentRef)) {
      return this._contentRef.instance;
    }

    throw `Cannot access dialog component instance *from* that component's constructor.`;
  }

  get whenClosed(): Promise<any> {
    return this.whenClosedDeferred.promise;
  }

  close(result: any = null) {
    this.contentRefDeferred.promise.then(() => {
      if (!this.isClosed) {
        this.isClosed = true;
        this.containerRef.dispose();
        this.whenClosedDeferred.resolve(result);
      }
    });
  }
}

export class UibModalConfig {
  width: string;
  height: string;
  backdrop: any;

  constructor() {
    this.width = null;
    this.height = null;
    this.backdrop = true;
  }
}

@Component({
  selector: 'uib-modal-container',
  host: {
    class: 'modal fade',
    tabindex: '0',
    '(body:keydown)': 'documentKeypress($event)'
  }
})
@View({
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'package:ui-bootstrap-core/src/components/modal/modal.html',
  directives: [forwardRef(() => UibModalContent)]
})
class UibModalContainer {
  contentRef: ElementRef;
  modalRef: UibModalRef;

  constructor() {
    this.contentRef = null;
    this.modalRef = null;
  }

  wrapFocus() {

  }

  documentKeypress(event: KeyboardEvent) {
    if (event.keyCode === KeyCodes.ESCAPE) {
      this.modalRef.close();
    }
  }
}

@Directive({
  selector: 'uib-modal-content'
})
class UibModalContent {
  constructor(@Host() @SkipSelf() modalContainer: UibModalContainer, elementRef: ElementRef) {
    modalContainer.contentRef = elementRef;
  }
}

@Component({
  selector: 'uib-backdrop',
  host: {
    '(click)': 'onClick()'
  }
})
@View({template: '', encapsulation: ViewEncapsulation.None})
class UibBackdrop {
  modalRef: UibModalRef;

  constructor(modalRef: UibModalRef, options: UibModalConfig) {
    this.modalRef = modalRef;
    this.options = options;
  }

  onClick() {
    if (this.options.backdrop !== 'static') {
      this.modalRef.close();
    }
  }
}
