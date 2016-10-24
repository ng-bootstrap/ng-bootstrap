import { Component, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { isNumber, padNumber, toInteger } from '../util/util';
import { NgbTime } from './ngb-time';
import { NgbTimepickerConfig } from './timepicker-config';
var NGB_TIMEPICKER_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(function () { return NgbTimepicker; }),
    multi: true
};
/**
 * A lightweight & configurable timepicker directive.
 */
export var NgbTimepicker = (function () {
    function NgbTimepicker(config) {
        this.onChange = function (_) { };
        this.onTouched = function () { };
        this.meridian = config.meridian;
        this.spinners = config.spinners;
        this.seconds = config.seconds;
        this.hourStep = config.hourStep;
        this.minuteStep = config.minuteStep;
        this.secondStep = config.secondStep;
        this.disabled = config.disabled;
        this.readonlyInputs = config.readonlyInputs;
    }
    NgbTimepicker.prototype.writeValue = function (value) {
        this.model = value ? new NgbTime(value.hour, value.minute, value.second) : new NgbTime();
        if (!this.seconds && (!value || !isNumber(value.second))) {
            this.model.second = 0;
        }
    };
    NgbTimepicker.prototype.registerOnChange = function (fn) { this.onChange = fn; };
    NgbTimepicker.prototype.registerOnTouched = function (fn) { this.onTouched = fn; };
    NgbTimepicker.prototype.setDisabledState = function (isDisabled) { this.disabled = isDisabled; };
    NgbTimepicker.prototype.changeHour = function (step) {
        this.model.changeHour(step);
        this.propagateModelChange();
    };
    NgbTimepicker.prototype.changeMinute = function (step) {
        this.model.changeMinute(step);
        this.propagateModelChange();
    };
    NgbTimepicker.prototype.changeSecond = function (step) {
        this.model.changeSecond(step);
        this.propagateModelChange();
    };
    NgbTimepicker.prototype.updateHour = function (newVal) {
        this.model.updateHour(toInteger(newVal));
        this.propagateModelChange();
    };
    NgbTimepicker.prototype.updateMinute = function (newVal) {
        this.model.updateMinute(toInteger(newVal));
        this.propagateModelChange();
    };
    NgbTimepicker.prototype.updateSecond = function (newVal) {
        this.model.updateSecond(toInteger(newVal));
        this.propagateModelChange();
    };
    NgbTimepicker.prototype.toggleMeridian = function () {
        if (this.meridian) {
            this.changeHour(12);
        }
    };
    NgbTimepicker.prototype.formatHour = function (value) { return padNumber(isNumber(value) ? (value % (this.meridian ? 12 : 24)) : NaN); };
    NgbTimepicker.prototype.formatMinSec = function (value) { return padNumber(value); };
    NgbTimepicker.prototype.ngOnChanges = function (changes) {
        if (changes['seconds'] && !this.seconds && this.model && !isNumber(this.model.second)) {
            this.model.second = 0;
            this.propagateModelChange(false);
        }
    };
    NgbTimepicker.prototype.propagateModelChange = function (touched) {
        if (touched === void 0) { touched = true; }
        if (touched) {
            this.onTouched();
        }
        if (this.model.isValid(this.seconds)) {
            this.onChange({ hour: this.model.hour, minute: this.model.minute, second: this.model.second });
        }
        else {
            this.onChange(null);
        }
    };
    NgbTimepicker.decorators = [
        { type: Component, args: [{
                    selector: 'ngb-timepicker',
                    styles: ["\n    .chevron::before {\n      border-style: solid;\n      border-width: 0.29em 0.29em 0 0;\n      content: '';\n      display: inline-block;\n      height: 0.69em;\n      left: 0.05em;\n      position: relative;\n      top: 0.15em;\n      transform: rotate(-45deg);\n      -webkit-transform: rotate(-45deg);\n      -ms-transform: rotate(-45deg);\n      vertical-align: middle;\n      width: 0.71em;\n    }\n    \n    .chevron.bottom:before {\n      top: -.3em;\n      -webkit-transform: rotate(135deg);\n      -ms-transform: rotate(135deg);\n      transform: rotate(135deg);\n    }\n    \n    .btn-link {\n      outline: 0;\n    }\n\n    .btn-link.disabled {\n      cursor: not-allowed;\n      opacity: .65;\n    }\n  "],
                    template: "\n     <fieldset [disabled]=\"disabled\" [class.disabled]=\"disabled\">\n      <table>\n        <tr *ngIf=\"spinners\">\n          <td class=\"text-xs-center\">\n            <button type=\"button\" class=\"btn-link\" (click)=\"changeHour(hourStep)\"\n              [disabled]=\"disabled\" [class.disabled]=\"disabled\">\n              <span class=\"chevron\"></span>\n            </button>\n          </td>\n          <td>&nbsp;</td>\n          <td class=\"text-xs-center\">\n            <button type=\"button\" class=\"btn-link\" (click)=\"changeMinute(minuteStep)\"\n              [disabled]=\"disabled\" [class.disabled]=\"disabled\">\n                <span class=\"chevron\"></span>\n            </button>\n          </td>\n          <template [ngIf]=\"seconds\">\n            <td>&nbsp;</td>\n            <td class=\"text-xs-center\">\n              <button type=\"button\" class=\"btn-link\" (click)=\"changeSecond(secondStep)\"\n                [disabled]=\"disabled\" [class.disabled]=\"disabled\">\n                <span class=\"chevron\"></span>\n              </button>\n            </td>\n          </template>\n          <template [ngIf]=\"meridian\">\n            <td>&nbsp;</td>\n            <td>&nbsp;</td>\n          </template>\n        </tr>\n        <tr>\n          <td>\n            <input type=\"text\" class=\"form-control\" maxlength=\"2\" size=\"2\" placeholder=\"HH\"\n              [value]=\"formatHour(model?.hour)\" (change)=\"updateHour($event.target.value)\" \n              [readonly]=\"readonlyInputs\" [disabled]=\"disabled\">\n          </td>\n          <td>&nbsp;:&nbsp;</td>\n          <td>\n            <input type=\"text\" class=\"form-control\" maxlength=\"2\" size=\"2\" placeholder=\"MM\"\n              [value]=\"formatMinSec(model?.minute)\" (change)=\"updateMinute($event.target.value)\" \n              [readonly]=\"readonlyInputs\" [disabled]=\"disabled\">\n          </td>\n          <template [ngIf]=\"seconds\">\n            <td>&nbsp;:&nbsp;</td>\n            <input type=\"text\" class=\"form-control\" maxlength=\"2\" size=\"2\" placeholder=\"SS\"\n              [value]=\"formatMinSec(model?.second)\" (change)=\"updateSecond($event.target.value)\" \n              [readonly]=\"readonlyInputs\" [disabled]=\"disabled\">\n          </template>\n          <template [ngIf]=\"meridian\">\n            <td>&nbsp;&nbsp;</td>\n            <td>\n              <button type=\"button\" class=\"btn btn-outline-primary\" (click)=\"toggleMeridian()\">{{model.hour > 12 ? 'PM' : 'AM'}}</button>\n            </td>\n          </template>\n        </tr>\n        <tr *ngIf=\"spinners\">\n          <td class=\"text-xs-center\">\n            <button type=\"button\" class=\"btn-link\" (click)=\"changeHour(-hourStep)\" \n              [disabled]=\"disabled\" [class.disabled]=\"disabled\">\n              <span class=\"chevron bottom\"></span>\n            </button>\n          </td>\n          <td>&nbsp;</td>\n          <td class=\"text-xs-center\">\n            <button type=\"button\" class=\"btn-link\" (click)=\"changeMinute(-minuteStep)\"\n              [disabled]=\"disabled\" [class.disabled]=\"disabled\">\n              <span class=\"chevron bottom\"></span>\n            </button>\n          </td>\n          <template [ngIf]=\"seconds\">\n            <td>&nbsp;</td>\n            <td class=\"text-xs-center\">\n              <button type=\"button\" class=\"btn-link\" (click)=\"changeSecond(-secondStep)\"\n                [disabled]=\"disabled\" [class.disabled]=\"disabled\">\n                <span class=\"chevron bottom\"></span>\n              </button>\n            </td>\n          </template>\n          <template [ngIf]=\"meridian\">\n            <td>&nbsp;</td>\n            <td>&nbsp;</td>\n          </template>\n        </tr>\n      </table>\n    </fieldset>\n  ",
                    providers: [NGB_TIMEPICKER_VALUE_ACCESSOR]
                },] },
    ];
    /** @nocollapse */
    NgbTimepicker.ctorParameters = [
        { type: NgbTimepickerConfig, },
    ];
    NgbTimepicker.propDecorators = {
        'meridian': [{ type: Input },],
        'spinners': [{ type: Input },],
        'seconds': [{ type: Input },],
        'hourStep': [{ type: Input },],
        'minuteStep': [{ type: Input },],
        'secondStep': [{ type: Input },],
        'readonlyInputs': [{ type: Input },],
    };
    return NgbTimepicker;
}());
//# sourceMappingURL=timepicker.js.map