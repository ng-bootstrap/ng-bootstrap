import {DOCUMENT} from '@angular/common';
import {Inject, Injectable, NgZone} from '@angular/core';

const FOCUSABLE_ELEMENTS_SELECTOR = [
  'a[href]', 'button:not([disabled])', 'input:not([disabled]):not([type="hidden"])', 'select:not([disabled])',
  'textarea:not([disabled])', '[contenteditable]', '[tabindex]:not([tabindex="-1"])'
].join(', ');

enum DIRECTION {
  BACKWARD,
  FORWARD
}

/**
 * Class that enforce the browser focus to be trapped inside a DOM element.
 *
 * The implementation is rather simple, the class add a `focusin` listener on the document with capture phase.
 * Any focus event will then be caught, and therefore the class will only allow the one for elements contained inside
 * it's own element.
 *
 * In case the element is not contained, the class will determine which new element has to be focused based on the `tab`
 * navigation direction.
 *
 * Should not be used directly. Use only via {@link NgbFocusTrapFactory}
 */
export class NgbFocusTrap {
  private _removeDocumentListener;
  private _direction: DIRECTION = DIRECTION.FORWARD;
  private _endOfDocument: HTMLElement | null = null;

  /**
   * Guess the next focusable element.
   * Computation is based on specific CSS selector and [tab] navigation direction
   */
  private get focusableElement(): HTMLElement {
    const list: NodeListOf<HTMLElement> = this._element.querySelectorAll(FOCUSABLE_ELEMENTS_SELECTOR);
    return this._direction === DIRECTION.BACKWARD ? list[list.length - 1] : list[0];
  }

  /**
   * @param _element The element around which focus will be trapped inside
   * @param autofocus Initially put the focus on specific element with a `ngbFocustrap` attribute. Will also remenber
   * and restore any previously focused element on destroy.
   * @param _document Document on which `focusin` and `keydown.TAB` events are listened
   * @param _ngZone The zone Angular is running in
   */
  constructor(private _element: HTMLElement, autofocus: boolean, private _document: Document, private _ngZone: NgZone) {
    this._enforceFocus = this._enforceFocus.bind(this);
    this._detectDirection = this._detectDirection.bind(this);

    const eod = this._endOfDocument = this._document.createElement('i');
    eod.className = 'ngb-focustrap-eod';
    eod.tabIndex = 0;
    this._document.body.appendChild(eod);

    this._ngZone.runOutsideAngular(() => {
      this._document.addEventListener('focusin', this._enforceFocus, true);
      this._document.addEventListener('keydown', this._detectDirection);

      this._removeDocumentListener = () => {
        this._document.removeEventListener('focusin', this._enforceFocus, true);
        this._document.removeEventListener('keydown', this._detectDirection);
      }
    });

    if (autofocus === true) {
      this._focusInitial();
    }
  }

  /** Detect if incoming focus event should be prevented or not */
  private _enforceFocus(event) {
    const {target} = event;
    if (this._document !== target && this._element !== target && !this._element.contains(target)) {
      this._ngZone.run(() => {
        const element = this.focusableElement;
        if (element) {
          element.focus();
          event.stopPropagation();
        }
      });
    }
  }

  /** Event handler detecting current `tab` navigation direction */
  private _detectDirection(event) {
    const {shiftKey, key} = event;
    if (key === 'Tab') {
      this._direction = shiftKey ? DIRECTION.BACKWARD : DIRECTION.FORWARD;
    }
  }

  /** Try to set focus on the first found element that has an ngbAutofocus attribute */
  private _focusInitial() {
    const element = this._element.querySelector('[ngbAutofocus]') as HTMLElement;
    if (element) {
      element.focus();
    }
  }

  /**
   * Destroys the focustrap by removing all event listeners set on document.
   *
   * Eventually put the focus back on the previously focused element at the time
   * focustrap has been initialized.
   */
  destroy() {
    this._removeDocumentListener();
    this._document.body.removeChild(this._endOfDocument);
  }
}

/**
 * Factory service to easily create a `NgbFocusTrap` instance on an element
 */
@Injectable()
export class NgbFocusTrapFactory {
  constructor(@Inject(DOCUMENT) private _document: Document, private _ngZone: NgZone) {}

  /**
   * Create an instance of {@link NgbFocusTrap} and return it
   * @param element HTMLElement to trap focus inside
   * @param autofocus Whether the focustrap should automatically move focus into the trapped element upon
   * initialization and return focus to the previous activeElement upon destruction.
   */
  create(element: HTMLElement, autofocus = false): NgbFocusTrap {
    return new NgbFocusTrap(element, autofocus, this._document, this._ngZone);
  }
}
