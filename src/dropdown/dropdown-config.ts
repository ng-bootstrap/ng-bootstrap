import {Injectable} from '@angular/core';

/**
 * Configuration service for the NgbDropdown directive.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the dropdowns used in the application.
 */
@Injectable()
export class NgbDropdownConfig {
  autoClose: boolean | 'outside' | 'inside' = true;
  placement = 'bottom-left';
}
