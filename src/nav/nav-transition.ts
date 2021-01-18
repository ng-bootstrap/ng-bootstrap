import {NgbTransitionStartFn} from '../util/transition/ngbTransition';

export const ngbNavFadeOutTransition: NgbTransitionStartFn = ({classList}) => {
  classList.remove('show');
  return () => classList.remove('active');
};

export const ngbNavFadeInTransition: NgbTransitionStartFn = (element: HTMLElement) => {
  element.classList.add('show');
};
