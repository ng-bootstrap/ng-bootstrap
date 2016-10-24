import { Injectable } from '@angular/core';
/**
 * Configuration service for the NgbDatepicker component.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the datepickers used in the application.
 */
export var NgbDatepickerConfig = (function () {
    function NgbDatepickerConfig() {
        this.firstDayOfWeek = 1;
        this.outsideDays = 'visible';
        this.showNavigation = true;
        this.showWeekdays = true;
        this.showWeekNumbers = false;
    }
    NgbDatepickerConfig.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    NgbDatepickerConfig.ctorParameters = [];
    return NgbDatepickerConfig;
}());
//# sourceMappingURL=datepicker-config.js.map