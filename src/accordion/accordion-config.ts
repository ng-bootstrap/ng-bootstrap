import {Injectable} from '@angular/core';
import {NgbConfig} from '../ngb-config';

/**
 * A configuration service for the [NgbAccordion](#/components/accordion/api#NgbAccordion) component.
 *
 * You can inject this service, typically in your root component, and customize its properties
 * to provide default values for all accordions used in the application.
 */
@Injectable({providedIn: 'root'})
export class NgbAccordionConfig {
  animation: boolean;
  closeOthers = false;
  type: string;

  constructor(ngbConfig: NgbConfig) { this.animation = ngbConfig.animation; }
}
