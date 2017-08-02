import { Injectable } from '@angular/core';
/**
 * Configuration service for the NgbPopover directive.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the popovers used in the application.
 */
export var NgbPopoverConfig = (function () {
    function NgbPopoverConfig() {
        this.placement = 'top';
        this.triggers = 'click';
    }
    NgbPopoverConfig.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    NgbPopoverConfig.ctorParameters = [];
    return NgbPopoverConfig;
}());
//# sourceMappingURL=popover-config.js.map