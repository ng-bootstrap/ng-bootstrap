import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbAlert } from './alert';
import { NgbAlertConfig } from './alert-config';
export { NgbAlert } from './alert';
export { NgbAlertConfig } from './alert-config';
export var NgbAlertModule = (function () {
    function NgbAlertModule() {
    }
    NgbAlertModule.forRoot = function () { return { ngModule: NgbAlertModule, providers: [NgbAlertConfig] }; };
    NgbAlertModule.decorators = [
        { type: NgModule, args: [{ declarations: [NgbAlert], exports: [NgbAlert], imports: [CommonModule], entryComponents: [NgbAlert] },] },
    ];
    /** @nocollapse */
    NgbAlertModule.ctorParameters = [];
    return NgbAlertModule;
}());
//# sourceMappingURL=alert.module.js.map