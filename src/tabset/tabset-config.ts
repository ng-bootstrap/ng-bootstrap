import {Injectable} from '@angular/core';

/**
 * Configuration service for the NgbTabset component.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the tabsets used in the application.
 */
@Injectable()
export class NgbTabsetConfig {
  justify: 'start' | 'center' | 'end' = 'start';
  type: 'tabs' | 'pills' = 'tabs';
}
