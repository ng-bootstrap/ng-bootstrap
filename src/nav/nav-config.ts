import {Injectable} from '@angular/core';

/**
 * A configuration service for the [`NgbNav`](#/components/tabset/api#NgbNav) component.
 *
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the navs used in the application.
 */
@Injectable({providedIn: 'root'})
export class NgbNavConfig {
  destroyOnHide = true;
}
