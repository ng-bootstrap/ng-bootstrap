import { Component, Input } from '@angular/core';
export var NgbDatepickerDayView = (function () {
    function NgbDatepickerDayView() {
    }
    NgbDatepickerDayView.prototype.isMuted = function () { return !this.selected && (this.date.month !== this.currentMonth || this.disabled); };
    NgbDatepickerDayView.decorators = [
        { type: Component, args: [{
                    selector: '[ngbDatepickerDayView]',
                    styles: ["\n    :host {      \n      text-align: center;\n      padding: 0.185rem 0.25rem;      \n      border-radius: 0.25rem;\n    }\n  "],
                    host: { '[class.bg-primary]': 'selected', '[class.text-muted]': 'isMuted()', '[class.btn-secondary]': '!disabled' },
                    template: "{{ date.day }}"
                },] },
    ];
    /** @nocollapse */
    NgbDatepickerDayView.ctorParameters = [];
    NgbDatepickerDayView.propDecorators = {
        'currentMonth': [{ type: Input },],
        'date': [{ type: Input },],
        'disabled': [{ type: Input },],
        'selected': [{ type: Input },],
    };
    return NgbDatepickerDayView;
}());
//# sourceMappingURL=datepicker-day-view.js.map