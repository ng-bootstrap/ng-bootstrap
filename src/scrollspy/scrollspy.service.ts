import { ChangeDetectorRef, inject, Injectable, NgZone, OnDestroy, PLATFORM_ID } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { NgbScrollSpyRef } from './scrollspy';
import { distinctUntilChanged } from 'rxjs/operators';
import { NgbScrollSpyConfig } from './scrollspy-config';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { toFragmentElement } from './scrollspy.utils';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

const MATCH_THRESHOLD = 3;

export type NgbScrollSpyProcessChanges = (
	state: {
		entries: IntersectionObserverEntry[];
		rootElement: HTMLElement;
		fragments: Set<Element>;
		scrollSpy: NgbScrollSpyService;
		options: NgbScrollSpyOptions;
	},
	changeActive: (active: string) => void,
	context: object,
) => void;

/**
 * Options passed to the `NgbScrollSpyService.start()` method for scrollspy initialization.
 *
 * It contains a subset of the `IntersectionObserverInit` options, as well additional optional properties
 * like `changeDetectorRef` or `fragments`
 *
 * @since 15.1.0
 */
export interface NgbScrollSpyOptions extends Pick<IntersectionObserverInit, 'root' | 'rootMargin' | 'threshold'> {
	/**
	 * An optional reference to the change detector, that should be marked for check when active fragment changes.
	 * If it is not provided, the service will try to get it from the DI. Ex. when using the `ngbScrollSpy` directive,
	 * it will mark for check the directive's host component.
	 *
	 * `.markForCheck()` will be called on the change detector when the active fragment changes.
	 */
	changeDetectorRef?: ChangeDetectorRef;

	/**
	 * An optional initial fragment to scroll to when the service starts.
	 */
	initialFragment?: string | HTMLElement;

	/**
	 * An optional list of fragments to observe when the service starts.
	 * You can alternatively use `.addFragment()` to add fragments.
	 */
	fragments?: (string | HTMLElement)[];

	/**
	 * An optional function that is called when the `IntersectionObserver` detects a change.
	 * It is used to determine if currently active fragment should be changed.
	 *
	 * You can override this function to provide your own scrollspy logic.
	 * It provides:
	 *  - a scrollspy `state` (observer entries, root element, fragments, scrollSpy instance, etc.)
	 *  - a `changeActive` function that should be called with the new active fragment
	 *  - a `context` that is persisted between calls
	 */
	processChanges?: NgbScrollSpyProcessChanges;

	/**
	 * An optional `IntersectionObserver` root element. If not provided, the document element will be used.
	 */
	root?: HTMLElement;

	/**
	 * An optional `IntersectionObserver` margin for the root element.
	 */
	rootMargin?: string;

	/**
	 * An optional default scroll behavior to use when using the `.scrollTo()` method.
	 */
	scrollBehavior?: 'auto' | 'smooth';

	/**
	 * An optional `IntersectionObserver` threshold.
	 */
	threshold?: number | number[];
}

/**
 * Scroll options passed to the `.scrollTo()` method.
 * An extension of the standard `ScrollOptions` interface.
 *
 * @since 15.1.0
 */
export interface NgbScrollToOptions extends ScrollOptions {
	/**
	 * Scroll behavior as defined in the `ScrollOptions` interface.
	 */
	behavior?: 'auto' | 'smooth';
}

/**
 * A scrollspy service that allows tracking of elements scrolling in and out of view.
 *
 * It can be instantiated manually, or automatically by the `ngbScrollSpy` directive.
 *
 * @since 15.1.0
 */
@Injectable({
	providedIn: 'root',
})
export class NgbScrollSpyService implements NgbScrollSpyRef, OnDestroy {
	private _observer: IntersectionObserver | null = null;

	private _containerElement: HTMLElement | null = null;
	private _fragments = new Set<Element>();
	private _preRegisteredFragments = new Set<string | HTMLElement>();

	private _active$ = new Subject<string>();
	private _distinctActive$ = this._active$.pipe(distinctUntilChanged());
	private _active = '';

	private _config = inject(NgbScrollSpyConfig);
	private _document = inject(DOCUMENT);
	private _platformId = inject(PLATFORM_ID);
	private _scrollBehavior = this._config.scrollBehavior;
	private _diChangeDetectorRef = inject(ChangeDetectorRef, { optional: true });
	private _changeDetectorRef = this._diChangeDetectorRef;
	private _zone = inject(NgZone);

	constructor() {
		this._distinctActive$.pipe(takeUntilDestroyed()).subscribe((active) => {
			this._active = active;
			this._changeDetectorRef?.markForCheck();
		});
	}

	/**
	 * Getter for the currently active fragment id. Returns empty string if none.
	 */
	get active(): string {
		return this._active;
	}

