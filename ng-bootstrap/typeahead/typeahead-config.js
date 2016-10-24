import { Injectable } from '@angular/core';
/**
 * Configuration service for the NgbTypeahead component.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the typeaheads used in the application.
 */
export var NgbTypeaheadConfig = (function () {
    function NgbTypeaheadConfig() {
        this.editable = true;
        this.focusFirst = true;
        this.showHint = false;
    }
    NgbTypeaheadConfig.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    NgbTypeaheadConfig.ctorParameters = [];
    return NgbTypeaheadConfig;
}());
//# sourceMappingURL=typeahead-config.js.map