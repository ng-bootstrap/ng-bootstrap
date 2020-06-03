import {Injectable} from '@angular/core';
import {NgbConfig} from '../ngb-config';

/**
 * Interface used to type all toast config options. See `NgbToastConfig`.
 *
 * @since 5.0.0
 */
export interface NgbToastOptions {
  /**
   * Specify if the toast component should emit the `hide()` output
   * after a certain `delay` in ms.
   */
  autohide?: boolean;

  /**
   * Delay in ms after which the `hide()` output should be emitted.
   */
  delay?: number;

  /**
   * Type of aria-live attribute to be used.
   *
   * Could be one of these 2 values (as string):
   * - `polite` (default)
   * - `alert`
   */
  ariaLive?: 'polite' | 'alert';
}

/**
 * Configuration service for the NgbToast component. You can inject this service, typically in your root component,
 * and customize the values of its properties in order to provide default values for all the toasts used in the
 * application.
 *
 * @since 5.0.0
 */
@Injectable({providedIn: 'root'})
export class NgbToastConfig implements NgbToastOptions {
  animation: boolean;
  autohide = true;
  delay = 500;
  ariaLive: 'polite' | 'alert' = 'polite';

  constructor(ngbConfig: NgbConfig) { this.animation = ngbConfig.animation; }
}
