import {Injectable} from '@angular/core';
import {PlacementArray} from '../util/positioning';

/**
 * Configuration service for the NgbPopover directive.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the popovers used in the application.
 */
@Injectable({providedIn: 'root'})
export class NgbPopoverConfig {
  autoClose: boolean | 'inside' | 'outside' = true;
  placement: PlacementArray = 'auto';
  triggers = 'click';
  container: string;
  disablePopover = false;
  popoverClass: string;
}
