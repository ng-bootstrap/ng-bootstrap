import {Injectable} from '@angular/core';

/**
 * Configuration service for the NgbProgressbar component.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the progress bars used in the application.
 */
@Injectable()
export class NgbProgressbarConfig {
  /**
   * Maximal value to be displayed in the progressbar.
   */
  max = 100;

  /**
   * A flag indicating if the stripes of the progress bar should be animated. Takes effect only for browsers
   * supporting CSS3 animations, and if striped is true.
   */
  animated: boolean = false;

  /**
   * A flag indicating if a progress bar should be displayed as striped.
   */
  striped: boolean = false;

  /**
   * Type of progress bar, can be one of "success", "info", "warning" or "danger".
   */
  type: string;
}
