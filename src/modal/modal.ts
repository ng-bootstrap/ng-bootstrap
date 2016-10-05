import {Injectable, TemplateRef} from '@angular/core';

import {NgbModalStack} from './modal-stack';
import {NgbModalRef} from './modal-ref';

/**
 * Represent options available when opening new modal windows.
 */
export interface NgbModalOptions {
  /**
   * Whether a backdrop element should be created for a given modal (true by default).
   * Alternatively, specify 'static' for a backdrop which doesn't close the modal on click.
   */
  backdrop?: boolean | 'static';

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
}

/**
 * A service to open modal windows. Creating a modal is straightforward: create a template and pass it as an argument to
 * the "open" method!
 */
@Injectable()
export class NgbModal {
  constructor(private _modalStack: NgbModalStack) {}

  /**
   * Opens a new modal window with the specified content and using supplied options.
   */
  open(content: string | TemplateRef<any>, options: NgbModalOptions = {}): NgbModalRef {
    return this._modalStack.open(content, options);
  }
}
