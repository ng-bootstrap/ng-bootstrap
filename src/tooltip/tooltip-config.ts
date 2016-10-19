import {Injectable} from '@angular/core';

/**
 * Configuration service for the NgbTooltip directive.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the tooltips used in the application.
 */
@Injectable()
export class NgbTooltipConfig {
  placement: 'top' | 'bottom' | 'left' | 'right' = 'top';
  triggers = 'hover';
  container: string;
}
