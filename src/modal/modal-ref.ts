import {ComponentRef} from '@angular/core';

import {NgbModalBackdrop} from './modal-backdrop';
import {NgbModalWindow} from './modal-window';
import {ModalDismissReasons} from './modal-dismiss-reasons';

import {ContentRef} from '../util/popup';
import {AutoCloseService, Subscriber} from '../util/autoclose.service';



/**
 * A reference to an active (currently opened) modal. Instances of this class
 * can be injected into components passed as modal content.
 */
export class NgbActiveModal {
  /**
   * Can be used to close a modal, passing an optional result.
   */
  close(result?: any): void {}

  /**
   * Can be used to dismiss a modal, passing an optional reason.
   */
  dismiss(reason?: any): void {}
}

/**
 * A reference to a newly opened modal.
 */
export class NgbModalRef {
  private _resolve: (result?: any) => void;
  private _reject: (reason?: any) => void;

  private _autoCloseSubscriber: Subscriber;



  /**
   * The instance of component used as modal's content.
   * Undefined when a TemplateRef is used as modal's content.
   */
  get componentInstance(): any {
    if (this._contentRef.componentRef) {
      return this._contentRef.componentRef.instance;
    }
  }

  // only needed to keep TS1.8 compatibility
  set componentInstance(instance: any) {}

  /**
   * A promise that is resolved when a modal is closed and rejected when a modal is dismissed.
   */
  result: Promise<any>;

  constructor(
      autoCloseService: AutoCloseService, private _windowCmptRef: ComponentRef<NgbModalWindow>,
      private _contentRef: ContentRef, private _backdropCmptRef?: ComponentRef<NgbModalBackdrop>,
      private _beforeDismiss?: Function) {
    _windowCmptRef.instance.dismissEvent.subscribe((reason: any) => { this.dismiss(reason); });

    this.result = new Promise((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });
    this.result.then(null, () => {});

    this._autoCloseSubscriber = autoCloseService.createSubscriber({
      shouldAutoClose: () => true,
      isTargetInside: (target) => target === this._windowCmptRef.location.nativeElement,
      shouldCloseOnEscape: ({event}) => {
        const instance = this._windowCmptRef.instance;
        return instance.keyboard && !event.defaultPrevented;
      },
      shouldCloseOnClickOutside: () => false,
      shouldCloseOnClickInside: ({event}) => this._windowCmptRef.instance.backdrop === true,
      close: (event, {reason}) => {
        if (reason === 'escape') {
          this.dismiss(ModalDismissReasons.ESC);
        } else if (reason === 'inside_click') {
          this.dismiss(ModalDismissReasons.BACKDROP_CLICK);
        } else {
          this.close();
        }
      }
    });
    this._autoCloseSubscriber.subscribe();
  }

  /**
   * Can be used to close a modal, passing an optional result.
   */
  close(result?: any): void {
    if (this._windowCmptRef) {
      this._autoCloseSubscriber.unsubscribe();
      this._resolve(result);
      this._removeModalElements();
    }
  }

  private _dismiss(reason?: any) {
    this._reject(reason);
    this._removeModalElements();
  }

  /**
   * Can be used to dismiss a modal, passing an optional reason.
   */
  dismiss(reason?: any): void {
    if (this._windowCmptRef) {
      this._autoCloseSubscriber.unsubscribe();
      if (!this._beforeDismiss) {
        this._dismiss(reason);
      } else {
        const dismiss = this._beforeDismiss();
        if (dismiss && dismiss.then) {
          dismiss.then(
              result => {
                if (result !== false) {
                  this._dismiss(reason);
                }
              },
              () => {});
        } else if (dismiss !== false) {
          this._dismiss(reason);
        }
      }
    }
  }

  private _removeModalElements() {
    const windowNativeEl = this._windowCmptRef.location.nativeElement;
    windowNativeEl.parentNode.removeChild(windowNativeEl);
    this._windowCmptRef.destroy();

    if (this._backdropCmptRef) {
      const backdropNativeEl = this._backdropCmptRef.location.nativeElement;
      backdropNativeEl.parentNode.removeChild(backdropNativeEl);
      this._backdropCmptRef.destroy();
    }

    if (this._contentRef && this._contentRef.viewRef) {
      this._contentRef.viewRef.destroy();
    }

    this._windowCmptRef = null;
    this._backdropCmptRef = null;
    this._contentRef = null;
  }
}
