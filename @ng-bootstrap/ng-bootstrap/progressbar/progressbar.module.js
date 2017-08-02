import { NgModule } from '@angular/core';
import { NgbProgressbar } from './progressbar';
import { NgbProgressbarConfig } from './progressbar-config';
export { NgbProgressbar } from './progressbar';
export { NgbProgressbarConfig } from './progressbar-config';
export var NgbProgressbarModule = (function () {
    function NgbProgressbarModule() {
    }
    NgbProgressbarModule.forRoot = function () { return { ngModule: NgbProgressbarModule, providers: [NgbProgressbarConfig] }; };
    NgbProgressbarModule.decorators = [
        { type: NgModule, args: [{ declarations: [NgbProgressbar], exports: [NgbProgressbar] },] },
    ];
    /** @nocollapse */
    NgbProgressbarModule.ctorParameters = [];
    return NgbProgressbarModule;
}());
//# sourceMappingURL=progressbar.module.js.map