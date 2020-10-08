import {NgbTransitionStartFn} from '../util/transition/ngbTransition';
import {reflow} from '../util/util';

export const ngbNavFadeOutTransition: NgbTransitionStartFn = ({classList}) => {
  classList.remove('show');
  return () => classList.remove('active');
};

export const ngbNavFadeInTransition: NgbTransitionStartFn = (element: HTMLElement) => {
  element.classList.add('active');
  reflow(element);
  element.classList.add('show');
};

export const ngbNavFadeInNoReflowTransition: NgbTransitionStartFn = (element: HTMLElement) => {
  element.classList.add('active');
  element.classList.add('show');
};
