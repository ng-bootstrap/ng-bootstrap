import {EMPTY, fromEvent, Observable, of, race, Subject, timer} from 'rxjs';
import {endWith, filter, takeUntil} from 'rxjs/operators';
import {getTransitionDurationMs} from './util';
import {environment} from '../../environment';
import {reflow} from '../util';

export type NgbTransitionStartFn<T = any> = (element: HTMLElement, context: T) => NgbTransitionEndFn | void;
export type NgbTransitionEndFn = () => void;

export interface NgbTransitionOptions<T> {
  animation: boolean;
  runningTransition: 'continue' | 'stop';
  context?: T;
}

export interface NgbTransitionCtx<T> {
  transition$: Subject<any>;
  context: T;
}

const noopFn: NgbTransitionEndFn = () => {};

const {transitionTimerDelayMs} = environment;
const runningTransitions = new Map<HTMLElement, NgbTransitionCtx<any>>();

export const ngbRunTransition =
    <T>(element: HTMLElement, startFn: NgbTransitionStartFn<T>, options: NgbTransitionOptions<T>):
        Observable<undefined> => {

          // Getting initial context from options
          let context = options.context || <T>{};

          // Checking if there are already running transitions on the given element.
          const running = runningTransitions.get(element);
          if (running) {
            switch (options.runningTransition) {
              // If there is one running and we want for it to 'continue' to run, we have to cancel the new one.
              // We're not emitting any values, but simply completing the observable (EMPTY).
              case 'continue':
                return EMPTY;
              // If there is one running and we want for it to 'stop', we have to complete the running one.
              // We're simply completing the running one and not emitting any values and merging newly provided context
              // with the one coming from currently running transition.
              case 'stop':
                running.transition$.complete();
                context = Object.assign(running.context, context);
                runningTransitions.delete(element);
            }
          }

          // A reflow is required here, to be sure that everything is ready,
          // Without reflow, the transition will not be started for some widgets, at initialization time
          reflow(element);

          const endFn = startFn(element, context) || noopFn;

          // If 'prefer-reduced-motion' is enabled, the 'transition' will be set to 'none'.
          // If animations are disabled, we have to emit a value and complete the observable
          // In this case we have to call the end function, but can finish immediately by emitting a value,
          // completing the observable and executing end functions synchronously.
          if (!options.animation || window.getComputedStyle(element).transitionProperty === 'none') {
            endFn();
            return of(undefined);
          }

          // Starting a new transition
          const transition$ = new Subject<any>();
          const stop$ = transition$.pipe(endWith(true));
          runningTransitions.set(element, {transition$, context});

          const transitionDurationMs = getTransitionDurationMs(element);

          // 1. We have to both listen for the 'transitionend' event and have a 'just-in-case' timer,
          // because 'transitionend' event might not be fired in some browsers, if the transitioning
          // element becomes invisible (ex. when scrolling, making browser tab inactive, etc.). The timer
          // guarantees, that we'll release the DOM element and complete 'ngbRunTransition'.
          // 2. We need to filter transition end events, because they might bubble from shorter transitions
          // on inner DOM elements. We're only interested in the transition on the 'element' itself.
          const transitionEnd$ =
              fromEvent(element, 'transitionend').pipe(takeUntil(stop$), filter(({target}) => target === element));
          const timer$ = timer(transitionDurationMs + transitionTimerDelayMs).pipe(takeUntil(stop$));

          race(timer$, transitionEnd$).pipe(takeUntil(stop$)).subscribe(() => {
            runningTransitions.delete(element);
            endFn();
            transition$.next();
            transition$.complete();
          });

          return transition$.asObservable();
        };
