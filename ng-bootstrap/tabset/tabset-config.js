import { Injectable } from '@angular/core';
/**
 * Configuration service for the NgbTabset component.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the tabsets used in the application.
 */
export var NgbTabsetConfig = (function () {
    function NgbTabsetConfig() {
        this.type = 'tabs';
    }
    NgbTabsetConfig.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    NgbTabsetConfig.ctorParameters = [];
    return NgbTabsetConfig;
}());
//# sourceMappingURL=tabset-config.js.map