import {
	AfterViewInit,
	ChangeDetectorRef,
	ContentChildren,
	DestroyRef,
	Directive,
	ElementRef,
	inject,
	Input,
	OnInit,
	Output,
	QueryList,
} from '@angular/core';
import { NgbScrollSpyProcessChanges, NgbScrollSpyService, NgbScrollToOptions } from './scrollspy.service';
import { Observable } from 'rxjs';
import { isString } from '../util/util';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/**
 * Common interface for the scroll spy API.
 *
 * @internal
 */
export interface NgbScrollSpyRef {
	get active(): string;
	get active$(): Observable<string>;
	scrollTo(fragment: string | HTMLElement, options?: NgbScrollToOptions): void;
}

/**
 * A helper directive to that links menu items and fragments together.
 *
 * It will automatically add the `.active` class to the menu item when the associated fragment becomes active.
 *
 * @since 15.1.0
 */
@Directive({
	selector: '[ngbScrollSpyItem]',
	exportAs: 'ngbScrollSpyItem',
	host: {
		'[class.active]': 'isActive()',
		'(click)': 'scrollTo();',
	},
})
export class NgbScrollSpyItem implements OnInit {
	private _changeDetector = inject(ChangeDetectorRef);
	private _scrollSpyMenu = inject(NgbScrollSpyMenu, { optional: true });
	private _scrollSpyAPI: NgbScrollSpyRef = this._scrollSpyMenu ?? inject(NgbScrollSpyService);
	private _destroyRef = inject(DestroyRef);

	private _isActive = false;

	/**
	 * References the scroll spy directive, the id of the associated fragment and the parent menu item.
	 *
	 * Can be used like:
	 *  - `ngbScrollSpyItem="fragmentId"`
	 *  - `[ngbScrollSpyItem]="scrollSpy" fragment="fragmentId"
	 *  - `[ngbScrollSpyItem]="[scrollSpy, 'fragmentId']"` parent="parentId"`
	 *  - `[ngbScrollSpyItem]="[scrollSpy, 'fragmentId', 'parentId']"`
	 *
	 *  As well as together with `[fragment]` and `[parent]` inputs.
	 */
	@Input('ngbScrollSpyItem') set data(data: NgbScrollSpy | string | [NgbScrollSpy, string, string?]) {
		if (Array.isArray(data)) {
			this._scrollSpyAPI = data[0];
			this.fragment = data[1];
			this.parent ??= data[2];
		} else if (data instanceof NgbScrollSpy) {
			this._scrollSpyAPI = data;
		} else if (isString(data)) {
			this.fragment = data;
		}
	}

	/**
	 * The id of the associated fragment.
	 */
	@Input() fragment: string;

	/**
	 * The id of the parent scroll spy menu item.
	 */
	@Input() parent: string | undefined;

	ngOnInit(): void {
		// if it is not a part of a bigger menu, it should handle activation itself
		if (!this._scrollSpyMenu) {
			this._scrollSpyAPI.active$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((active: string) => {
				if (active === this.fragment) {
					this._activate();
				} else {
					this._deactivate();
				}
				this._changeDetector.markForCheck();
			});
		}
	}

	/**
	 * @internal
	 */
	_activate(): void {
		this._isActive = true;
		if (this._scrollSpyMenu) {
			this._scrollSpyMenu.getItem(this.parent ?? '')?._activate();
		}
	}

	/**
	 * @internal
	 */
	_deactivate(): void {
		this._isActive = false;
		if (this._scrollSpyMenu) {
			this._scrollSpyMenu.getItem(this.parent ?? '')?._deactivate();
		}
	}

	/**
	 * Returns `true`, if the associated fragment is active.
	 */
	isActive(): boolean {
		return this._isActive;
	}

	/**
	 * Scrolls to the associated fragment.
	 */
	scrollTo(options?: NgbScrollToOptions): void {
		this._scrollSpyAPI.scrollTo(this.fragment, options);
	}
}

/**
 * An optional scroll spy menu directive to build hierarchical menus
 * and simplify the [`NgbScrollSpyItem`](#/components/scrollspy/api#NgbScrollSpyItem) configuration.
 *
 * @since 15.1.0
 */
@Directive({
	selector: '[ngbScrollSpyMenu]',
})
export class NgbScrollSpyMenu implements NgbScrollSpyRef, AfterViewInit {
	private _scrollSpyRef: NgbScrollSpyRef = inject(NgbScrollSpyService);
	private _destroyRef = inject(DestroyRef);
	private _map = new Map<string, NgbScrollSpyItem>();
	private _lastActiveItem: NgbScrollSpyItem | null = null;

	@ContentChildren(NgbScrollSpyItem, { descendants: true }) private _items: QueryList<NgbScrollSpyItem>;

