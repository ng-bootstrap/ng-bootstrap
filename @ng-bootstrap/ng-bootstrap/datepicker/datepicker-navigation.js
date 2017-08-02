import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NavigationEvent } from './datepicker-view-model';
import { NgbDatepickerI18n } from './datepicker-i18n';
import { NgbCalendar } from './ngb-calendar';
export var NgbDatepickerNavigation = (function () {
    function NgbDatepickerNavigation(i18n, _calendar) {
        this.i18n = i18n;
        this._calendar = _calendar;
        this.navigation = NavigationEvent;
        this.navigate = new EventEmitter();
        this.select = new EventEmitter();
    }
    NgbDatepickerNavigation.prototype.doNavigate = function (event) { this.navigate.emit(event); };
    NgbDatepickerNavigation.prototype.nextDisabled = function () {
        return this.disabled || (this.maxDate && this._calendar.getNext(this.date, 'm').after(this.maxDate));
    };
    NgbDatepickerNavigation.prototype.prevDisabled = function () {
        var prevDate = this._calendar.getPrev(this.date, 'm');
        return this.disabled || (this.minDate && prevDate.year <= this.minDate.year && prevDate.month < this.minDate.month);
    };
    NgbDatepickerNavigation.prototype.selectDate = function (date) { this.select.emit(date); };
    NgbDatepickerNavigation.decorators = [
        { type: Component, args: [{
                    selector: 'ngb-datepicker-navigation',
                    styles: ["\n    .collapsed {\n        margin-bottom: -1.7rem;\n    }\n  "],
                    template: "\n    <table class=\"w-100\" [class.collapsed]=\"!showSelect\">\n      <tr>\n        <td class=\"text-sm-left\">\n          <button type=\"button\" (click)=\"doNavigate(navigation.PREV)\" class=\"btn btn-sm btn-secondary btn-inline\" \n            [disabled]=\"prevDisabled()\">&lt;</button>\n        </td>\n        \n        <td *ngIf=\"showSelect\">\n          <ngb-datepicker-navigation-select\n            [date]=\"date\"\n            [minDate]=\"minDate\"\n            [maxDate]=\"maxDate\"\n            [disabled] = \"disabled\"\n            (select)=\"selectDate($event)\">\n          </ngb-datepicker-navigation-select>\n        </td>        \n        \n        <td class=\"text-sm-right\">\n          <button type=\"button\" (click)=\"doNavigate(navigation.NEXT)\" class=\"next btn btn-sm btn-secondary btn-inline\" \n            [disabled]=\"nextDisabled()\">&gt;</button>\n        </td>\n      </tr>\n    </table>\n  "
                },] },
    ];
    /** @nocollapse */
    NgbDatepickerNavigation.ctorParameters = [
        { type: NgbDatepickerI18n, },
        { type: NgbCalendar, },
    ];
    NgbDatepickerNavigation.propDecorators = {
        'date': [{ type: Input },],
        'disabled': [{ type: Input },],
        'maxDate': [{ type: Input },],
        'minDate': [{ type: Input },],
        'showSelect': [{ type: Input },],
        'showWeekNumbers': [{ type: Input },],
        'navigate': [{ type: Output },],
        'select': [{ type: Output },],
    };
    return NgbDatepickerNavigation;
}());
//# sourceMappingURL=datepicker-navigation.js.map