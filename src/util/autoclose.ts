import {NgZone} from '@angular/core';
import {fromEvent, Observable, race} from 'rxjs';
import {delay, filter, map, takeUntil, tap, withLatestFrom} from 'rxjs/operators';
import {Key} from './key';
import {closest} from './util';

const isContainedIn = (element: HTMLElement, array?: HTMLElement[]) =>
    array ? array.some(item => item.contains(element)) : false;

const matchesSelectorIfAny = (element: HTMLElement, selector?: string) =>
    !selector || closest(element, selector) != null;

// we'll have to use 'touch' events instead of 'mouse' events on iOS and add a more significant delay
// to avoid re-opening when handling (click) on a toggling element
// TODO: use proper Angular platform detection when NgbAutoClose becomes a service and we can inject PLATFORM_ID
let iOS = false;
if (typeof navigator !== 'undefined') {
  iOS = !!navigator.userAgent && /iPad|iPhone|iPod/.test(navigator.userAgent);
}

// setting 'ngbAutoClose' synchronously on iOS results in immediate popup closing
// when tapping on the triggering element
const wrapAsyncForiOS = fn => iOS ? () => setTimeout(() => fn(), 100) : fn;

export function ngbAutoClose(
    zone: NgZone, document: any, type: boolean | 'inside' | 'outside', close: () => void, closed$: Observable<any>,
    insideElements: HTMLElement[], ignoreElements?: HTMLElement[], insideSelector?: string) {
  // closing on ESC and outside clicks
  if (type) {
    zone.runOutsideAngular(wrapAsyncForiOS(() => {

      const shouldCloseOnClick = (event: MouseEvent) => {
        const element = event.target as HTMLElement;
        if (event.button === 2 || isContainedIn(element, ignoreElements)) {
          return false;
        }
        if (type === 'inside') {
          return isContainedIn(element, insideElements) && matchesSelectorIfAny(element, insideSelector);
        } else if (type === 'outside') {
          return !isContainedIn(element, insideElements);
        } else /* if (type === true) */ {
          return matchesSelectorIfAny(element, insideSelector) || !isContainedIn(element, insideElements);
        }
      };

      const escapes$ = fromEvent<KeyboardEvent>(document, 'keydown')
                           .pipe(
                               takeUntil(closed$),
                               // tslint:disable-next-line:deprecation
                               filter(e => e.which === Key.Escape), tap(e => e.preventDefault()));


      // we have to pre-calculate 'shouldCloseOnClick' on 'mousedown/touchstart',
      // because on 'mouseup/touchend' DOM nodes might be detached
      const mouseDowns$ =
          fromEvent<MouseEvent>(document, 'mousedown').pipe(map(shouldCloseOnClick), takeUntil(closed$));

      const closeableClicks$ = fromEvent<MouseEvent>(document, 'mouseup')
                                   .pipe(
                                       withLatestFrom(mouseDowns$), filter(([_, shouldClose]) => shouldClose), delay(0),
                                       takeUntil(closed$)) as Observable<MouseEvent>;


      race<Event>([escapes$, closeableClicks$]).subscribe(() => zone.run(close));
    }));
  }
}
