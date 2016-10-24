import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, TemplateRef, ContentChild } from '@angular/core';
import { NgbRatingConfig } from './rating-config';
/**
 * Rating directive that will take care of visualising a star rating bar.
 */
export var NgbRating = (function () {
    function NgbRating(config) {
        this.range = [];
        /**
         * An event fired when a user is hovering over a given rating.
         * Event's payload equals to the rating being hovered over.
         */
        this.hover = new EventEmitter();
        /**
         * An event fired when a user stops hovering over a given rating.
         * Event's payload equals to the rating of the last item being hovered over.
         */
        this.leave = new EventEmitter();
        /**
         * An event fired when a user selects a new rating.
         * Event's payload equals to the newly selected rating.
         */
        this.rateChange = new EventEmitter();
        this.max = config.max;
        this.readonly = config.readonly;
    }
    NgbRating.prototype.enter = function (value) {
        if (!this.readonly) {
            this.rate = value;
        }
        this.hover.emit(value);
    };
    NgbRating.prototype.getFillValue = function (index) {
        var diff = this.rate - index;
        if (diff >= 1) {
            return 100;
        }
        if (diff < 1 && diff > 0) {
            return Number.parseInt((diff * 100).toFixed(2));
        }
        return 0;
    };
    NgbRating.prototype.ngOnChanges = function (changes) {
        if (changes['rate']) {
            this._oldRate = this.rate;
        }
    };
    NgbRating.prototype.ngOnInit = function () { this.range = this._buildTemplateObjects(); };
    NgbRating.prototype.reset = function () {
        this.leave.emit(this.rate);
        this.rate = this._oldRate;
    };
    NgbRating.prototype.update = function (value) {
        if (!this.readonly) {
            this._oldRate = value;
            this.rate = value;
            this.rateChange.emit(value);
        }
    };
    NgbRating.prototype._buildTemplateObjects = function () {
        var range = [];
        for (var i = 1; i <= this.max; i++) {
            range.push({ title: i });
        }
        return range;
    };
    NgbRating.decorators = [
        { type: Component, args: [{
                    selector: 'ngb-rating',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    template: "\n    <template #t let-fill=\"fill\">{{ fill === 100 ? '&#9733;' : '&#9734;' }}</template>\n    <span tabindex=\"0\" (mouseleave)=\"reset()\" aria-valuemin=\"0\" [attr.aria-valuemax]=\"max\" [attr.aria-valuenow]=\"rate\">\n      <template ngFor let-r [ngForOf]=\"range\" let-index=\"index\">\n        <span class=\"sr-only\">({{ index < rate ? '*' : ' ' }})</span>\n        <span (mouseenter)=\"enter(index + 1)\" (click)=\"update(index + 1)\" [title]=\"r.title\" \n        [attr.aria-valuetext]=\"r.title\" \n        [style.cursor]=\"readonly ? 'default' : 'pointer'\">\n          <template [ngTemplateOutlet]=\"starTemplate || t\" [ngOutletContext]=\"{fill: getFillValue(index)}\"></template>\n        </span>\n      </template>\n    </span>\n  "
                },] },
    ];
    /** @nocollapse */
    NgbRating.ctorParameters = [
        { type: NgbRatingConfig, },
    ];
    NgbRating.propDecorators = {
        'max': [{ type: Input },],
        'rate': [{ type: Input },],
        'readonly': [{ type: Input },],
        'starTemplate': [{ type: Input }, { type: ContentChild, args: [TemplateRef,] },],
        'hover': [{ type: Output },],
        'leave': [{ type: Output },],
        'rateChange': [{ type: Output },],
    };
    return NgbRating;
}());
//# sourceMappingURL=rating.js.map