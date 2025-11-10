import { reflow, NgbTransitionStartFn } from '@ng-bootstrap/ng-bootstrap/utils';

export const ngbNavFadeOutTransition: NgbTransitionStartFn = ({ classList }) => {
	classList.remove('show');
	return () => classList.remove('active');
};

export const ngbNavFadeInTransition: NgbTransitionStartFn = (element: HTMLElement, animation: boolean) => {
	if (animation) {
		reflow(element);
	}
	element.classList.add('show');
};
