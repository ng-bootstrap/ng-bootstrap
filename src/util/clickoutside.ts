import {DOCUMENT} from '@angular/common';
import {Inject, Injectable, NgZone} from '@angular/core';

/**
 * Attach a global listener to the document to be executed
 * whenever user click anywhere _outside_ of a
 * given `element`.
 *
 * Should not be used directly. Use only via {@link NgbClickOutsideFactory}
 * @private
 */
export class NgbClickOutside {
  private removeListener: () => void;

  /**
   * @param element Element on which the clickoutside should be set
   * @param callback Function used as the clickoutside listener
   * @param document Document on which `mousedown` are listened
   * @param ngZone The zone Angular is running in
   */
  constructor(
      private _element: HTMLElement, private _callback: (event: MouseEvent) => void, document: Document,
      private _ngZone: NgZone) {
    this.onClick = this.onClick.bind(this);
    this._ngZone.runOutsideAngular(() => {
      document.addEventListener('click', this.onClick);

      this.removeListener = () => { document.removeEventListener('click', this.onClick); };
    });
  }

  /**
   * Properly destroy the instance by cleaning event listener registered on document
   */
  destroy() { this.removeListener(); }

  private onClick(event) {
    if (!this._element.contains(event.target)) {
      /* As the document listener is attached outside of the zone, we need to execute user callback inside for proper
       * change detection to be triggered */
      this._ngZone.run(() => this._callback(event));
    }
  }
}

/**
 * Factory service to easily create a `ClickOutside` instance.
 */
@Injectable()
export class NgbClickOutsideFactory {
  constructor(@Inject(DOCUMENT) private document: Document, private ngZone: NgZone) {}

  /**
   * Create an instance of `ClickOutside` and return it.
   * @param element HTMLElement on which the clickoutside should be activated
   * @param callback Function to be executed whenever a click event occured from outside of element
   * @returns a `ClickOutside` instance
   */
  create(element: HTMLElement, callback: (event: MouseEvent) => void): NgbClickOutside {
    return new NgbClickOutside(element, callback, this.document, this.ngZone);
  }
}
