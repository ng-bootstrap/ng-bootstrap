import type { PaginationApi, PaginationState, PaginationWidget } from '@agnos-ui/angular-headless';
import {
	callWidgetFactory,
	createPagination,
	patchSimpleChanges,
	toSlotContextWidget,
	ngBootstrapPagination,
} from '@agnos-ui/angular-headless';
import { AsyncPipe, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import type { OnChanges, Signal, SimpleChanges } from '@angular/core';
import {
	ChangeDetectionStrategy,
	Component,
	TemplateRef,
	ContentChild,
	Directive,
	EventEmitter,
	Input,
	Output,
	inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgbPaginationConfig } from './pagination-config';

/**
 * A context for the
 * * `NgbPaginationFirst`
 * * `NgbPaginationPrevious`
 * * `NgbPaginationNext`
 * * `NgbPaginationLast`
 * * `NgbPaginationEllipsis`
 * * `NgbPaginationPages`
 *
 * link templates in case you want to override one.
 *
 * @since 4.1.0
 */
export interface NgbPaginationLinkContext {
	/**
	 * Page number displayed by the current link.
	 */
	currentPage: number;

	/**
	 * If `true`, the current link is disabled.
	 */
	disabled: boolean;
}

/**
 * A context for the `NgbPaginationNumber` link template in case you want to override one.
 *
 * Extends `NgbPaginationLinkContext`.
 *
 * @since 4.1.0
 */
export interface NgbPaginationNumberContext extends NgbPaginationLinkContext {
	/**
	 * The page number, displayed by the current page link.
	 */
	$implicit: number;
}

/**
 * A context for the `NgbPaginationPages` pages template in case you want to override
 * the way all pages are displayed.
 *
 * @since 9.1.0
 */
export interface NgbPaginationPagesContext {
	/**
	 * The currently selected page number.
	 */
	$implicit: number;

	/**
	 * If `true`, pagination is disabled.
	 */
	disabled: boolean;

	/**
	 * Pages numbers that should be rendered starting with 1.
	 */
	pages: number[];
}

/**
 * A directive to match the 'ellipsis' link template
 *
 * @since 4.1.0
 */
@Directive({ selector: 'ng-template[ngbPaginationEllipsis]', standalone: true })
export class NgbPaginationEllipsis {
	constructor(public templateRef: TemplateRef<NgbPaginationLinkContext>) {}
}

/**
 * A directive to match the 'first' link template
 *
 * @since 4.1.0
 */
@Directive({ selector: 'ng-template[ngbPaginationFirst]', standalone: true })
export class NgbPaginationFirst {
	constructor(public templateRef: TemplateRef<NgbPaginationLinkContext>) {}
}

/**
 * A directive to match the 'last' link template
 *
 * @since 4.1.0
 */
@Directive({ selector: 'ng-template[ngbPaginationLast]', standalone: true })
export class NgbPaginationLast {
	constructor(public templateRef: TemplateRef<NgbPaginationLinkContext>) {}
}

/**
 * A directive to match the 'next' link template
 *
 * @since 4.1.0
 */
@Directive({ selector: 'ng-template[ngbPaginationNext]', standalone: true })
export class NgbPaginationNext {
	constructor(public templateRef: TemplateRef<NgbPaginationLinkContext>) {}
}

/**
 * A directive to match the page 'number' link template
 *
 * @since 4.1.0
 */
@Directive({ selector: 'ng-template[ngbPaginationNumber]', standalone: true })
export class NgbPaginationNumber {
	constructor(public templateRef: TemplateRef<NgbPaginationNumberContext>) {}
}

/**
 * A directive to match the 'previous' link template
 *
 * @since 4.1.0
 */
@Directive({ selector: 'ng-template[ngbPaginationPrevious]', standalone: true })
export class NgbPaginationPrevious {
	constructor(public templateRef: TemplateRef<NgbPaginationLinkContext>) {}
}

/**
 * A directive to match the 'pages' whole content
 *
 * @since 9.1.0
 */
@Directive({ selector: 'ng-template[ngbPaginationPages]', standalone: true })
export class NgbPaginationPages {
	constructor(public templateRef: TemplateRef<NgbPaginationPagesContext>) {}
}

@Component({
	selector: 'ngb-pagination',
	standalone: true,
	imports: [NgIf, NgFor, AsyncPipe, NgTemplateOutlet],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { role: 'navigation' },
	template: `
		<ng-template #first><span aria-hidden="true" i18n="@@ngb.pagination.first">&laquo;&laquo;</span></ng-template>
		<ng-template #previous><span aria-hidden="true" i18n="@@ngb.pagination.previous">&laquo;</span></ng-template>
		<ng-template #next><span aria-hidden="true" i18n="@@ngb.pagination.next">&raquo;</span></ng-template>
		<ng-template #last><span aria-hidden="true" i18n="@@ngb.pagination.last">&raquo;&raquo;</span></ng-template>
		<ng-template #ellipsis>...</ng-template>
		<ng-template #defaultNumber let-page let-currentPage="currentPage">{{ page }}</ng-template>
		<ng-template #defaultPages let-page let-pages="pages" let-disabled="disabled">
			<li
				*ngFor="let pageNumber of pages"
				class="page-item"
				[class.active]="pageNumber === page"
				[class.disabled]="widget.api.isEllipsis(pageNumber) || disabled"
				[attr.aria-current]="pageNumber === page ? 'page' : null"
			>
				<a *ngIf="widget.api.isEllipsis(pageNumber)" class="page-link" tabindex="-1" aria-disabled="true">
					<ng-template
						[ngTemplateOutlet]="tplEllipsis?.templateRef || ellipsis"
						[ngTemplateOutletContext]="{ disabled: true, currentPage: page }"
					></ng-template>
				</a>
				<a
					*ngIf="!widget.api.isEllipsis(pageNumber)"
					class="page-link"
					href
					(click)="widget.actions.select(pageNumber); $event.preventDefault()"
					[attr.tabindex]="disabled ? '-1' : null"
					[attr.aria-disabled]="disabled ? 'true' : null"
				>
					<ng-template
						[ngTemplateOutlet]="tplNumber?.templateRef || defaultNumber"
						[ngTemplateOutletContext]="{ disabled: disabled, $implicit: pageNumber, currentPage: page }"
					></ng-template>
				</a>
			</li>
		</ng-template>
		<ng-container *ngIf="widget.state$ | async as state">
			<ul [class]="'pagination' + (size ? ' pagination-' + size : '')">
				<li *ngIf="state.boundaryLinks" class="page-item" [class.disabled]="state.previousDisabled">
					<a
						aria-label="First"
						i18n-aria-label="@@ngb.pagination.first-aria"
						class="page-link"
						href
						(click)="widget.actions.first(); $event.preventDefault()"
						[attr.tabindex]="state.previousDisabled ? '-1' : null"
						[attr.aria-disabled]="state.previousDisabled ? 'true' : null"
					>
						<ng-template
							[ngTemplateOutlet]="tplFirst?.templateRef || first"
							[ngTemplateOutletContext]="{ disabled: state.previousDisabled, currentPage: page }"
						></ng-template>
					</a>
				</li>

				<li *ngIf="state.directionLinks" class="page-item" [class.disabled]="state.previousDisabled">
					<a
						aria-label="Previous"
						i18n-aria-label="@@ngb.pagination.previous-aria"
						class="page-link"
						href
						(click)="widget.actions.previous(); $event.preventDefault()"
						[attr.tabindex]="state.previousDisabled ? '-1' : null"
						[attr.aria-disabled]="state.previousDisabled ? 'true' : null"
					>
						<ng-template
							[ngTemplateOutlet]="tplPrevious?.templateRef || previous"
							[ngTemplateOutletContext]="{ disabled: state.previousDisabled }"
						></ng-template>
					</a>
				</li>
				<ng-template
					[ngTemplateOutlet]="tplPages?.templateRef || defaultPages"
					[ngTemplateOutletContext]="{ $implicit: state.page, pages: state.pages, disabled: state.disabled }"
				>
				</ng-template>
				<li *ngIf="state.directionLinks" class="page-item" [class.disabled]="state.nextDisabled">
					<a
						aria-label="Next"
						i18n-aria-label="@@ngb.pagination.next-aria"
						class="page-link"
						href
						(click)="widget.actions.next(); $event.preventDefault()"
						[attr.tabindex]="state.nextDisabled ? '-1' : null"
						[attr.aria-disabled]="state.nextDisabled ? 'true' : null"
					>
						<ng-template
							[ngTemplateOutlet]="tplNext?.templateRef || next"
							[ngTemplateOutletContext]="{ disabled: state.nextDisabled, currentPage: state.page }"
						></ng-template>
					</a>
				</li>

				<li *ngIf="boundaryLinks" class="page-item" [class.disabled]="state.nextDisabled">
					<a
						aria-label="Last"
						i18n-aria-label="@@ngb.pagination.last-aria"
						class="page-link"
						href
						(click)="widget.actions.last(); $event.preventDefault()"
						[attr.tabindex]="state.nextDisabled ? '-1' : null"
						[attr.aria-disabled]="state.nextDisabled ? 'true' : null"
					>
						<ng-template
							[ngTemplateOutlet]="tplLast?.templateRef || last"
							[ngTemplateOutletContext]="{ disabled: state.nextDisabled, currentPage: state.page }"
						></ng-template>
					</a>
				</li>
			</ul>
		</ng-container>
	`,
})
export class NgbPagination implements OnChanges {
	// Those two getters are only for the tests and could be removed if we remove more tests done in AgnosUI
	get pageCount() {
		return this._widget.stores.pageCount$();
	}
	get pages() {
		return this._widget.stores.pages$();
	}

	@ContentChild(NgbPaginationEllipsis, { static: false }) tplEllipsis?: NgbPaginationEllipsis;
	@ContentChild(NgbPaginationFirst, { static: false }) tplFirst?: NgbPaginationFirst;
	@ContentChild(NgbPaginationLast, { static: false }) tplLast?: NgbPaginationLast;
	@ContentChild(NgbPaginationNext, { static: false }) tplNext?: NgbPaginationNext;
	@ContentChild(NgbPaginationNumber, { static: false }) tplNumber?: NgbPaginationNumber;
	@ContentChild(NgbPaginationPrevious, { static: false }) tplPrevious?: NgbPaginationPrevious;
	@ContentChild(NgbPaginationPages, { static: false }) tplPages?: NgbPaginationPages;

	/**
	 * If `true`, pagination links will be disabled.
	 */
	@Input() disabled: boolean;

	/**
	 * If `true`, the "First" and "Last" page links are shown.
	 */
	@Input() boundaryLinks: boolean;

	/**
	 * If `true`, the "Next" and "Previous" page links are shown.
	 */
	@Input() directionLinks: boolean;

	/**
	 * If `true`, the ellipsis symbols and first/last page numbers will be shown when `maxSize` > number of pages.
	 */
	@Input() ellipses: boolean;

	/**
	 * Whether to rotate pages when `maxSize` > number of pages.
	 *
	 * The current page always stays in the middle if `true`.
	 */
	@Input() rotate: boolean;

	/**
	 *  The number of items in your paginated collection.
	 *
	 *  Note, that this is not the number of pages. Page numbers are calculated dynamically based on
	 *  `collectionSize` and `pageSize`. Ex. if you have 100 items in your collection and displaying 20 items per page,
	 *  you'll end up with 5 pages.
	 */
	@Input({ required: true }) collectionSize: number;

	/**
	 *  The maximum number of pages to display.
	 */
	@Input() maxSize: number;

	/**
	 *  The current page.
	 *
	 *  Page numbers start with `1`.
	 */
	@Input() page = 1;

	/**
	 *  The number of items per page.
	 */
	@Input() pageSize: number;

	/**
	 *  An event fired when the page is changed. Will fire only if collection size is set and all values are valid.
	 *
	 *  Event payload is the number of the newly selected page.
	 *
	 *  Page numbers start with `1`.
	 */
	@Output() pageChange = new EventEmitter<number>(true);

	/**
	 * The pagination display size.
	 *
	 * Bootstrap currently supports small and large sizes.
	 *
	 * If the passed value is a string (ex. 'custom'), it will just add the `pagination-custom` css class
	 */
	@Input() size: 'sm' | 'lg' | string | null;

	readonly config: NgbPaginationConfig;
	readonly _widget: PaginationWidget;
	readonly widget: Pick<PaginationWidget, 'actions' | 'api' | 'directives' | 'state$' | 'stores'>;
	readonly api: PaginationApi;
	readonly state$: Signal<PaginationState>;

	constructor() {
		this.config = inject(NgbPaginationConfig);

		this.disabled = this.config.disabled;
		this.boundaryLinks = this.config.boundaryLinks;
		this.directionLinks = this.config.directionLinks;
		this.ellipses = this.config.ellipses;
		this.maxSize = this.config.maxSize;
		this.pageSize = this.config.pageSize;
		this.rotate = this.config.rotate;
		this.size = this.config.size;

		this._widget = callWidgetFactory(createPagination, null, {
			pagesFactory: ngBootstrapPagination(this.config.maxSize, this.config.rotate, this.config.ellipses),
			pageSize: this.config.pageSize,
			page: 1,
			boundaryLinks: this.config.boundaryLinks,
			directionLinks: this.config.directionLinks,
			disabled: this.config.disabled,
		});
		this.widget = toSlotContextWidget(this._widget);
		this.api = this._widget.api;

		this.state$ = toSignal(this._widget.state$ as any, { requireSync: true });

		this._widget.patch({
			onPageChange: (page: number) => this.pageChange.emit(page),
		});
	}

	ngOnChanges(changes: SimpleChanges): void {
		// changes !== null is for the current ng-bootstrap tests.
		if (changes !== null && (changes?.maxSize || changes?.rotate || this?.ellipses)) {
			this._widget.patch({
				pagesFactory: ngBootstrapPagination(
					changes.maxSize ? changes.maxSize.currentValue : this.maxSize,
					changes.rotate ? changes.rotate.currentValue : this.rotate,
					changes.ellipses ? changes.ellipses.currentValue : this.ellipses,
				),
			});
		}
		if (changes !== null) {
			patchSimpleChanges(this._widget.patch, changes);
		}
	}
}
