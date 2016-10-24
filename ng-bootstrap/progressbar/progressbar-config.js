import { Injectable } from '@angular/core';
/**
 * Configuration service for the NgbProgressbar component.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the progress bars used in the application.
 */
export var NgbProgressbarConfig = (function () {
    function NgbProgressbarConfig() {
        this.max = 100;
        this.animated = false;
        this.striped = false;
    }
    NgbProgressbarConfig.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    NgbProgressbarConfig.ctorParameters = [];
    return NgbProgressbarConfig;
}());
//# sourceMappingURL=progressbar-config.js.map