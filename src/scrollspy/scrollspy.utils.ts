import { NgbScrollSpyOptions, NgbScrollSpyProcessChanges, NgbScrollSpyService } from './scrollspy.service';
import { isString } from '../util/util';

export function toFragmentElement(container: Element | null, id?: string | HTMLElement | null): HTMLElement | null {
	if (!container || id == null) {
		return null;
	}
	return isString(id) ? container.querySelector(`#${CSS.escape(id)}`) : id;
}

function getOrderedFragments(container: Element, fragments: Set<Element>): Element[] {
	const selector = [...fragments].map(({ id }) => `#${CSS.escape(id)}`).join(',');
	return Array.from(container.querySelectorAll(selector));
}

export const defaultProcessChanges: NgbScrollSpyProcessChanges = (
	state: {
		entries: IntersectionObserverEntry[];
		rootElement: HTMLElement;
		fragments: Set<Element>;
		scrollSpy: NgbScrollSpyService;
		options: NgbScrollSpyOptions;
	},
	changeActive: (active: string) => void,
	ctx: {
		initialized: boolean;
		gapFragment: Element | null;
		visibleFragments: Set<Element>;
	},
) => {
	const { rootElement, fragments, scrollSpy, options, entries } = state;
	const orderedFragments = getOrderedFragments(rootElement, fragments);

	if (!ctx.initialized) {
		ctx.initialized = true;
		ctx.gapFragment = null;
		ctx.visibleFragments = new Set<Element>();

		// special case when one of the fragments was pre-selected
		const preSelectedFragment = toFragmentElement(rootElement, options?.initialFragment);
		if (preSelectedFragment) {
			scrollSpy.scrollTo(preSelectedFragment);
			return;
		}
	}

	for (const entry of entries) {
		const { isIntersecting, target: fragment } = entry;

		// 1. an entry became visible
		if (isIntersecting) {
			// if we were in-between two elements, we have to clear it up
			if (ctx.gapFragment) {
				ctx.visibleFragments.delete(ctx.gapFragment);
				ctx.gapFragment = null;
			}

			ctx.visibleFragments.add(fragment);
		}

		// 2. an entry became invisible
		else {
			ctx.visibleFragments.delete(fragment);

			// nothing is visible anymore, but something just was actually
			if (ctx.visibleFragments.size === 0 && scrollSpy.active !== '') {
				// 2.1 scrolling down - keeping the same element
				if (entry.boundingClientRect.top < entry.rootBounds!.top) {
					ctx.gapFragment = fragment;
					ctx.visibleFragments.add(ctx.gapFragment);
				}
				// 2.2 scrolling up - getting the previous element
				else {
					// scrolling up and no more fragments above
					if (fragment === orderedFragments[0]) {
						ctx.gapFragment = null;
						ctx.visibleFragments.clear();
						changeActive('');
						return;
					}

					// getting previous fragment
					else {
						const fragmentIndex = orderedFragments.indexOf(fragment);
						ctx.gapFragment = orderedFragments[fragmentIndex - 1] || null;
						if (ctx.gapFragment) {
							ctx.visibleFragments.add(ctx.gapFragment);
						}
					}
				}
			}
		}
	}

	// getting the first visible element in the DOM order of the fragments
	for (const fragment of orderedFragments) {
		if (ctx.visibleFragments.has(fragment)) {
			changeActive(fragment.id);
			break;
		}
	}
};
