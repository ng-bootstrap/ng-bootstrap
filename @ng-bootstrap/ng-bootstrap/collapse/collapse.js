import { Directive, Input } from '@angular/core';
/**
 * The NgbCollapse directive provides a simple way to hide and show an element with animations.
 */
export var NgbCollapse = (function () {
    function NgbCollapse() {
        /**
         * A flag indicating collapsed (true) or open (false) state.
         */
        this.collapsed = false;
    }
    NgbCollapse.decorators = [
        { type: Directive, args: [{
                    selector: '[ngbCollapse]',
                    exportAs: 'ngbCollapse',
                    host: { '[class.collapse]': 'true', '[class.in]': '!collapsed', '[attr.aria-expanded]': '!collapsed' }
                },] },
    ];
    /** @nocollapse */
    NgbCollapse.ctorParameters = [];
    NgbCollapse.propDecorators = {
        'collapsed': [{ type: Input, args: ['ngbCollapse',] },],
    };
    return NgbCollapse;
}());
//# sourceMappingURL=collapse.js.map