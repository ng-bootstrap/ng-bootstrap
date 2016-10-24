import { Injectable } from '@angular/core';
/**
 * Configuration service for the NgbPagination component.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the paginations used in the application.
 */
export var NgbPaginationConfig = (function () {
    function NgbPaginationConfig() {
        this.boundaryLinks = false;
        this.directionLinks = true;
        this.ellipses = true;
        this.maxSize = 0;
        this.pageSize = 10;
        this.rotate = false;
    }
    NgbPaginationConfig.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    NgbPaginationConfig.ctorParameters = [];
    return NgbPaginationConfig;
}());
//# sourceMappingURL=pagination-config.js.map