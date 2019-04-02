import {Injectable} from '@angular/core';

/**
 * A configuration service for the [NgbAlert](#/components/alert/api#NgbAlert) component.
 *
 * You can inject this service, typically in your root component, and customize its properties
 * to provide default values for all alerts used in the application.
 */
@Injectable({providedIn: 'root'})
export class NgbAlertConfig {
  dismissible = true;
  type = 'warning';
}
