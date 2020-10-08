import {NgbTransitionStartFn} from './ngbTransition';
import {reflow} from '../util';

export const ngbAlertFadingTransition: NgbTransitionStartFn = ({classList}: HTMLElement) => {
  classList.remove('show');
};

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
