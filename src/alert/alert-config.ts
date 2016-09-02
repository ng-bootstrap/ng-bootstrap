import {Injectable} from '@angular/core';

/**
 * Configuration service for the NgbAlert component.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the alerts used in the application.
 */
@Injectable()
export class NgbAlertConfig {
  dismissible = true;
  type = 'warning';
}

/**
 * Configuration service for the NgbDismissibleAlert component.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the dismissible alerts used in the application.
 */
@Injectable()
export class NgbDismissibleAlertConfig {
  type = 'warning';
  dismissOnTimeout: number;
}
