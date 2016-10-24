import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NGB_TABSET_DIRECTIVES } from './tabset';
import { NgbTabsetConfig } from './tabset-config';
export { NgbTabsetConfig } from './tabset-config';
export var NgbTabsetModule = (function () {
    function NgbTabsetModule() {
    }
    NgbTabsetModule.forRoot = function () { return { ngModule: NgbTabsetModule, providers: [NgbTabsetConfig] }; };
    NgbTabsetModule.decorators = [
        { type: NgModule, args: [{ declarations: NGB_TABSET_DIRECTIVES, exports: NGB_TABSET_DIRECTIVES, imports: [CommonModule] },] },
    ];
    /** @nocollapse */
    NgbTabsetModule.ctorParameters = [];
    return NgbTabsetModule;
}());
//# sourceMappingURL=tabset.module.js.map