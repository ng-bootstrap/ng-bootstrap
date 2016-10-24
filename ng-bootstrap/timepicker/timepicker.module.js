import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbTimepicker } from './timepicker';
import { NgbTimepickerConfig } from './timepicker-config';
export { NgbTimepicker } from './timepicker';
export { NgbTimepickerConfig } from './timepicker-config';
export var NgbTimepickerModule = (function () {
    function NgbTimepickerModule() {
    }
    NgbTimepickerModule.forRoot = function () { return { ngModule: NgbTimepickerModule, providers: [NgbTimepickerConfig] }; };
    NgbTimepickerModule.decorators = [
        { type: NgModule, args: [{ declarations: [NgbTimepicker], exports: [NgbTimepicker], imports: [CommonModule] },] },
    ];
    /** @nocollapse */
    NgbTimepickerModule.ctorParameters = [];
    return NgbTimepickerModule;
}());
//# sourceMappingURL=timepicker.module.js.map