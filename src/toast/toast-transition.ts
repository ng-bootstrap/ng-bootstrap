import { reflow, NgbTransitionStartFn } from '@ng-bootstrap/ng-bootstrap/utils';

export const ngbToastFadeInTransition: NgbTransitionStartFn = (element: HTMLElement, animation: true) => {
	const { classList } = element;

	if (animation) {
		classList.add('fade');
	} else {
		classList.add('show');
		return;
	}

	reflow(element);
	classList.add('show', 'showing');

	return () => {
		classList.remove('showing');
	};
};

export const ngbToastFadeOutTransition: NgbTransitionStartFn = ({ classList }: HTMLElement) => {
	classList.add('showing');
	return () => {
		classList.remove('show', 'showing');
	};
};
