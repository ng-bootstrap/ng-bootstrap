import { Injectable } from '@angular/core';
/**
 * Configuration service for the NgbDropdown directive.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the dropdowns used in the application.
 */
export var NgbDropdownConfig = (function () {
    function NgbDropdownConfig() {
        this.up = false;
        this.autoClose = true;
    }
    NgbDropdownConfig.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    NgbDropdownConfig.ctorParameters = [];
    return NgbDropdownConfig;
}());
//# sourceMappingURL=dropdown-config.js.map