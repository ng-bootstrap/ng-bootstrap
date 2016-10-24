import { Component, Input, Output, EventEmitter } from '@angular/core';
import { toString } from '../util/util';
export var NgbTypeaheadWindow = (function () {
    function NgbTypeaheadWindow() {
        /**
         * An index of a match to be selected initially
         */
        this.activeIdx = 0;
        /**
         * A function used to format a given result before display. This function should return a formatted string without any
         * HTML markup
         */
        this.formatter = toString;
        /**
         * Event raised when user selects a particular result row
         */
        this.selectEvent = new EventEmitter();
    }
    NgbTypeaheadWindow.prototype.getActive = function () { return this.results[this.activeIdx]; };
    /**
     * @internal
     */
    NgbTypeaheadWindow.prototype.markActive = function (activeIdx) { this.activeIdx = activeIdx; };
    NgbTypeaheadWindow.prototype.next = function () { this.activeIdx = (this.activeIdx + 1) % this.results.length; };
    NgbTypeaheadWindow.prototype.prev = function () { this.activeIdx = (this.activeIdx <= 0 ? this.results.length - 1 : this.activeIdx - 1); };
    /**
     * @internal
     */
    NgbTypeaheadWindow.prototype.select = function (item) { this.selectEvent.emit(item); };
    NgbTypeaheadWindow.decorators = [
        { type: Component, args: [{
                    selector: 'ngb-typeahead-window',
                    exportAs: 'ngbTypeaheadWindow',
                    host: { 'class': 'dropdown-menu', 'style': 'display: block' },
                    template: "\n    <template #rt let-result=\"result\" let-term=\"term\" let-formatter=\"formatter\">\n      <ngb-highlight [result]=\"formatter(result)\" [term]=\"term\"></ngb-highlight>\n    </template>\n    <template ngFor [ngForOf]=\"results\" let-result let-idx=\"index\">\n      <button type=\"button\" class=\"dropdown-item\" [class.active]=\"idx === activeIdx\" \n        (mouseenter)=\"markActive(idx)\" \n        (click)=\"select(result)\">\n          <template [ngTemplateOutlet]=\"resultTemplate || rt\" \n          [ngOutletContext]=\"{result: result, term: term, formatter: formatter}\"></template>\n      </button>\n    </template>\n  "
                },] },
    ];
    /** @nocollapse */
    NgbTypeaheadWindow.ctorParameters = [];
    NgbTypeaheadWindow.propDecorators = {
        'activeIdx': [{ type: Input },],
        'results': [{ type: Input },],
        'term': [{ type: Input },],
        'formatter': [{ type: Input },],
        'resultTemplate': [{ type: Input },],
        'selectEvent': [{ type: Output, args: ['select',] },],
    };
    return NgbTypeaheadWindow;
}());
//# sourceMappingURL=typeahead-window.js.map