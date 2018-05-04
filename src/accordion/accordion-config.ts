import {Injectable} from '@angular/core';
import {NgbAccordionModule} from './accordion.module';

/**
 * Configuration service for the NgbAccordion component.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the accordions used in the application.
 */
@Injectable({providedIn: 'root'})
export class NgbAccordionConfig {
  closeOthers = false;
  type: string;
}
