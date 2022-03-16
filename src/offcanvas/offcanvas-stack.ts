import {DOCUMENT} from '@angular/common';
import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  EventEmitter,
  Inject,
  Injectable,
  Injector,
  NgZone,
  TemplateRef
} from '@angular/core';
import {finalize, Subject} from 'rxjs';

import {ngbFocusTrap} from '../util/focus-trap';
import {ContentRef} from '../util/popup';
import {ScrollBar} from '../util/scrollbar';
import {isDefined, isString} from '../util/util';
import {NgbActiveOffcanvas, NgbOffcanvasRef} from './offcanvas-ref';
import {NgbOffcanvasOptions} from './offcanvas-config';
import {NgbOffcanvasBackdrop} from './offcanvas-backdrop';
import {NgbOffcanvasPanel} from './offcanvas-panel';

@Injectable({providedIn: 'root'})
export class NgbOffcanvasStack {
  private _activePanelCmptHasChanged = new Subject<void>();
  private _scrollBarRestoreFn: null | (() => void) = null;
  private _backdropAttributes = ['animation', 'backdropClass'];
  private _offcanvasRef?: NgbOffcanvasRef;
  private _panelAttributes = ['animation', 'ariaDescribedBy', 'ariaLabelledBy', 'keyboard', 'panelClass', 'position'];
  private _panelCmpt?: ComponentRef<NgbOffcanvasPanel>;
  private _activeInstance: EventEmitter<NgbOffcanvasRef | undefined> = new EventEmitter();

  constructor(
      private _applicationRef: ApplicationRef, private _injector: Injector, @Inject(DOCUMENT) private _document: any,
      private _scrollBar: ScrollBar, private _ngZone: NgZone) {
    // Trap focus on active PanelCmpt
    this._activePanelCmptHasChanged.subscribe(() => {
      if (this._panelCmpt) {
        ngbFocusTrap(this._ngZone, this._panelCmpt.location.nativeElement, this._activePanelCmptHasChanged);
      }
    });
  }

  private _restoreScrollBar() {
    const scrollBarRestoreFn = this._scrollBarRestoreFn;
    if (scrollBarRestoreFn) {
      this._scrollBarRestoreFn = null;
      scrollBarRestoreFn();
    }
  }

  private _hideScrollBar() {
    if (!this._scrollBarRestoreFn) {
      this._scrollBarRestoreFn = this._scrollBar.hide();
    }
  }

  open(moduleCFR: ComponentFactoryResolver, contentInjector: Injector, content: any, options: NgbOffcanvasOptions):
      NgbOffcanvasRef {
    const containerEl = options.container instanceof HTMLElement ? options.container : isDefined(options.container) ?
                                                                   this._document.querySelector(options.container) :
                                                                   this._document.body;
    if (!containerEl) {
      throw new Error(`The specified offcanvas container "${options.container || 'body'}" was not found in the DOM.`);
    }

    if (!options.scroll) {
      this._hideScrollBar();
    }

    const activeOffcanvas = new NgbActiveOffcanvas();
    const contentRef = this._getContentRef(moduleCFR, options.injector || contentInjector, content, activeOffcanvas);

    let backdropCmptRef: ComponentRef<NgbOffcanvasBackdrop>| undefined =
        options.backdrop !== false ? this._attachBackdrop(moduleCFR, containerEl) : undefined;
    let panelCmptRef: ComponentRef<NgbOffcanvasPanel> = this._attachWindowComponent(moduleCFR, containerEl, contentRef);
    let ngbOffcanvasRef: NgbOffcanvasRef =
        new NgbOffcanvasRef(panelCmptRef, contentRef, backdropCmptRef, options.beforeDismiss);

    this._registerOffcanvasRef(ngbOffcanvasRef);
    this._registerPanelCmpt(panelCmptRef);
    ngbOffcanvasRef.hidden.pipe(finalize(() => this._restoreScrollBar())).subscribe();
    activeOffcanvas.close = (result: any) => { ngbOffcanvasRef.close(result); };
    activeOffcanvas.dismiss = (reason: any) => { ngbOffcanvasRef.dismiss(reason); };

    this._applyPanelOptions(panelCmptRef.instance, options);

    if (backdropCmptRef && backdropCmptRef.instance) {
      this._applyBackdropOptions(backdropCmptRef.instance, options);
      backdropCmptRef.changeDetectorRef.detectChanges();
    }
    panelCmptRef.changeDetectorRef.detectChanges();
    return ngbOffcanvasRef;
  }

  get activeInstance() { return this._activeInstance; }

