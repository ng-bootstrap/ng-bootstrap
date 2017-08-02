import { NgModule } from '@angular/core';
import { NgbDropdown, NgbDropdownToggle } from './dropdown';
import { NgbDropdownConfig } from './dropdown-config';
export { NgbDropdown, NgbDropdownToggle } from './dropdown';
export { NgbDropdownConfig } from './dropdown-config';
var NGB_DROPDOWN_DIRECTIVES = [NgbDropdownToggle, NgbDropdown];
export var NgbDropdownModule = (function () {
    function NgbDropdownModule() {
    }
    NgbDropdownModule.forRoot = function () { return { ngModule: NgbDropdownModule, providers: [NgbDropdownConfig] }; };
    NgbDropdownModule.decorators = [
        { type: NgModule, args: [{ declarations: NGB_DROPDOWN_DIRECTIVES, exports: NGB_DROPDOWN_DIRECTIVES },] },
    ];
    /** @nocollapse */
    NgbDropdownModule.ctorParameters = [];
    return NgbDropdownModule;
}());
//# sourceMappingURL=dropdown.module.js.map