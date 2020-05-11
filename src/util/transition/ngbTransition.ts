import {EMPTY, fromEvent, Observable, of, race, Subject, timer} from 'rxjs';
import {endWith, takeUntil} from 'rxjs/operators';
import {getTransitionDurationMs} from './util';
import {environment} from '../../environment';

export type NgbTransitionStartFn = (element: HTMLElement) => NgbTransitionEndFn | void;
export type NgbTransitionEndFn = () => void;

export interface NgbTransitionOptions {
  animation: boolean;
  runningTransition: 'continue' | 'stop';
}

const noopFn: NgbTransitionEndFn = () => {};

const {transitionTimerDelayMs} = environment;
const runningTransitions = new Map<HTMLElement, Subject<any>>();

export const ngbRunTransition =
    (element: HTMLElement, startFn: NgbTransitionStartFn, options: NgbTransitionOptions): Observable<undefined> => {

      // If animations are disabled, we have to emit a value and complete the observable
      if (!options.animation) {
        return of(undefined);
      }

      // Checking if there are already running transitions on the given element.
      const runningTransition$ = runningTransitions.get(element);
      if (runningTransition$) {
        switch (options.runningTransition) {
          // If there is one running and we want for it to 'continue' to run, we have to cancel the new one.
          // We're not emitting any values, but simply completing the observable (EMPTY).
          case 'continue':
            return EMPTY;
          // If there is one running and we want for it to 'stop', we have to complete the running one.
          // We're simply completing the running one and not emitting any values.
          case 'stop':
            runningTransition$.complete();
            runningTransitions.delete(element);
        }
      }

      // If 'prefer-reduced-motion' is enabled, the 'transition' will be set to 'none'.
      // In this case we have to call the start function, but can finish immediately by emitting a value,
      // completing the observable and executing both start and end functions synchronously.
      const {transitionProperty} = window.getComputedStyle(element);
      if (transitionProperty === 'none') {
        (startFn(element) || noopFn)();
        return of(undefined);
      }

      // Starting a new transition
      const transition$ = new Subject<any>();
      const stop$ = transition$.pipe(endWith(true));
      runningTransitions.set(element, transition$);

      const endFn = startFn(element) || noopFn;

      const transitionDurationMs = getTransitionDurationMs(element);

      // We have to both listen for the 'transitionend' event and have a 'just-in-case' timer,
      // because 'transitionend' event might not be fired in some browsers, if the transitioning
      // element becomes invisible (ex. when scrolling, making browser tab inactive, etc.). The timer
      // guarantees, that we'll release the DOM element and complete 'ngbRunTransition'.
      const transitionEnd$ = fromEvent(element, 'transitionend').pipe(takeUntil(stop$));
      const timer$ = timer(transitionDurationMs + transitionTimerDelayMs).pipe(takeUntil(stop$));

      race(timer$, transitionEnd$).pipe(takeUntil(stop$)).subscribe(() => {
        runningTransitions.delete(element);
        endFn();
        transition$.next();
        transition$.complete();
      });

      return transition$.asObservable();
    };
