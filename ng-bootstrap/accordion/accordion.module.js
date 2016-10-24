import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NGB_ACCORDION_DIRECTIVES } from './accordion';
import { NgbAccordionConfig } from './accordion-config';
export { NgbAccordionConfig } from './accordion-config';
export var NgbAccordionModule = (function () {
    function NgbAccordionModule() {
    }
    NgbAccordionModule.forRoot = function () { return { ngModule: NgbAccordionModule, providers: [NgbAccordionConfig] }; };
    NgbAccordionModule.decorators = [
        { type: NgModule, args: [{ declarations: NGB_ACCORDION_DIRECTIVES, exports: NGB_ACCORDION_DIRECTIVES, imports: [CommonModule] },] },
    ];
    /** @nocollapse */
    NgbAccordionModule.ctorParameters = [];
    return NgbAccordionModule;
}());
//# sourceMappingURL=accordion.module.js.map