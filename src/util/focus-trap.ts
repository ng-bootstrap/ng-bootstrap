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
 * The implementation is rather simple, the class add a `focusout` listener on the element with capture phase.
 * We then detect the navigation direction.
 * Whenever we are about to exit the watched element from either top or bottom, we re-focus manually the right element
 * accordinlgy.
 *
 * As a additional security, we also set a `focusin` listener on document, and immediately put focus back into the
 * watched element.
 *
 * Should not be used directly. Use only via {@link NgbFocusTrapFactory}
 */
export class NgbFocusTrap {
  private _removeDocumentListener;
  private _direction: DIRECTION = DIRECTION.FORWARD;
  private _previouslyFocused: HTMLElement | null = null;
  private _endOfDocument: HTMLElement | null = null;

  /**
   * Guess the next focusable element.
   * Computation is based on specific CSS selector and [tab] navigation direction
   */
  private get _focusableElement(): HTMLElement {
    const list: NodeListOf<HTMLElement> = this._element.querySelectorAll(FOCUSABLE_ELEMENTS_SELECTOR);
    return this._direction === DIRECTION.BACKWARD ? list[list.length - 1] : list[0];
  }

  /** Returns boundary elements (first and last) that can be focused */
  private get _focusableBoundaryElements(): HTMLElement[] {
    const list: NodeListOf<HTMLElement> = this._element.querySelectorAll(FOCUSABLE_ELEMENTS_SELECTOR);
    return [list[0], list[list.length - 1]];
  }

  /**
   * @param _element The element around which focus will be trapped inside
   * @param autofocus Initially put the focus on specific element with a `ngbFocustrap` attribute. Will also remenber
   * and restore any previously focused element on destroy.
   * @param _document Document on which `keydown.TAB` events are listened to determine navigation direction
   * @param _ngZone The zone Angular is running in
   */
  constructor(private _element: HTMLElement, autofocus: boolean, private _document: Document, private _ngZone: NgZone) {
    this._stealFocus = this._stealFocus.bind(this);
    this._enforceFocus = this._enforceFocus.bind(this);
    this._detectDirection = this._detectDirection.bind(this);

    const eod = this._endOfDocument = this._document.createElement('i');
    eod.className = 'ngb-focustrap-eod';
    eod.tabIndex = 0;
    this._document.body.appendChild(eod);

    this._ngZone.runOutsideAngular(() => {
      this._element.addEventListener('focusout', this._enforceFocus, true);
      this._document.addEventListener('focusin', this._stealFocus, true);
      this._document.addEventListener('keydown', this._detectDirection);

      this._removeDocumentListener = () => {
        this._element.removeEventListener('focusout', this._enforceFocus, true);
        this._document.removeEventListener('focusin', this._stealFocus, true);
        this._document.removeEventListener('keydown', this._detectDirection);
      }
    });

    if (autofocus === true) {
      this._previouslyFocused = document.activeElement as HTMLElement;
      this._focusInitial();
    }
  }

  /** Prevents any focus to occur outside of the watched element */
  private _stealFocus(event) {
    const {target} = event;
    if (this._document !== target && this._element !== target && !this._element.contains(target)) {
      this._focusElement(this._focusableElement);
    }
  }

  /** Detects if we focus is reaching boundaries of the watched element, preparing to loop */
  private _enforceFocus(event) {
    const {target} = event;
    const[first, last] = this._focusableBoundaryElements;
    if (target === first && this._direction === DIRECTION.BACKWARD) {
      this._focusElement(last);
    }
    if (target === last && this._direction === DIRECTION.FORWARD) {
      this._focusElement(first);
    }
  }

  /** Detects `tab` navigation direction */
  private _detectDirection(event) {
    const {shiftKey, key} = event;
    if (key === 'Tab') {
      this._direction = shiftKey ? DIRECTION.BACKWARD : DIRECTION.FORWARD;
    }
  }

  /** Try to focus a given element */
  private _focusElement(element: HTMLElement) {
    if (element) {
      this._ngZone.run(() => { element.focus(); });
    }
  }

  /** Try to set focus on the first found element that has an ngbAutofocus attribute */
  private _focusInitial() { this._focusElement(this._element.querySelector('[ngbAutofocus]') as HTMLElement); }

  /**
   * Destroys the focustrap by removing all event listeners set on document.
   *
   * Eventually put the focus back on the previously focused element at the time
   * focustrap has been initialized.
   */
  destroy() {
    this._removeDocumentListener();
    this._document.body.removeChild(this._endOfDocument);
    if (this._previouslyFocused) {
      this._previouslyFocused.focus();
    }
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
