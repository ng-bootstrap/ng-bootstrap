import { NgbTransitionStartFn } from '../util/transition/ngbTransition';
import { reflow } from '../util/util';

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
