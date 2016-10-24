import { NgModule } from '@angular/core';
import { NGB_COLLAPSE_DIRECTIVES } from './collapse';
export var NgbCollapseModule = (function () {
    function NgbCollapseModule() {
    }
    NgbCollapseModule.forRoot = function () { return { ngModule: NgbCollapseModule, providers: [] }; };
    NgbCollapseModule.decorators = [
        { type: NgModule, args: [{ declarations: NGB_COLLAPSE_DIRECTIVES, exports: NGB_COLLAPSE_DIRECTIVES },] },
    ];
    /** @nocollapse */
    NgbCollapseModule.ctorParameters = [];
    return NgbCollapseModule;
}());
//# sourceMappingURL=collapse.module.js.map