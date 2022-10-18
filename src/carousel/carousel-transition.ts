import { NgbTransitionStartFn } from '../util/transition/ngbTransition';
import { reflow } from '../util/util';

/**
 * Defines the carousel slide transition direction.
 */
export enum NgbSlideEventDirection {
	START = 'start',
	END = 'end',
}

export interface NgbCarouselCtx {
	/**
	 * <span class="badge bg-info text-dark">since 12.0.0</span> Possible values are `'start' | 'end'`.
	 *
	 * <span class="badge bg-secondary">before 12.0.0</span> Possible values were `'left' | 'right'`.
	 */
	direction: 'start' | 'end';
}

const isBeingAnimated = ({ classList }: HTMLElement) => {
	return classList.contains('carousel-item-start') || classList.contains('carousel-item-end');
};

const removeDirectionClasses = (classList: DOMTokenList) => {
	classList.remove('carousel-item-start');
	classList.remove('carousel-item-end');
};

const removeClasses = (classList: DOMTokenList) => {
	removeDirectionClasses(classList);
	classList.remove('carousel-item-prev');
	classList.remove('carousel-item-next');
};

export const ngbCarouselTransitionIn: NgbTransitionStartFn<NgbCarouselCtx> = (
	element: HTMLElement,
	animation: boolean,
	{ direction }: NgbCarouselCtx,
) => {
	const { classList } = element;

	if (!animation) {
		removeDirectionClasses(classList);
		removeClasses(classList);
		classList.add('active');
		return;
	}

	if (isBeingAnimated(element)) {
		// Revert the transition
		removeDirectionClasses(classList);
	} else {
		// For the 'in' transition, a 'pre-class' is applied to the element to ensure its visibility
		classList.add('carousel-item-' + (direction === NgbSlideEventDirection.START ? 'next' : 'prev'));
		reflow(element);
		classList.add('carousel-item-' + direction);
	}

	return () => {
		removeClasses(classList);
		classList.add('active');
	};
};

export const ngbCarouselTransitionOut: NgbTransitionStartFn<NgbCarouselCtx> = (
	element: HTMLElement,
	animation: boolean,
	{ direction }: NgbCarouselCtx,
) => {
	const { classList } = element;

	if (!animation) {
		removeDirectionClasses(classList);
		removeClasses(classList);
		classList.remove('active');
		return;
	}

	//  direction is left or right, depending on the way the slide goes out.
	if (isBeingAnimated(element)) {
		// Revert the transition
		removeDirectionClasses(classList);
	} else {
		classList.add('carousel-item-' + direction);
	}

	return () => {
		removeClasses(classList);
		classList.remove('active');
	};
};
