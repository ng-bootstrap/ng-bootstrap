import { NgModule } from '@angular/core';
import { NgbModalContainer } from './modal-container';
import { NgbModalBackdrop } from './modal-backdrop';
import { NgbModalWindow } from './modal-window';
import { NgbModalStack } from './modal-stack';
import { NgbModal } from './modal';
export { NgbModal } from './modal';
export { NgbModalRef, NgbActiveModal } from './modal-ref';
export { ModalDismissReasons } from './modal-dismiss-reasons';
export var NgbModalModule = (function () {
    function NgbModalModule() {
    }
    NgbModalModule.forRoot = function () { return { ngModule: NgbModalModule, providers: [NgbModal, NgbModalStack] }; };
    NgbModalModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [NgbModalContainer, NgbModalBackdrop, NgbModalWindow],
                    entryComponents: [NgbModalBackdrop, NgbModalWindow],
                    providers: [NgbModal],
                    exports: [NgbModalContainer]
                },] },
    ];
    /** @nocollapse */
    NgbModalModule.ctorParameters = [];
    return NgbModalModule;
}());
//# sourceMappingURL=modal.module.js.map