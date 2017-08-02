var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Injectable } from '@angular/core';
var WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
/**
 * Type of the service supplying month and weekday names to to NgbDatepicker component.
 * See the i18n demo for how to extend this class and define a custom provider for i18n.
 */
export var NgbDatepickerI18n = (function () {
    function NgbDatepickerI18n() {
    }
    NgbDatepickerI18n.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    NgbDatepickerI18n.ctorParameters = [];
    return NgbDatepickerI18n;
}());
export var NgbDatepickerI18nDefault = (function (_super) {
    __extends(NgbDatepickerI18nDefault, _super);
    function NgbDatepickerI18nDefault() {
        _super.apply(this, arguments);
    }
    NgbDatepickerI18nDefault.prototype.getWeekdayName = function (weekday) { return WEEKDAYS[weekday - 1]; };
    NgbDatepickerI18nDefault.prototype.getMonthName = function (month) { return MONTHS[month - 1]; };
    NgbDatepickerI18nDefault.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    NgbDatepickerI18nDefault.ctorParameters = [];
    return NgbDatepickerI18nDefault;
}(NgbDatepickerI18n));
//# sourceMappingURL=datepicker-i18n.js.map