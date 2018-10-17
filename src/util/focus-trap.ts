import {fromEvent, Observable} from 'rxjs';
import {filter, map, takeUntil, withLatestFrom} from 'rxjs/operators';

import {Key} from '../util/key';

const FOCUSABLE_ELEMENTS_SELECTOR = [
  'a[href]', 'button:not([disabled])', 'input:not([disabled]):not([type="hidden"])', 'select:not([disabled])',
  'textarea:not([disabled])', '[contenteditable]', '[tabindex]:not([tabindex="-1"])'
].join(', ');

/**
 * Returns first and last focusable elements inside of a given element based on specific CSS selector
 */
export function getFocusableBoundaryElements(element: HTMLElement): HTMLElement[] {
  const list: NodeListOf<HTMLElement> = element.querySelectorAll(FOCUSABLE_ELEMENTS_SELECTOR);
  return [list[0], list[list.length - 1]];
}

/**
 * Function that enforces browser focus to be trapped inside a DOM element.
 *
 * Works only for clicks inside the element and navigation with 'Tab', ignoring clicks outside of the element
 *
 * @param element The element around which focus will be trapped inside
 * @param stopFocusTrap$ The observable stream. When completed the focus trap will clean up listeners
 * and free internal resources
 * @param refocusOnClick Put the focus back to the last focused element whenever a click occurs on element (default to
 * false)
 */
export const ngbFocusTrap = (element: HTMLElement, stopFocusTrap$: Observable<any>, refocusOnClick = false) => {
  // last focused element
  const lastFocusedElement$ =
      fromEvent<FocusEvent>(element, 'focusin').pipe(takeUntil(stopFocusTrap$), map(e => e.target));

  // 'tab' / 'shift+tab' stream
  fromEvent<KeyboardEvent>(element, 'keydown')
      .pipe(takeUntil(stopFocusTrap$), filter(e => e.which === Key.Tab), withLatestFrom(lastFocusedElement$))
      .subscribe(([tabEvent, focusedElement]) => {
        const[first, last] = getFocusableBoundaryElements(element);

        if (focusedElement === first && tabEvent.shiftKey) {
          last.focus();
          tabEvent.preventDefault();
        }

        if (focusedElement === last && !tabEvent.shiftKey) {
          first.focus();
          tabEvent.preventDefault();
        }
      });

  // inside click
  if (refocusOnClick) {
    fromEvent(element, 'click')
        .pipe(takeUntil(stopFocusTrap$), withLatestFrom(lastFocusedElement$), map(arr => arr[1] as HTMLElement))
        .subscribe(lastFocusedElement => lastFocusedElement.focus());
  }
};
