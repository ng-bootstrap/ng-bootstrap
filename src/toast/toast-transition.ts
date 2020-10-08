import {NgbTransitionStartFn} from '../util/transition/ngbTransition';

export const ngbToastFadeInTransition: NgbTransitionStartFn = ({classList}: HTMLElement) => {
  classList.remove('hide');
  classList.add('showing');

  return () => {
    classList.remove('showing');
    classList.add('show');
  };
};

export const ngbToastFadeOutTransition: NgbTransitionStartFn = ({classList}: HTMLElement) => {
  classList.remove('show');
  return () => { classList.add('hide'); };
};