	/**
	 * An observable emitting the currently active fragment. Emits empty string if none.
	 */
	get active$(): Observable<string> {
		return this._distinctActive$;
	}

	/**
	 * Starts the scrollspy service and observes specified fragments.
	 *
	 * You can specify a list of options to pass, like the root element, initial fragment, scroll behavior, etc.
	 * See the [`NgbScrollSpyOptions`](#/components/scrollspy/api#NgbScrollSpyOptions) interface for more details.
	 */
	start(options?: NgbScrollSpyOptions) {
		if (isPlatformBrowser(this._platformId)) {
			this.stop();

			const { root, rootMargin, scrollBehavior, threshold, fragments, changeDetectorRef, processChanges } = {
				...options,
			};
			this._containerElement = root ?? this._document.documentElement;
			this._changeDetectorRef = changeDetectorRef ?? this._diChangeDetectorRef;
			this._scrollBehavior = scrollBehavior ?? this._config.scrollBehavior;
			const processChangesFn = processChanges ?? this._config.processChanges;

			const context = {};
			this._observer = new IntersectionObserver(
				(entries) =>
					processChangesFn(
						{
							entries,
							rootElement: this._containerElement!,
							fragments: this._fragments,
							scrollSpy: this,
							options: { ...options },
						},
						(active: string) => this._active$.next(active),
						context,
					),
				{
					root: root ?? this._document,
					...(rootMargin && { rootMargin }),
					...(threshold && { threshold }),
				},
			);

			// merging fragments added before starting and the ones passed as options
			for (const element of [...this._preRegisteredFragments, ...(fragments ?? [])]) {
				this.observe(element);
			}

			this._preRegisteredFragments.clear();
		}
	}

	/**
	 * Stops the service and unobserves all fragments.
	 */
	stop() {
		this._fragments.clear();
		this._observer?.disconnect();
		this._changeDetectorRef = this._diChangeDetectorRef;
		this._scrollBehavior = this._config.scrollBehavior;
		this._observer = null;
		this._containerElement = null;
	}

	/**
	 * Scrolls to a fragment, it must be known to the service and contained in the root element.
	 * An id or an element reference can be passed.
	 *
	 * [`NgbScrollToOptions`](#/components/scrollspy/api#NgbScrollToOptions) can be passed.
	 */
	scrollTo(fragment: string | HTMLElement, options?: NgbScrollToOptions) {
		const { behavior } = { behavior: this._scrollBehavior, ...options };

		if (this._containerElement) {
			const fragmentElement = toFragmentElement(this._containerElement, fragment);

			if (fragmentElement) {
				const heightPx = fragmentElement.offsetTop - this._containerElement.offsetTop;

				this._containerElement.scrollTo({ top: heightPx, behavior });

				let lastOffset = this._containerElement.scrollTop;
				let matchCounter = 0;

				// we should update the active section only after scrolling is finished
				// and there is no clean way to do it at the moment
				const containerElement = this._containerElement;
				this._zone.runOutsideAngular(() => {
					const updateActiveWhenScrollingIsFinished = () => {
						const sameOffsetAsLastTime = lastOffset === containerElement.scrollTop;

						if (sameOffsetAsLastTime) {
							matchCounter++;
						} else {
							matchCounter = 0;
						}

						if (!sameOffsetAsLastTime || (sameOffsetAsLastTime && matchCounter < MATCH_THRESHOLD)) {
							lastOffset = containerElement.scrollTop;

							requestAnimationFrame(updateActiveWhenScrollingIsFinished);
						} else {
							this._zone.run(() => this._active$.next(fragmentElement.id));
						}
					};
					requestAnimationFrame(updateActiveWhenScrollingIsFinished);
				});
			}
		}
	}

	/**
	 * Adds a fragment to observe. It must be contained in the root element.
	 * An id or an element reference can be passed.
	 */
	observe(fragment: string | HTMLElement) {
		if (!this._observer) {
			this._preRegisteredFragments.add(fragment);
			return;
		}

		const fragmentElement = toFragmentElement(this._containerElement, fragment);

		if (fragmentElement && !this._fragments.has(fragmentElement)) {
			this._fragments.add(fragmentElement);
			this._observer.observe(fragmentElement);
		}
	}

	/**
	 * Unobserves a fragment.
	 * An id or an element reference can be passed.
	 */
	unobserve(fragment: string | HTMLElement) {
		if (!this._observer) {
			this._preRegisteredFragments.delete(fragment);
			return;
		}

		const fragmentElement = toFragmentElement(this._containerElement, fragment);

		if (fragmentElement) {
			this._fragments.delete(fragmentElement);
			this._observer.unobserve(fragmentElement);
		}
	}

	ngOnDestroy() {
		this.stop();
	}
}
