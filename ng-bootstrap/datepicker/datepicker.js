import { Component, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgbCalendar } from './ngb-calendar';
import { NgbDate } from './ngb-date';
import { NgbDatepickerService } from './datepicker-service';
import { NavigationEvent } from './datepicker-view-model';
import { toInteger } from '../util/util';
import { NgbDatepickerConfig } from './datepicker-config';
var NGB_DATEPICKER_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(function () { return NgbDatepicker; }),
    multi: true
};
/**
 * A lightweight and highly configurable datepicker directive
 */
export var NgbDatepicker = (function () {
    function NgbDatepicker(_service, _calendar, config) {
        this._service = _service;
        this._calendar = _calendar;
        this.disabled = false;
        this.onChange = function (_) { };
        this.onTouched = function () { };
        this.dayTemplate = config.dayTemplate;
        this.firstDayOfWeek = config.firstDayOfWeek;
        this.markDisabled = config.markDisabled;
        this.minDate = config.minDate;
        this.maxDate = config.maxDate;
        this.outsideDays = config.outsideDays;
        this.showNavigation = config.showNavigation;
        this.showWeekdays = config.showWeekdays;
        this.showWeekNumbers = config.showWeekNumbers;
        this.startDate = config.startDate;
    }
    /**
     * Navigates current view to provided date.
     * With default calendar we use ISO 8601: 'month' is 1=Jan ... 12=Dec.
     * If nothing provided calendar will open current month.
     * Use 'startDate' input as an alternative
     */
    NgbDatepicker.prototype.navigateTo = function (date) {
        this._setViewWithinLimits(date ? NgbDate.from(date) : this._calendar.getToday());
        this._updateData();
    };
    NgbDatepicker.prototype.ngOnInit = function () {
        this._setDates();
        this.navigateTo(this.startDate);
    };
    NgbDatepicker.prototype.ngOnChanges = function () {
        this._setDates();
        this.navigateTo(this.startDate);
    };
    NgbDatepicker.prototype.onDateSelect = function (date) {
        this._setViewWithinLimits(date);
        this.onTouched();
        this.writeValue(date);
        this.onChange({ year: date.year, month: date.month, day: date.day });
        // switch current month
        if (this._date.month !== this.month.number) {
            this._updateData();
        }
    };
    NgbDatepicker.prototype.onNavigateDateSelect = function (date) {
        this._setViewWithinLimits(date);
        this._updateData();
    };
    NgbDatepicker.prototype.onNavigateEvent = function (event) {
        switch (event) {
            case NavigationEvent.PREV:
                this._setViewWithinLimits(this._calendar.getPrev(this._date, 'm'));
                break;
            case NavigationEvent.NEXT:
                this._setViewWithinLimits(this._calendar.getNext(this._date, 'm'));
                break;
        }
        this._updateData();
    };
    NgbDatepicker.prototype.registerOnChange = function (fn) { this.onChange = fn; };
    NgbDatepicker.prototype.registerOnTouched = function (fn) { this.onTouched = fn; };
    NgbDatepicker.prototype.writeValue = function (value) { this.model = value ? new NgbDate(value.year, value.month, value.day) : null; };
    NgbDatepicker.prototype.setDisabledState = function (isDisabled) { this.disabled = isDisabled; };
    NgbDatepicker.prototype._setDates = function () {
        this._maxDate = NgbDate.from(this.maxDate);
        this._minDate = NgbDate.from(this.minDate);
        this._date = this.startDate ? NgbDate.from(this.startDate) : this._calendar.getToday();
        if (!this._minDate) {
            this._minDate = this._calendar.getPrev(this._date, 'y', 10);
        }
        if (!this._maxDate) {
            this._maxDate = this._calendar.getNext(this._date, 'y', 11);
            this._maxDate = this._calendar.getPrev(this._maxDate);
        }
        if (this._minDate && this._maxDate && this._maxDate.before(this._minDate)) {
            throw new Error("'maxDate' " + this._maxDate + " should be greater than 'minDate' " + this._minDate);
        }
    };
    NgbDatepicker.prototype._setViewWithinLimits = function (date) {
        if (this._minDate && date.before(this._minDate)) {
            this._date = new NgbDate(this._minDate.year, this._minDate.month, 1);
        }
        else if (this._maxDate && date.after(this._maxDate)) {
            this._date = new NgbDate(this._maxDate.year, this._maxDate.month, 1);
        }
        else {
            this._date = new NgbDate(date.year, date.month, 1);
        }
    };
    NgbDatepicker.prototype._updateData = function () {
        this.month = this._service.generateMonthViewModel(this._date, this._minDate, this._maxDate, toInteger(this.firstDayOfWeek), this.markDisabled);
    };
    NgbDatepicker.decorators = [
        { type: Component, args: [{
                    exportAs: 'ngbDatepicker',
                    selector: 'ngb-datepicker',
                    template: "\n    <template #dt let-date=\"date\" let-currentMonth=\"currentMonth\" let-selected=\"selected\" let-disabled=\"disabled\">\n       <div ngbDatepickerDayView [date]=\"date\" [currentMonth]=\"currentMonth\" [selected]=\"selected\" [disabled]=\"disabled\"></div>\n    </template>\n    \n    <table>\n      <tbody *ngIf=\"showNavigation\" ngbDatepickerNavigation\n        [date]=\"_date\"\n        [minDate]=\"_minDate\"\n        [maxDate]=\"_maxDate\"\n        [disabled]=\"disabled\"\n        [showWeekNumbers]=\"showWeekNumbers\"\n        (navigate)=\"onNavigateEvent($event)\"\n        (select)=\"onNavigateDateSelect($event)\">\n      </tbody>\n      \n      <tbody ngbDatepickerMonthView\n        [month]=\"month\"\n        [selectedDate]=\"model\"\n        [dayTemplate]=\"dayTemplate || dt\"\n        [showWeekdays]=\"showWeekdays\"\n        [showWeekNumbers]=\"showWeekNumbers\"\n        [disabled]=\"disabled\"\n        [outsideDays]=\"outsideDays\"\n        (select)=\"onDateSelect($event)\">\n      </tbody>\n    </table>\n  ",
                    providers: [NGB_DATEPICKER_VALUE_ACCESSOR]
                },] },
    ];
    /** @nocollapse */
    NgbDatepicker.ctorParameters = [
        { type: NgbDatepickerService, },
        { type: NgbCalendar, },
        { type: NgbDatepickerConfig, },
    ];
    NgbDatepicker.propDecorators = {
        'dayTemplate': [{ type: Input },],
        'firstDayOfWeek': [{ type: Input },],
        'markDisabled': [{ type: Input },],
        'minDate': [{ type: Input },],
        'maxDate': [{ type: Input },],
        'outsideDays': [{ type: Input },],
        'showNavigation': [{ type: Input },],
        'showWeekdays': [{ type: Input },],
        'showWeekNumbers': [{ type: Input },],
        'startDate': [{ type: Input },],
    };
    return NgbDatepicker;
}());
//# sourceMappingURL=datepicker.js.map