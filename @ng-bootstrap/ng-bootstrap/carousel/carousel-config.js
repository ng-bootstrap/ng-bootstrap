import { Injectable } from '@angular/core';
/**
 * Configuration service for the NgbCarousel component.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the carousels used in the application.
 */
export var NgbCarouselConfig = (function () {
    function NgbCarouselConfig() {
        this.interval = 5000;
        this.wrap = true;
        this.keyboard = true;
    }
    NgbCarouselConfig.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    NgbCarouselConfig.ctorParameters = [];
    return NgbCarouselConfig;
}());
//# sourceMappingURL=carousel-config.js.map