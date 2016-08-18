import {ComponentRef, ViewContainerRef} from '@angular/core';

import {NgbModalBackdrop} from './modal-backdrop';
import {NgbModalWindow} from './modal-window';

/**
 * A reference to a newly opened modal.
 */
export class NgbModalRef {
  private _resolve: (result?: any) => void;
  private _reject: (reason?: any) => void;

  /**
   * A promise that is resolved when a modal is closed and rejected when a modal is dismissed.
   */
  result: Promise<any>;

  constructor(
      private _viewContainerRef: ViewContainerRef, private _windowCmptRef: ComponentRef<NgbModalWindow>,
      private _backdropCmptRef?: ComponentRef<NgbModalBackdrop>) {
    _windowCmptRef.instance.dismissEvent.subscribe((reason: any) => { this.dismiss(reason); });

    this.result = new Promise((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });
  }

  /**
   * Can be used to close a modal, passing an optional result.
   */
  close(result?: any) {
    if (this._windowCmptRef) {
      this._resolve(result);
      this._removeModalElements();
    }
  }

  /**
   * Can be used to dismiss a modal, passing an optional reason.
   */
  dismiss(reason?: any) {
    if (this._windowCmptRef) {
      this._reject(reason);
      this._removeModalElements();
    }
  }

  private _removeModalElements() {
    this._viewContainerRef.remove(this._viewContainerRef.indexOf(this._windowCmptRef.hostView));
    if (this._backdropCmptRef) {
      this._viewContainerRef.remove(this._viewContainerRef.indexOf(this._backdropCmptRef.hostView));
    }

    this._windowCmptRef = null;
    this._backdropCmptRef = null;
  }
}
