import { Injectable, ComponentRef, ViewContainerRef } from '@angular/core';
import { ContentRef } from '../util/popup';
/**
 * A reference to an active (currently opened) modal. Instances of this class
 * can be injected into components passed as modal content.
 */
export var NgbActiveModal = (function () {
    function NgbActiveModal() {
    }
    /**
     * Can be used to close a modal, passing an optional result.
     */
    NgbActiveModal.prototype.close = function (result) { };
    /**
     * Can be used to dismiss a modal, passing an optional reason.
     */
    NgbActiveModal.prototype.dismiss = function (reason) { };
    NgbActiveModal.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    NgbActiveModal.ctorParameters = [];
    return NgbActiveModal;
}());
/**
 * A reference to a newly opened modal.
 */
export var NgbModalRef = (function () {
    function NgbModalRef(_viewContainerRef, _windowCmptRef, _contentRef, _backdropCmptRef) {
        var _this = this;
        this._viewContainerRef = _viewContainerRef;
        this._windowCmptRef = _windowCmptRef;
        this._contentRef = _contentRef;
        this._backdropCmptRef = _backdropCmptRef;
        _windowCmptRef.instance.dismissEvent.subscribe(function (reason) { _this.dismiss(reason); });
        this.result = new Promise(function (resolve, reject) {
            _this._resolve = resolve;
            _this._reject = reject;
        });
        this.result.then(null, function () { });
    }
    Object.defineProperty(NgbModalRef.prototype, "componentInstance", {
        /**
         * The instance of component used as modal's content.
         * Undefined when a TemplateRef is used as modal's content.
         */
        get: function () {
            if (this._contentRef.componentRef) {
                return this._contentRef.componentRef.instance;
            }
        },
        // only needed to keep TS1.8 compatibility
        set: function (instance) { },
        enumerable: true,
        configurable: true
    });
    /**
     * Can be used to close a modal, passing an optional result.
     */
    NgbModalRef.prototype.close = function (result) {
        if (this._windowCmptRef) {
            this._resolve(result);
            this._removeModalElements();
        }
    };
    /**
     * Can be used to dismiss a modal, passing an optional reason.
     */
    NgbModalRef.prototype.dismiss = function (reason) {
        if (this._windowCmptRef) {
            this._reject(reason);
            this._removeModalElements();
        }
    };
    NgbModalRef.prototype._removeModalElements = function () {
        this._viewContainerRef.remove(this._viewContainerRef.indexOf(this._windowCmptRef.hostView));
        if (this._backdropCmptRef) {
            this._viewContainerRef.remove(this._viewContainerRef.indexOf(this._backdropCmptRef.hostView));
        }
        if (this._contentRef && this._contentRef.viewRef) {
            this._viewContainerRef.remove(this._viewContainerRef.indexOf(this._contentRef.viewRef));
        }
        this._windowCmptRef = null;
        this._backdropCmptRef = null;
        this._contentRef = null;
    };
    NgbModalRef.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    NgbModalRef.ctorParameters = [
        { type: ViewContainerRef, },
        { type: ComponentRef, },
        { type: ContentRef, },
        { type: ComponentRef, },
    ];
    return NgbModalRef;
}());
//# sourceMappingURL=modal-ref.js.map