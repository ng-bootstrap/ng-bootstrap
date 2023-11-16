import {
	AfterContentChecked,
	AfterContentInit,
	ChangeDetectorRef,
	ContentChild,
	ContentChildren,
	DestroyRef,
	Directive,
	ElementRef,
	EmbeddedViewRef,
	EventEmitter,
	inject,
	Input,
	OnDestroy,
	Output,
	QueryList,
	TemplateRef,
	ViewContainerRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgbAccordionConfig } from './accordion-config';
import { NgbCollapse } from '../collapse/collapse';
import { isString } from '../util/util';

let nextId = 0;

/**
 * A directive that wraps the content of an accordion item's collapsible body.
 *
 * The actual content is provided in a child `ng-template` element.
 * Depending on the state of the accordion, the template will be either inserted or removed from the DOM.
 *
 * @since 14.1.0
 */
@Directive({
	selector: '[ngbAccordionBody]',
	standalone: true,
	host: { '[class.accordion-body]': 'true' },
})
export class NgbAccordionBody implements AfterContentChecked, OnDestroy {
	private _vcr = inject(ViewContainerRef);
	private _element = inject(ElementRef<HTMLElement>).nativeElement;
	private _item = inject(NgbAccordionItem);

	private _viewRef: EmbeddedViewRef<any> | null = null;

	@ContentChild(TemplateRef, { static: true }) private _bodyTpl: TemplateRef<any>;

	ngAfterContentChecked(): void {
		if (this._bodyTpl) {
			if (this._item._shouldBeInDOM) {
				this._createViewIfNotExists();
			} else {
				this._destroyViewIfExists();
			}
		}
	}

	ngOnDestroy(): void {
		this._destroyViewIfExists();
	}

	private _destroyViewIfExists(): void {
		if (this._viewRef) {
			this._viewRef.destroy();
			this._viewRef = null;
		}
	}

	private _createViewIfNotExists(): void {
		if (!this._viewRef) {
			this._viewRef = this._vcr.createEmbeddedView(this._bodyTpl);
			this._viewRef.detectChanges();
			for (const node of this._viewRef.rootNodes) {
				this._element.appendChild(node);
			}
		}
	}
}

/**
 * A directive that wraps the collapsible item's content of the accordion.
 *
 * Internally it reuses the [`NgbCollapse` directive](#/components/collapse)
 *
 * @since 14.1.0
 */
@Directive({
	exportAs: 'ngbAccordionCollapse',
	standalone: true,
	selector: '[ngbAccordionCollapse]',
	host: {
		role: 'region',
		'[class.accordion-collapse]': 'true',
		'[id]': 'item.collapseId',
		'[attr.aria-labelledby]': 'item.toggleId',
	},
	hostDirectives: [NgbCollapse],
})
export class NgbAccordionCollapse {
	item = inject(NgbAccordionItem);
	ngbCollapse = inject(NgbCollapse);
}

/**
 * A directive to put on a toggling element inside the accordion item's header.
 * It will register click handlers that toggle the associated panel and will handle accessibility attributes.
 *
 * This directive is used internally by the [`NgbAccordionButton` directive](#/components/accordion/api#NgbAccordionButton).
 *
 * @since 14.1.0
 */
@Directive({
	selector: '[ngbAccordionToggle]',
	standalone: true,
	host: {
		'[id]': 'item.toggleId',
		'[class.collapsed]': 'item.collapsed',
		'[attr.aria-controls]': 'item.collapseId',
		'[attr.aria-expanded]': '!item.collapsed',
		'(click)': '!item.disabled && accordion.toggle(item.id)',
	},
})
export class NgbAccordionToggle {
	item = inject(NgbAccordionItem);
	accordion = inject(NgbAccordionDirective);
}

/**
 * A directive to put on a button element inside an accordion item's header.
 *
 * If you want a custom markup for the header, you can also use the [`NgbAccordionToggle` directive](#/components/accordion/api#NgbAccordionToggle).
 *
 * @since 14.1.0
 */
@Directive({
	selector: 'button[ngbAccordionButton]',
	standalone: true,
	host: {
		'[disabled]': 'item.disabled',
		'[class.accordion-button]': 'true',
		type: 'button',
	},
	hostDirectives: [NgbAccordionToggle],
})
export class NgbAccordionButton {
	item = inject(NgbAccordionItem);
}

/**
 * A directive that wraps an accordion item's header.
 *
 * @since 14.1.0
 */
@Directive({
	selector: '[ngbAccordionHeader]',
	standalone: true,
	host: {
		role: 'heading',
		'[class.accordion-header]': 'true',
		'[class.collapsed]': 'item.collapsed',
	},
})
export class NgbAccordionHeader {
	item = inject(NgbAccordionItem);
}

/**
 * A directive that wraps an accordion item: a toggleable header + body that collapses.
 *
 * You can get hold of the `NgbAccordionItem` instance in the template with `#item="ngbAccordionItem"`.
 * It allows to check if the item is collapsed or not, toggle the collapse state, etc.
 *
 * Every accordion item has a string ID that is automatically generated in the `ngb-accordion-item-XX` format, unless provided explicitly.
 *
 * @since 14.1.0
 */
