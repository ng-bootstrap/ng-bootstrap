import {Injectable} from '@angular/core';

/**
 * Configuration service for the NgbPopover directive.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the popovers used in the application.
 */
@Injectable()
export class NgbPopoverConfig {
  placement: 'top' | 'bottom' | 'left' | 'right' = 'top';
  triggers = 'click';
}
