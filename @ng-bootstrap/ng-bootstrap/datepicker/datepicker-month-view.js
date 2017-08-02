import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgbDate } from './ngb-date';
import { NgbDatepickerI18n } from './datepicker-i18n';
export var NgbDatepickerMonthView = (function () {
    function NgbDatepickerMonthView(i18n) {
        this.i18n = i18n;
        this.select = new EventEmitter();
    }
    NgbDatepickerMonthView.prototype.doSelect = function (day) {
        if (!this.isDisabled(day) && !this.isCollapsed(day) && !this.isHidden(day)) {
            this.select.emit(NgbDate.from(day.date));
        }
    };
    NgbDatepickerMonthView.prototype.isDisabled = function (day) { return this.disabled || day.disabled; };
    NgbDatepickerMonthView.prototype.isSelected = function (date) { return this.selectedDate && this.selectedDate.equals(date); };
    NgbDatepickerMonthView.prototype.isCollapsed = function (day) { return this.outsideDays === 'collapsed' && this.month.number !== day.date.month; };
    NgbDatepickerMonthView.prototype.isHidden = function (day) { return this.outsideDays === 'hidden' && this.month.number !== day.date.month; };
    NgbDatepickerMonthView.decorators = [
        { type: Component, args: [{
                    selector: 'ngb-datepicker-month-view',
                    styles: ["\n    .weekday {\n    }\n    .weeknumber {\n    }\n    .day {\n      padding: 0;\n      height: 100%;\n      cursor: pointer;\n    }\n    .day.disabled, .day.hidden, .day.collapsed {\n      cursor: default;\n    }\n    :host/deep/.day.collapsed > * {\n      display: none;\n    }\n    :host/deep/.day.hidden > * {\n      visibility: hidden;\n    }\n  "],
                    template: "\n    <table>\n      <tr *ngIf=\"showWeekdays\">\n        <td *ngIf=\"showWeekNumbers\"></td>\n        <td *ngFor=\"let w of month.weekdays\" class=\"weekday text-xs-center font-weight-bold\">{{ i18n.getWeekdayName(w) }}</td>\n      </tr>\n      <tr *ngFor=\"let week of month.weeks\">\n        <td *ngIf=\"showWeekNumbers\" class=\"weeknumber small text-xs-center\">{{ week.number }}</td>\n        <td *ngFor=\"let day of week.days\" (click)=\"doSelect(day)\" class=\"day\" [class.disabled]=\"isDisabled(day)\"\n        [class.collapsed]=\"isCollapsed(day)\" [class.hidden]=\"isHidden(day)\">\n            <template [ngTemplateOutlet]=\"dayTemplate\"\n            [ngOutletContext]=\"{date: {year: day.date.year, month: day.date.month, day: day.date.day},\n              currentMonth: month.number,\n              disabled: isDisabled(day),\n              selected: isSelected(day.date)}\">\n            </template>\n        </td>\n      </tr>\n    </table>\n  "
                },] },
    ];
    /** @nocollapse */
    NgbDatepickerMonthView.ctorParameters = [
        { type: NgbDatepickerI18n, },
    ];
    NgbDatepickerMonthView.propDecorators = {
        'dayTemplate': [{ type: Input },],
        'disabled': [{ type: Input },],
        'month': [{ type: Input },],
        'outsideDays': [{ type: Input },],
        'selectedDate': [{ type: Input },],
        'showWeekdays': [{ type: Input },],
        'showWeekNumbers': [{ type: Input },],
        'select': [{ type: Output },],
    };
    return NgbDatepickerMonthView;
}());
//# sourceMappingURL=datepicker-month-view.js.map