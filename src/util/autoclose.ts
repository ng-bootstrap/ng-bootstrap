import {Injectable, NgZone, Inject} from '@angular/core';
import {fromEvent, Observable, race} from 'rxjs';
import {DOCUMENT} from '@angular/common';
import {takeUntil, filter, delay, withLatestFrom, map} from 'rxjs/operators';
import {Key} from './key';

const isHTMLElementContainedIn = (element: HTMLElement, array?: HTMLElement[]) =>
    array ? array.some(item => item.contains(element)) : false;

@Injectable({providedIn: 'root'})
export class AutoClose {
  constructor(private _ngZone: NgZone, @Inject(DOCUMENT) private _document: any) {}

  install(
      autoClose: boolean | 'inside' | 'outside', close: () => void, closed$: Observable<any>,
      insideElements: HTMLElement[], ignoreElements?: HTMLElement[]) {
    // closing on ESC and outside clicks
    if (autoClose) {
      this._ngZone.runOutsideAngular(() => {

        const shouldCloseOnClick = (event: MouseEvent) => {
          const element = event.target as HTMLElement;
          if (event.button === 2 || isHTMLElementContainedIn(element, ignoreElements)) {
            return false;
          }
          if (autoClose === 'inside') {
            return isHTMLElementContainedIn(element, insideElements);
          } else if (autoClose === 'outside') {
            return !isHTMLElementContainedIn(element, insideElements);
          } else /* if (autoClose === true) */ {
            return true;
          }
        };

        const escapes$ = fromEvent<KeyboardEvent>(this._document, 'keydown')
                             .pipe(
                                 takeUntil(closed$),
                                 // tslint:disable-next-line:deprecation
                                 filter(e => e.which === Key.Escape));


        // we have to pre-calculate 'shouldCloseOnClick' on 'mousedown',
        // because on 'mouseup' DOM nodes might be detached
        const mouseDowns$ =
            fromEvent<MouseEvent>(this._document, 'mousedown').pipe(map(shouldCloseOnClick), takeUntil(closed$));

        const outsideClicks$ = fromEvent<MouseEvent>(this._document, 'mouseup')
                                   .pipe(
                                       withLatestFrom(mouseDowns$), filter(([_, shouldClose]) => shouldClose), delay(0),
                                       takeUntil(closed$));


        race<Event>([escapes$, outsideClicks$]).subscribe(() => this._ngZone.run(close));
      });
    }
  }
}
