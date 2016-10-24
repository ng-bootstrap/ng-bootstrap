import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { regExpEscape, toString } from '../util/util';
export var NgbHighlight = (function () {
    function NgbHighlight() {
        this.highlightClass = 'ngb-highlight';
    }
    NgbHighlight.prototype.ngOnChanges = function (changes) {
        var resultStr = toString(this.result);
        var resultLC = resultStr.toLowerCase();
        var termLC = toString(this.term).toLowerCase();
        var currentIdx = 0;
        if (termLC.length > 0) {
            this.parts = resultLC.split(new RegExp("(" + regExpEscape(termLC) + ")")).map(function (part) {
                var originalPart = resultStr.substr(currentIdx, part.length);
                currentIdx += part.length;
                return originalPart;
            });
        }
        else {
            this.parts = [resultStr];
        }
    };
    NgbHighlight.decorators = [
        { type: Component, args: [{
                    selector: 'ngb-highlight',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    template: "<template ngFor [ngForOf]=\"parts\" let-part let-isOdd=\"odd\">" +
                        "<span *ngIf=\"isOdd\" class=\"{{highlightClass}}\">{{part}}</span><template [ngIf]=\"!isOdd\">{{part}}</template>" +
                        "</template>",
                    styles: ["\n    .ngb-highlight {\n      font-weight: bold;\n    }\n  "]
                },] },
    ];
    /** @nocollapse */
    NgbHighlight.ctorParameters = [];
    NgbHighlight.propDecorators = {
        'highlightClass': [{ type: Input },],
        'result': [{ type: Input },],
        'term': [{ type: Input },],
    };
    return NgbHighlight;
}());
//# sourceMappingURL=highlight.js.map