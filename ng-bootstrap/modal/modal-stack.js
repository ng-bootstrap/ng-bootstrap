import { Injectable } from '@angular/core';
export var NgbModalStack = (function () {
    function NgbModalStack() {
    }
    NgbModalStack.prototype.open = function (content, options) {
        if (options === void 0) { options = {}; }
        if (!this.modalContainer) {
            throw new Error('Missing modal container, add <template ngbModalContainer></template> to one of your application templates.');
        }
        return this.modalContainer.open(content, options);
    };
    NgbModalStack.prototype.registerContainer = function (modalContainer) { this.modalContainer = modalContainer; };
    NgbModalStack.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    NgbModalStack.ctorParameters = [];
    return NgbModalStack;
}());
//# sourceMappingURL=modal-stack.js.map