import { EventEmitter } from '@angular/core';
import { NgbAlertConfig } from './alert-config';
/**
 * Alerts can be used to provide feedback messages.
 */
export declare class NgbAlert {
    /**
     * A flag indicating if a given alert can be dismissed (closed) by a user. If this flag is set, a close button (in a
     * form of an ×) will be displayed.
     */
    dismissible: boolean;
    /**
     * Alert type (CSS class). Bootstrap 4 recognizes the following types: "success", "info", "warning" and "danger".
     */
    type: string;
    /**
     * An event emitted when the close button is clicked. This event has no payload. Only relevant for dismissible alerts.
     */
    close: EventEmitter<{}>;
    constructor(config: NgbAlertConfig);
    closeHandler(): void;
}
