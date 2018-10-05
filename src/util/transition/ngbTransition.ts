import {Observable, AsyncSubject, fromEvent, Subject, zip, of} from 'rxjs';
import {filter, takeUntil, skip} from 'rxjs/operators';

export interface NgbTransitionDefReturn {
  elements?: HTMLElement | Array<HTMLElement>| null;
  end?();
}

export interface NgbTransitionOptions {
  animation?: boolean;
  data?: any;
  callback?(data?: any);
}

// export function transitionDuration(element: HTMLElement) {
//   const styles = window.getComputedStyle(element);
//   const delay = parseFloat(styles['transitionDelay'] || '0') * 1000;
//   const duration = parseFloat(styles['transitionDuration'] || '0') * 1000;

//   return delay + duration;
// }

interface NgbTransitionRunning {
  subject: AsyncSubject<any>;
}

const runningTransition: Map<HTMLElement, NgbTransitionRunning> = new Map();

export const NgbRunTransition =
    (element: HTMLElement, startFn: (node: HTMLElement, options?: NgbTransitionOptions) => NgbTransitionDefReturn,
     options: NgbTransitionOptions = {}): Observable<any> => {

      const transitionEnd$ = new AsyncSubject();

      const currentTransition = runningTransition.get(element);
      if (currentTransition) {
        // Deactivate the previous observer to prevent the subscribe functions to be called and release the
        // transitionend events
        currentTransition.subject.complete();
        runningTransition.delete(element);
      }
      runningTransition.set(element, {subject: transitionEnd$});

      const {elements, end} = startFn(element, options);

      const localEnd = () => {

        let callbackParameters;
        if (end) {
          callbackParameters = end();
        }

        runningTransition.delete(element);
        transitionEnd$.next(callbackParameters);
        transitionEnd$.complete();

      };

      if (options.animation) {
        const arElements = (Array.isArray(elements) ? elements : [elements]);
        const done$ = new Subject();
        zip(...arElements.map((el) => {
          const styles = window.getComputedStyle(el !);
          if (styles['transition-property'] !== 'none') {
            const durationsNumber = styles['transitionDuration'].split(',').filter(d => d !== '0s').length;
            return fromEvent(el !, 'transitionend')
                .pipe(takeUntil(done$), filter((e: Event) => { return e.target === el; }), skip(durationsNumber - 1));
          } else {
            return of('');
          }
        })).subscribe(() => {
          done$.next();
          localEnd();
        });
      } else {
        localEnd();
      }
      return transitionEnd$.asObservable();
    };
