import { NgModule } from '@angular/core';
import { NgbPopover, NgbPopoverWindow } from './popover';
import { NgbPopoverConfig } from './popover-config';
export { NgbPopover } from './popover';
export { NgbPopoverConfig } from './popover-config';
export var NgbPopoverModule = (function () {
    function NgbPopoverModule() {
    }
    NgbPopoverModule.forRoot = function () { return { ngModule: NgbPopoverModule, providers: [NgbPopoverConfig] }; };
    NgbPopoverModule.decorators = [
        { type: NgModule, args: [{ declarations: [NgbPopover, NgbPopoverWindow], exports: [NgbPopover], entryComponents: [NgbPopoverWindow] },] },
    ];
    /** @nocollapse */
    NgbPopoverModule.ctorParameters = [];
    return NgbPopoverModule;
}());
//# sourceMappingURL=popover.module.js.map