	@Input('ngbScrollSpyMenu') set scrollSpy(scrollSpy: NgbScrollSpy) {
		this._scrollSpyRef = scrollSpy;
	}

	get active(): string {
		return this._scrollSpyRef.active;
	}
	get active$(): Observable<string> {
		return this._scrollSpyRef.active$;
	}
	scrollTo(fragment: string, options?: NgbScrollToOptions): void {
		this._scrollSpyRef.scrollTo(fragment, options);
	}

	getItem(id: string): NgbScrollSpyItem | undefined {
		return this._map.get(id);
	}

	ngAfterViewInit() {
		this._items.changes.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(() => this._rebuildMap());
		this._rebuildMap();

		this._scrollSpyRef.active$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((activeId) => {
			this._lastActiveItem?._deactivate();
			const item = this._map.get(activeId);
			if (item) {
				item._activate();
				this._lastActiveItem = item;
			}
		});
	}

	private _rebuildMap() {
		this._map.clear();
		for (let item of this._items) {
			this._map.set(item.fragment, item);
		}
	}
}

/**
 * A directive to put on a scrollable container.
 *
 * It will instantiate a [`NgbScrollSpyService`](#/components/scrollspy/api#NgbScrollSpyService).
 *
 * @since 15.1.0
 */
@Directive({
	selector: '[ngbScrollSpy]',
	exportAs: 'ngbScrollSpy',
	host: {
		tabindex: '0',
		style: 'overflow-y: auto',
	},
	providers: [NgbScrollSpyService],
})
export class NgbScrollSpy implements NgbScrollSpyRef, AfterViewInit {
	static ngAcceptInputType_scrollBehavior: string;

	private _initialFragment: string | null = null;
	private _service = inject(NgbScrollSpyService);
	private _nativeElement = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

	/**
	 * A function that is called when the `IntersectionObserver` detects a change.
	 *
	 * See [`NgbScrollSpyOptions`](#/components/scrollspy/api#NgbScrollSpyOptions) for more details.
	 */
	@Input() processChanges: NgbScrollSpyProcessChanges;

	/**
	 * An `IntersectionObserver` root margin.
	 */
	@Input() rootMargin: string;

	/**
	 * The scroll behavior for the `.scrollTo()` method.
	 */
	@Input() scrollBehavior: 'auto' | 'smooth';

	/**
	 * An `IntersectionObserver` threshold.
	 */
	@Input() threshold: number | number[];

	@Input() set active(fragment: string) {
		this._initialFragment = fragment;
		this.scrollTo(fragment);
	}

	/**
	 * An event raised when the active section changes.
	 *
	 * Payload is the id of the new active section, empty string if none.
	 */
	@Output() activeChange = this._service.active$;

	/**
	 * Getter/setter for the currently active fragment id.
	 */
	get active(): string {
		return this._service.active;
	}

	/**
	 * Returns an observable that emits currently active section id.
	 */
	get active$(): Observable<string> {
		return this._service.active$;
	}

	ngAfterViewInit(): void {
		this._service.start({
			processChanges: this.processChanges,
			root: this._nativeElement,
			rootMargin: this.rootMargin,
			threshold: this.threshold,
			...(this._initialFragment && { initialFragment: this._initialFragment }),
		});
	}

	/**
	 * @internal
	 */
	_registerFragment(fragment: NgbScrollSpyFragment): void {
		this._service.observe(fragment.id);
	}

	/**
	 * @internal
	 */
	_unregisterFragment(fragment: NgbScrollSpyFragment): void {
		this._service.unobserve(fragment.id);
	}

	/**
	 * Scrolls to a fragment that is identified by the `ngbScrollSpyFragment` directive.
	 * An id or an element reference can be passed.
	 */
	scrollTo(fragment: string | HTMLElement, options?: NgbScrollToOptions): void {
		this._service.scrollTo(fragment, {
			...(this.scrollBehavior && { behavior: this.scrollBehavior }),
			...options,
		});
	}
}

/**
 * A directive to put on a fragment observed inside a scrollspy container.
 *
 * @since 15.1.0
 */
@Directive({
	selector: '[ngbScrollSpyFragment]',
	host: {
		'[id]': 'id',
	},
})
export class NgbScrollSpyFragment implements AfterViewInit {
	private _destroyRef = inject(DestroyRef);
	private _scrollSpy = inject(NgbScrollSpy);

	/**
	 * The unique id of the fragment.
	 * It must be a string unique to the document, as it will be set as the id of the element.
	 */
	@Input('ngbScrollSpyFragment') id: string;

	ngAfterViewInit() {
		this._scrollSpy._registerFragment(this);
		this._destroyRef.onDestroy(() => this._scrollSpy._unregisterFragment(this));
	}
}
