import { NgbTransitionStartFn } from './ngbTransition';
import { reflow } from '../util';

export interface NgbCollapseCtx {
	direction: 'show' | 'hide';
	dimension: 'width' | 'height';
	maxSize?: string;
}

function measureCollapsingElementDimensionPx(element: HTMLElement, dimension: 'width' | 'height'): string {
	// SSR fix for without injecting the PlatformId
	if (typeof navigator === 'undefined') {
		return '0px';
	}

	const { classList } = element;
	const hasShownClass = classList.contains('show');
	if (!hasShownClass) {
		classList.add('show');
	}

	element.style[dimension] = '';
	const dimensionSize = element.getBoundingClientRect()[dimension] + 'px';

	if (!hasShownClass) {
		classList.remove('show');
	}

	return dimensionSize;
}

export const ngbCollapsingTransition: NgbTransitionStartFn<NgbCollapseCtx> = (
	element: HTMLElement,
	animation: boolean,
	context: NgbCollapseCtx,
) => {
	let { direction, maxSize, dimension } = context;
	const { classList } = element;

	function setInitialClasses() {
		classList.add('collapse');
		if (direction === 'show') {
			classList.add('show');
		} else {
			classList.remove('show');
		}
	}

	// without animations we just need to set initial classes
	if (!animation) {
		setInitialClasses();
		return;
	}

	// No maxHeight -> running the transition for the first time
	if (!maxSize) {
		maxSize = measureCollapsingElementDimensionPx(element, dimension);
		context.maxSize = maxSize;

		// Fix the height before starting the animation
		element.style[dimension] = direction !== 'show' ? maxSize : '0px';

		classList.remove('collapse');
		classList.remove('collapsing');
		classList.remove('show');

		reflow(element);

		// Start the animation
		classList.add('collapsing');
	}

	// Start or revert the animation
	element.style[dimension] = direction === 'show' ? maxSize : '0px';

	return () => {
		setInitialClasses();
		classList.remove('collapsing');
		element.style[dimension] = '';
	};
};
