import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgbDate } from './ngb-date';
import { toInteger } from '../util/util';
import { NgbDatepickerI18n } from './datepicker-i18n';
import { NgbCalendar } from './ngb-calendar';
export var NgbDatepickerNavigationSelect = (function () {
    function NgbDatepickerNavigationSelect(i18n, calendar) {
        this.i18n = i18n;
        this.years = [];
        this.select = new EventEmitter();
        this.months = calendar.getMonths();
    }
    NgbDatepickerNavigationSelect.prototype.ngOnChanges = function (changes) {
        if (changes['maxYear'] || changes['minYear']) {
            this._generateYears();
        }
    };
    NgbDatepickerNavigationSelect.prototype.changeMonth = function (month) { this.select.emit(new NgbDate(this.date.year, toInteger(month), 1)); };
    NgbDatepickerNavigationSelect.prototype.changeYear = function (year) { this.select.emit(new NgbDate(toInteger(year), this.date.month, 1)); };
    NgbDatepickerNavigationSelect.prototype._generateYears = function () {
        var _this = this;
        this.years = Array.from({ length: this.maxYear - this.minYear + 1 }, function (e, i) { return _this.minYear + i; });
    };
    NgbDatepickerNavigationSelect.decorators = [
        { type: Component, args: [{
                    selector: 'ngb-datepicker-navigation-select',
                    styles: ["\n    select {\n      /* to align with btn-sm */\n      padding: 0.25rem 0.5rem;\n      font-size: 0.875rem;      \n      line-height: 1.25;\n      width: 50%;\n    }\n  "],
                    template: "\n    <select [disabled]=\"disabled\" class=\"custom-select d-inline-block\" [value]=\"date.month\" (change)=\"changeMonth($event.target.value)\">\n      <option *ngFor=\"let m of months\" [value]=\"m\">{{ i18n.getMonthName(m) }}</option>\n    </select>" +
                        "<select [disabled]=\"disabled\" class=\"custom-select d-inline-block\" [value]=\"date.year\" (change)=\"changeYear($event.target.value)\">\n      <option *ngFor=\"let y of years\" [value]=\"y\">{{ y }}</option>\n    </select> \n  " // template needs to be formatted in a certain way so we don't add empty text nodes
                },] },
    ];
    /** @nocollapse */
    NgbDatepickerNavigationSelect.ctorParameters = [
        { type: NgbDatepickerI18n, },
        { type: NgbCalendar, },
    ];
    NgbDatepickerNavigationSelect.propDecorators = {
        'date': [{ type: Input },],
        'disabled': [{ type: Input },],
        'maxYear': [{ type: Input },],
        'minYear': [{ type: Input },],
        'select': [{ type: Output },],
    };
    return NgbDatepickerNavigationSelect;
}());
//# sourceMappingURL=datepicker-navigation-select.js.map