@Directive({
	selector: '[ngbAccordionItem]',
	exportAs: 'ngbAccordionItem',
	standalone: true,
	host: {
		'[class.accordion-item]': 'true',
		'[id]': 'id',
	},
})
export class NgbAccordionItem implements AfterContentInit {
	private _accordion = inject(NgbAccordionDirective);
	private _cd = inject(ChangeDetectorRef);
	private _destroyRef = inject(DestroyRef);

	private _collapsed = true;
	private _id = `ngb-accordion-item-${nextId++}`;
	private _destroyOnHide: boolean | undefined;

	private _collapseAnimationRunning = false;

	@ContentChild(NgbAccordionCollapse, { static: true }) private _collapse: NgbAccordionCollapse;

	/**
	 * Sets the custom ID of the accordion item. It must be unique for the document.
	 *
	 * @param id The ID of the accordion item, must be a non-empty string
	 */
	@Input('ngbAccordionItem') set id(id: string) {
		if (isString(id) && id !== '') {
			this._id = id;
		}
	}

	/**
	 * If `true`, the content of the accordion item's body will be removed from the DOM. It will be just hidden otherwise.
	 *
	 * This property can also be set up on the parent [`NgbAccordion` directive](#/components/accordion/api#NgbAccordionDirective).
	 */
	@Input() set destroyOnHide(destroyOnHide: boolean) {
		this._destroyOnHide = destroyOnHide;
	}

	get destroyOnHide(): boolean {
		return this._destroyOnHide === undefined ? this._accordion.destroyOnHide : this._destroyOnHide!;
	}

	/**
	 * If `true`, the accordion item will be disabled.
	 * It won't react to user's clicks, but still will be toggelable programmatically.
	 */
	@Input() disabled = false;

	/**
	 *	If `true`, the accordion item will be collapsed. Otherwise, it will be expanded.
	 *
	 * @param collapsed New state of the accordion item.
	 */
	@Input() set collapsed(collapsed: boolean) {
		if (collapsed) {
			this.collapse();
		} else {
			this.expand();
		}
	}

	/**
	 * Event emitted before the expanding animation starts. It has no payload.
	 *
	 * @since 15.1.0
	 */
	@Output() show = new EventEmitter<void>();

	/**
	 * Event emitted when the expanding animation is finished. It has no payload.
	 */
	@Output() shown = new EventEmitter<void>();

	/**
	 * Event emitted before the collapsing animation starts. It has no payload.
	 *
	 * @since 15.1.0
	 */
	@Output() hide = new EventEmitter<void>();

	/**
	 * Event emitted when the collapsing animation is finished and before the content is removed from DOM.
	 * It has no payload.
	 */
	@Output() hidden = new EventEmitter<void>();

	get collapsed() {
		return this._collapsed;
	}

	get id() {
		return `${this._id}`;
	}

	get toggleId() {
		return `${this.id}-toggle`;
	}

	get collapseId() {
		return `${this.id}-collapse`;
	}

	get _shouldBeInDOM() {
		return !this.collapsed || this._collapseAnimationRunning || !this.destroyOnHide;
	}

	ngAfterContentInit() {
		const { ngbCollapse } = this._collapse;
		// we need to disable the animation for the first init
		ngbCollapse.animation = false;
		ngbCollapse.collapsed = this.collapsed;
		// we set the animation to the default of the accordion
		ngbCollapse.animation = this._accordion.animation;
		// event forwarding from 'ngbCollapse' to 'ngbAccordion'
		ngbCollapse.hidden.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(() => {
			// when the animation finishes we can remove the template from DOM
			this._collapseAnimationRunning = false;
			this.hidden.emit();
			this._accordion.hidden.emit(this.id);
		});
		ngbCollapse.shown.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(() => {
			this.shown.emit();
			this._accordion.shown.emit(this.id);
		});
	}

	/**
	 * Toggles an accordion item.
	 */
	toggle() {
		this.collapsed = !this.collapsed;
	}

	/**
	 * Expands an accordion item.
	 */
	expand() {
		if (this.collapsed) {
			// checking if accordion allows to expand the panel in respect to 'closeOthers' flag
			if (!this._accordion._ensureCanExpand(this)) {
				return;
			}

			this._collapsed = false;

			// need if the accordion is used inside a component having OnPush change detection strategy
			this._cd.markForCheck();

			// we need force CD to get template into DOM before starting animation to calculate its height correctly
			// this will synchronously put the item body into DOM, because `this._collapsed` was flipped to `false`
			this._cd.detectChanges();

			// firing events before starting animations
			this.show.emit();
			this._accordion.show.emit(this.id);

			// we also need to make sure 'animation' flag is up-to- date
			this._collapse.ngbCollapse.animation = this._accordion.animation;
			this._collapse.ngbCollapse.collapsed = false;
		}
	}