  dismiss(reason?: any) { this._offcanvasRef ?.dismiss(reason); }

  hasOpenOffcanvas(): boolean { return !!this._offcanvasRef; }

  private _attachBackdrop(moduleCFR: ComponentFactoryResolver, containerEl: any): ComponentRef<NgbOffcanvasBackdrop> {
    let backdropFactory = moduleCFR.resolveComponentFactory(NgbOffcanvasBackdrop);
    let backdropCmptRef = backdropFactory.create(this._injector);
    this._applicationRef.attachView(backdropCmptRef.hostView);
    containerEl.appendChild(backdropCmptRef.location.nativeElement);
    return backdropCmptRef;
  }

  private _attachWindowComponent(moduleCFR: ComponentFactoryResolver, containerEl: any, contentRef: any):
      ComponentRef<NgbOffcanvasPanel> {
    let panelFactory = moduleCFR.resolveComponentFactory(NgbOffcanvasPanel);
    let panelCmptRef = panelFactory.create(this._injector, contentRef.nodes);
    this._applicationRef.attachView(panelCmptRef.hostView);
    containerEl.appendChild(panelCmptRef.location.nativeElement);
    return panelCmptRef;
  }

  private _applyPanelOptions(windowInstance: NgbOffcanvasPanel, options: NgbOffcanvasOptions): void {
    this._panelAttributes.forEach((optionName: string) => {
      if (isDefined(options[optionName])) {
        windowInstance[optionName] = options[optionName];
      }
    });
  }

  private _applyBackdropOptions(backdropInstance: NgbOffcanvasBackdrop, options: NgbOffcanvasOptions): void {
    this._backdropAttributes.forEach((optionName: string) => {
      if (isDefined(options[optionName])) {
        backdropInstance[optionName] = options[optionName];
      }
    });
  }

  private _getContentRef(
      moduleCFR: ComponentFactoryResolver, contentInjector: Injector, content: any,
      activeOffcanvas: NgbActiveOffcanvas): ContentRef {
    if (!content) {
      return new ContentRef([]);
    } else if (content instanceof TemplateRef) {
      return this._createFromTemplateRef(content, activeOffcanvas);
    } else if (isString(content)) {
      return this._createFromString(content);
    } else {
      return this._createFromComponent(moduleCFR, contentInjector, content, activeOffcanvas);
    }
  }

  private _createFromTemplateRef(content: TemplateRef<any>, activeOffcanvas: NgbActiveOffcanvas): ContentRef {
    const context = {
      $implicit: activeOffcanvas,
      close(result) { activeOffcanvas.close(result); },
      dismiss(reason) { activeOffcanvas.dismiss(reason); }
    };
    const viewRef = content.createEmbeddedView(context);
    this._applicationRef.attachView(viewRef);
    return new ContentRef([viewRef.rootNodes], viewRef);
  }

  private _createFromString(content: string): ContentRef {
    const component = this._document.createTextNode(`${content}`);
    return new ContentRef([[component]]);
  }

  private _createFromComponent(
      moduleCFR: ComponentFactoryResolver, contentInjector: Injector, content: any,
      context: NgbActiveOffcanvas): ContentRef {
    const contentCmptFactory = moduleCFR.resolveComponentFactory(content);
    const offcanvasContentInjector =
        Injector.create({providers: [{provide: NgbActiveOffcanvas, useValue: context}], parent: contentInjector});
    const componentRef = contentCmptFactory.create(offcanvasContentInjector);
    const componentNativeEl = componentRef.location.nativeElement;
    this._applicationRef.attachView(componentRef.hostView);
    return new ContentRef([[componentNativeEl]], componentRef.hostView, componentRef);
  }

  private _registerOffcanvasRef(ngbOffcanvasRef: NgbOffcanvasRef) {
    const unregisterOffcanvasRef = () => {
      this._offcanvasRef = undefined;
      this._activeInstance.emit(this._offcanvasRef);
    };
    this._offcanvasRef = ngbOffcanvasRef;
    this._activeInstance.emit(this._offcanvasRef);
    ngbOffcanvasRef.result.then(unregisterOffcanvasRef, unregisterOffcanvasRef);
  }

  private _registerPanelCmpt(ngbPanelCmpt: ComponentRef<NgbOffcanvasPanel>) {
    this._panelCmpt = ngbPanelCmpt;
    this._activePanelCmptHasChanged.next();

    ngbPanelCmpt.onDestroy(() => {
      this._panelCmpt = undefined;
      this._activePanelCmptHasChanged.next();
    });
  }
}
