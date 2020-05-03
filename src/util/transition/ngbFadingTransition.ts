import {NgbTransitionStartFn} from './ngbTransition';

export const ngbAlertFadingTransition: NgbTransitionStartFn = ({classList}: HTMLElement) => {
  classList.remove('show');
};
