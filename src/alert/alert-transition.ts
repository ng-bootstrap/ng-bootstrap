import { NgbTransitionStartFn } from '@ng-bootstrap/ng-bootstrap/util';

export const ngbAlertFadingTransition: NgbTransitionStartFn = ({ classList }: HTMLElement) => {
	classList.remove('show');
};
