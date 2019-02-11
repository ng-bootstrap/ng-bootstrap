import {NgZone} from '@angular/core';
import {fromEvent, Observable, race} from 'rxjs';
import {delay, filter, map, takeUntil, withLatestFrom} from 'rxjs/operators';
import {Key} from './key';

const isHTMLElementContainedIn = (element: HTMLElement, array?: HTMLElement[]) =>
    array ? array.some(item => item.contains(element)) : false;

// we'll have to use 'touch' events instead of 'mouse' events on iOS and add a more significant delay
// to avoid re-opening when handling (click) on a toggling element
const iOS = !!navigator.userAgent && /iPad|iPhone|iPod/.test(navigator.userAgent);

export function ngbAutoClose(
    zone: NgZone, document: any, type: boolean | 'inside' | 'outside', close: () => void, closed$: Observable<any>,
    insideElements: HTMLElement[], ignoreElements?: HTMLElement[]) {
  // closing on ESC and outside clicks
  if (type) {
    zone.runOutsideAngular(() => {

      const shouldCloseOnClick = (event: MouseEvent | TouchEvent) => {
        const element = event.target as HTMLElement;
        if (event instanceof MouseEvent) {
          if (event.button === 2 || isHTMLElementContainedIn(element, ignoreElements)) {
            return false;
          }
        }
        if (type === 'inside') {
          return isHTMLElementContainedIn(element, insideElements);
        } else if (type === 'outside') {
          return !isHTMLElementContainedIn(element, insideElements);
        } else /* if (type === true) */ {
          return true;
        }
      };

      const escapes$ = fromEvent<KeyboardEvent>(document, 'keydown')
                           .pipe(
                               takeUntil(closed$),
                               // tslint:disable-next-line:deprecation
                               filter(e => e.which === Key.Escape));


      // we have to pre-calculate 'shouldCloseOnClick' on 'mousedown/touchstart',
      // because on 'mouseup/touchend' DOM nodes might be detached
      const mouseDowns$ = fromEvent<MouseEvent>(document, iOS ? 'touchstart' : 'mousedown')
                              .pipe(map(shouldCloseOnClick), takeUntil(closed$));

      const closeableClicks$ = fromEvent<MouseEvent>(document, iOS ? 'touchend' : 'mouseup')
                                   .pipe(
                                       withLatestFrom(mouseDowns$), filter(([_, shouldClose]) => shouldClose),
                                       delay(iOS ? 16 : 0), takeUntil(closed$));


      race<Event>([escapes$, closeableClicks$]).subscribe(() => zone.run(close));
    });
  }
}
