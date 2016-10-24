import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbHighlight } from './highlight';
import { NgbTypeaheadWindow } from './typeahead-window';
import { NgbTypeahead } from './typeahead';
import { NgbTypeaheadConfig } from './typeahead-config';
export { NgbHighlight } from './highlight';
export { NgbTypeaheadWindow } from './typeahead-window';
export { NgbTypeaheadConfig } from './typeahead-config';
export var NgbTypeaheadModule = (function () {
    function NgbTypeaheadModule() {
    }
    NgbTypeaheadModule.forRoot = function () { return { ngModule: NgbTypeaheadModule, providers: [NgbTypeaheadConfig] }; };
    NgbTypeaheadModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [NgbTypeahead, NgbHighlight, NgbTypeaheadWindow],
                    exports: [NgbTypeahead],
                    imports: [CommonModule],
                    entryComponents: [NgbTypeaheadWindow]
                },] },
    ];
    /** @nocollapse */
    NgbTypeaheadModule.ctorParameters = [];
    return NgbTypeaheadModule;
}());
//# sourceMappingURL=typeahead.module.js.map