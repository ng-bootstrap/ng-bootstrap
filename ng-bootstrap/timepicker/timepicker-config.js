import { Injectable } from '@angular/core';
/**
 * Configuration service for the NgbTimepicker component.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the timepickers used in the application.
 */
export var NgbTimepickerConfig = (function () {
    function NgbTimepickerConfig() {
        this.meridian = false;
        this.spinners = true;
        this.seconds = false;
        this.hourStep = 1;
        this.minuteStep = 1;
        this.secondStep = 1;
        this.disabled = false;
        this.readonlyInputs = false;
    }
    NgbTimepickerConfig.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    NgbTimepickerConfig.ctorParameters = [];
    return NgbTimepickerConfig;
}());
//# sourceMappingURL=timepicker-config.js.map