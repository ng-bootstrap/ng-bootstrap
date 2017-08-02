import { NgModule } from '@angular/core';
import { NgbTooltip, NgbTooltipWindow } from './tooltip';
import { NgbTooltipConfig } from './tooltip-config';
export { NgbTooltipConfig } from './tooltip-config';
export { NgbTooltip } from './tooltip';
export var NgbTooltipModule = (function () {
    function NgbTooltipModule() {
    }
    NgbTooltipModule.forRoot = function () { return { ngModule: NgbTooltipModule, providers: [NgbTooltipConfig] }; };
    NgbTooltipModule.decorators = [
        { type: NgModule, args: [{ declarations: [NgbTooltip, NgbTooltipWindow], exports: [NgbTooltip], entryComponents: [NgbTooltipWindow] },] },
    ];
    /** @nocollapse */
    NgbTooltipModule.ctorParameters = [];
    return NgbTooltipModule;
}());
//# sourceMappingURL=tooltip.module.js.map