	/**
	 * Collapses an accordion item.
	 */
	collapse() {
		if (!this.collapsed) {
			this._collapsed = true;
			this._collapseAnimationRunning = true;

			// need if the accordion is used inside a component having OnPush change detection strategy
			this._cd.markForCheck();

			// firing events before starting animations
			this.hide.emit();
			this._accordion.hide.emit(this.id);

			// we also need to make sure 'animation' flag is up-to- date
			this._collapse.ngbCollapse.animation = this._accordion.animation;
			this._collapse.ngbCollapse.collapsed = true;
		}
	}
}

/**
 * Accordion is a stack of cards that have a header and collapsible body.
 *
 * This directive is a container for these items and provides an API to handle them.
 *
 * @since 14.1.0
 */
@Directive({
	selector: '[ngbAccordion]',
	standalone: true,
	exportAs: 'ngbAccordion',
	host: { '[class.accordion]': 'true' },
})
export class NgbAccordionDirective {
	private _config = inject(NgbAccordionConfig);
	private _anItemWasAlreadyExpandedDuringInitialisation = false;

	@ContentChildren(NgbAccordionItem, { descendants: false }) private _items?: QueryList<NgbAccordionItem>;
	/**
	 * If `true`, accordion will be animated.
	 */
	@Input() animation = this._config.animation;

	/**
	 * If `true`, only one item at the time can stay open.
	 */
	@Input() closeOthers = this._config.closeOthers;
	/**
	 * If `true`, the content of the accordion items body will be removed from the DOM. It will be just hidden otherwise.
	 *
	 * This property can be overwritten at the [`NgbAccordionItem`](#/components/accordion/api#NgbAccordionItem) level
	 */
	@Input() destroyOnHide = this._config.destroyOnHide;

	/**
	 * Event emitted before expanding animation starts. The payload is the id of shown accordion item.
	 *
	 * @since 15.1.0
	 */
	@Output() show = new EventEmitter<string>();

	/**
	 * Event emitted when the expanding animation is finished. The payload is the id of shown accordion item.
	 */
	@Output() shown = new EventEmitter<string>();

	/**
	 * Event emitted before the collapsing animation starts. The payload is the id of hidden accordion item.
	 *
	 * @since 15.1.0
	 */
	@Output() hide = new EventEmitter<string>();

	/**
	 * Event emitted when the collapsing animation is finished and before the content is removed from DOM.
	 * The payload is the id of hidden accordion item.
	 */
	@Output() hidden = new EventEmitter<string>();

	/**
	 * Toggles an item with the given id.
	 *
	 * It will toggle an item, even if it is disabled.
	 *
	 * @param itemId The id of the item to toggle.
	 */
	toggle(itemId: string) {
		this._getItem(itemId)?.toggle();
	}

	/**
	 * Expands an item with the given id.
	 *
	 * If `closeOthers` is `true`, it will collapse other panels.
	 *
	 * @param itemId The id of the item to expand.
	 */
	expand(itemId: string) {
		this._getItem(itemId)?.expand();
	}

	/**
	 * Expands all items.
	 *
	 * If `closeOthers` is `true` and all items are closed, it will open the first one. Otherwise, it will keep the opened one.
	 */
	expandAll() {
		if (this._items) {
			if (this.closeOthers) {
				// we check if there is an item open and if it is not we can expand the first item
				// (otherwise we toggle nothing)
				if (!this._items.find((item) => !item.collapsed)) {
					this._items.first.expand();
				}
			} else {
				this._items.forEach((item) => item.expand());
			}
		}
	}

	/**
	 * Collapses an item with the given id.
	 *
	 * Has no effect if the `itemId` does not correspond to any item.
	 *
	 * @param itemId The id of the item to collapse.
	 */
	collapse(itemId: string) {
		this._getItem(itemId)?.collapse();
	}

	/**
	 * Collapses all items.
	 */
	collapseAll() {
		this._items?.forEach((item) => item.collapse());
	}

	/**
	 * Checks if an item with the given id is expanded.
	 *
	 * If the `itemId` does not correspond to any item, it returns `false`.
	 *
	 * @param itemId The id of the item to check.
	 */
	isExpanded(itemId: string) {
		const item = this._getItem(itemId);
		return item ? !item.collapsed : false;
	}

	/**
	 * It checks, if the item can be expanded in the current state of the accordion.
	 * With `closeOthers` there can be only one expanded item at a time.
	 *
	 * @internal
	 */
	_ensureCanExpand(toExpand: NgbAccordionItem) {
		if (!this.closeOthers) {
			return true;
		}

		// special case during the initialization of the [collapse]="false" inputs
		// `this._items` QueryList is not yet initialized, but we need to ensure only one item can be expanded at a time
		if (!this._items) {
			if (!this._anItemWasAlreadyExpandedDuringInitialisation) {
				this._anItemWasAlreadyExpandedDuringInitialisation = true;
				return true;
			}
			return false;
		}

		// if there is an expanded item, we need to collapse it first
		this._items.find((item) => !item.collapsed && toExpand !== item)?.collapse();

		return true;
	}

	private _getItem(itemId: string): NgbAccordionItem | undefined {
		return this._items?.find((item) => item.id === itemId);
	}
}
