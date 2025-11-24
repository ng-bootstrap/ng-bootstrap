import { NgbTransitionStartFn } from '@ng-bootstrap/ng-bootstrap/utils';

export const ngbAlertFadingTransition: NgbTransitionStartFn = ({ classList }: HTMLElement) => {
	classList.remove('show');
};
