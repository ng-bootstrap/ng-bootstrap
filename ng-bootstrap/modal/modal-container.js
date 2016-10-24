import { Directive, Injector, ReflectiveInjector, Renderer, TemplateRef, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { isDefined, isString } from '../util/util';
import { ContentRef } from '../util/popup';
import { NgbModalBackdrop } from './modal-backdrop';
import { NgbModalWindow } from './modal-window';
import { NgbModalStack } from './modal-stack';
import { NgbActiveModal, NgbModalRef } from './modal-ref';
export var NgbModalContainer = (function () {
    function NgbModalContainer(_injector, _renderer, _viewContainerRef, _componentFactoryResolver, ngbModalStack) {
        this._injector = _injector;
        this._renderer = _renderer;
        this._viewContainerRef = _viewContainerRef;
        this._componentFactoryResolver = _componentFactoryResolver;
        this._backdropFactory = _componentFactoryResolver.resolveComponentFactory(NgbModalBackdrop);
        this._windowFactory = _componentFactoryResolver.resolveComponentFactory(NgbModalWindow);
        ngbModalStack.registerContainer(this);
    }
    NgbModalContainer.prototype.open = function (content, options) {
        var activeModal = new NgbActiveModal();
        var contentRef = this._getContentRef(content, activeModal);
        var windowCmptRef;
        var backdropCmptRef;
        var ngbModalRef;
        if (options.backdrop !== false) {
            backdropCmptRef =
                this._viewContainerRef.createComponent(this._backdropFactory, this._viewContainerRef.length, this._injector);
        }
        windowCmptRef = this._viewContainerRef.createComponent(this._windowFactory, this._viewContainerRef.length, this._injector, contentRef.nodes);
        ngbModalRef = new NgbModalRef(this._viewContainerRef, windowCmptRef, contentRef, backdropCmptRef);
        activeModal.close = function (result) { ngbModalRef.close(result); };
        activeModal.dismiss = function (reason) { ngbModalRef.dismiss(reason); };
        this._applyWindowOptions(windowCmptRef.instance, options);
        return ngbModalRef;
    };
    NgbModalContainer.prototype._applyWindowOptions = function (windowInstance, options) {
        ['backdrop', 'keyboard', 'size', 'windowClass'].forEach(function (optionName) {
            if (isDefined(options[optionName])) {
                windowInstance[optionName] = options[optionName];
            }
        });
    };
    NgbModalContainer.prototype._getContentRef = function (content, context) {
        if (!content) {
            return new ContentRef([]);
        }
        else if (content instanceof TemplateRef) {
            var viewRef = this._viewContainerRef.createEmbeddedView(content, context);
            return new ContentRef([viewRef.rootNodes], viewRef);
        }
        else if (isString(content)) {
            return new ContentRef([[this._renderer.createText(null, "" + content)]]);
        }
        else {
            var contentCmptFactory = this._componentFactoryResolver.resolveComponentFactory(content);
            var modalContentInjector = ReflectiveInjector.resolveAndCreate([{ provide: NgbActiveModal, useValue: context }], this._injector);
            var componentRef = this._viewContainerRef.createComponent(contentCmptFactory, 0, modalContentInjector);
            return new ContentRef([[componentRef.location.nativeElement]], componentRef.hostView, componentRef);
        }
    };
    NgbModalContainer.decorators = [
        { type: Directive, args: [{ selector: 'template[ngbModalContainer]' },] },
    ];
    /** @nocollapse */
    NgbModalContainer.ctorParameters = [
        { type: Injector, },
        { type: Renderer, },
        { type: ViewContainerRef, },
        { type: ComponentFactoryResolver, },
        { type: NgbModalStack, },
    ];
    return NgbModalContainer;
}());
//# sourceMappingURL=modal-container.js.map