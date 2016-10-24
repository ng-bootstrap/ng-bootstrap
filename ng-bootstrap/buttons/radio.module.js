import { NgModule } from '@angular/core';
import { NGB_RADIO_DIRECTIVES } from './radio';
export var NgbButtonsModule = (function () {
    function NgbButtonsModule() {
    }
    NgbButtonsModule.forRoot = function () { return { ngModule: NgbButtonsModule, providers: [] }; };
    NgbButtonsModule.decorators = [
        { type: NgModule, args: [{ declarations: NGB_RADIO_DIRECTIVES, exports: NGB_RADIO_DIRECTIVES },] },
    ];
    /** @nocollapse */
    NgbButtonsModule.ctorParameters = [];
    return NgbButtonsModule;
}());
//# sourceMappingURL=radio.module.js.map