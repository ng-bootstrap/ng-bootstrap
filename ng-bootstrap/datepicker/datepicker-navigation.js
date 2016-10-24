import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NavigationEvent } from './datepicker-view-model';
import { NgbDatepickerI18n } from './datepicker-i18n';
import { NgbCalendar } from './ngb-calendar';
export var NgbDatepickerNavigation = (function () {
    function NgbDatepickerNavigation(i18n, _calendar) {
        this.i18n = i18n;
        this._calendar = _calendar;
        this.navigation = NavigationEvent;
        this.type = 'select';
        this.navigate = new EventEmitter();
        this.select = new EventEmitter();
    }
    NgbDatepickerNavigation.prototype.doNavigate = function (event) { this.navigate.emit(event); };
    NgbDatepickerNavigation.prototype.nextDisabled = function () {
        return this.disabled || (this.maxDate && this._calendar.getNext(this.date, 'm').after(this.maxDate));
    };
    NgbDatepickerNavigation.prototype.prevDisabled = function () {
        return this.disabled || (this.minDate && this._calendar.getPrev(this.date, 'm').before(this.minDate));
    };
    NgbDatepickerNavigation.prototype.selectDate = function (date) { this.select.emit(date); };
    NgbDatepickerNavigation.decorators = [
        { type: Component, args: [{
                    selector: '[ngbDatepickerNavigation]',
                    styles: ["\n    td {\n      text-align: center;\n      padding-bottom: 0.25rem;\n    }\n  "],
                    template: "\n    <tr>\n      <td>\n        <button type=\"button\" (click)=\"doNavigate(navigation.PREV)\" class=\"btn btn-sm btn-secondary btn-block\" \n          [disabled]=\"prevDisabled()\">&lt;</button>\n      </td>\n      <td [attr.colspan]=\"showWeekNumbers ? 6 : 5\">      \n        <ngb-datepicker-navigation-select *ngIf=\"type === 'select'\"\n          [date]=\"date\"\n          [minYear]=\"minDate.year\"\n          [maxYear]=\"maxDate.year\"\n          [disabled] = \"disabled\"\n          (select)=\"selectDate($event)\">\n        </ngb-datepicker-navigation-select>\n      </td>\n      <td>\n        <button type=\"button\" (click)=\"doNavigate(navigation.NEXT)\" class=\"btn btn-sm btn-secondary btn-block\" \n          [disabled]=\"nextDisabled()\">&gt;</button>\n      </td>\n    </tr>\n  "
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
        'showWeekNumbers': [{ type: Input },],
        'type': [{ type: Input },],
        'navigate': [{ type: Output },],
        'select': [{ type: Output },],
    };
    return NgbDatepickerNavigation;
}());
//# sourceMappingURL=datepicker-navigation.js.map