import {Injectable, Injector} from '@angular/core';

/**
 * Represent options available when opening new modal windows.
 */
export interface NgbModalOptions {
  /**
   * Sets the aria attribute aria-labelledby to a modal window.
   *
   * @since 2.2.0
   */
  ariaLabelledBy?: string;

  /**
   * Whether a backdrop element should be created for a given modal (true by default).
   * Alternatively, specify 'static' for a backdrop which doesn't close the modal on click.
   */
  backdrop?: boolean | 'static';

  /**
   * Function called when a modal will be dismissed.
   * If this function returns false, the promise is resolved with false or the promise is rejected, the modal is not
   * dismissed.
   */
  beforeDismiss?: () => boolean | Promise<boolean>;

  /**
   * To center the modal vertically (false by default).
   *
   * @since 1.1.0
   */
  centered?: boolean;

  /**
   * An element to which to attach newly opened modal windows.
   */
  container?: string;

  /**
   * Injector to use for modal content.
   */
  injector?: Injector;

  /**
   * Whether to close the modal when escape key is pressed (true by default).
   */
  keyboard?: boolean;

  /**
   * Size of a new modal window.
   */
  size?: 'sm' | 'lg';

  /**
   * Custom class to append to the modal window
   */
  windowClass?: string;

  /**
   * Custom class to append to the modal backdrop
   *
   * @since 1.1.0
   */
  backdropClass?: string;
}

/**
* Configuration object token for the NgbModal service.
* You can provide this configuration, typically in your root module in order to provide default option values for every
* modal.
*
* @since 3.1.0
*/
@Injectable({providedIn: 'root'})
export class NgbModalConfig implements NgbModalOptions {
  backdrop = true;
  keyboard = true;
}
