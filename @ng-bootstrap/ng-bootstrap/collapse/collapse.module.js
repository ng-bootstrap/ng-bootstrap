import { NgModule } from '@angular/core';
import { NgbCollapse } from './collapse';
export { NgbCollapse } from './collapse';
export var NgbCollapseModule = (function () {
    function NgbCollapseModule() {
    }
    NgbCollapseModule.forRoot = function () { return { ngModule: NgbCollapseModule, providers: [] }; };
    NgbCollapseModule.decorators = [
        { type: NgModule, args: [{ declarations: [NgbCollapse], exports: [NgbCollapse] },] },
    ];
    /** @nocollapse */
    NgbCollapseModule.ctorParameters = [];
    return NgbCollapseModule;
}());
//# sourceMappingURL=collapse.module.js.map