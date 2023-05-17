import {
	AfterContentInit,
	ChangeDetectorRef,
	Component,
	ContentChild,
	ContentChildren,
	Directive,
	EventEmitter,
	forwardRef,
	Inject,
	Input,
	OnDestroy,
	Output,
	QueryList,
	TemplateRef,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { NgbAccordionConfig } from './accordion-config';
import { NgTemplateOutlet } from '@angular/common';
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
@Component({
	selector: '[ngbAccordionBody]',
	standalone: true,
	imports: [NgTemplateOutlet],
	host: { '[class.accordion-body]': 'true' },
	template: `<ng-template [ngTemplateOutlet]="template()"></ng-template>`,
})
export class NgbAccordionBody {
	constructor(@Inject(forwardRef(() => NgbAccordionItem)) private _item: NgbAccordionItem) {}

	@ContentChild(TemplateRef, { static: true }) private _bodyTpl: TemplateRef<any>;

	template() {
		return this._item.destroyOnHide === false || this._item.animatingBodyCollapse ? this._bodyTpl : null;
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
	hostDirectives: [
		{
			directive: NgbCollapse,
		},
	],
})
export class NgbAccordionCollapse {
	constructor(
		@Inject(forwardRef(() => NgbAccordionItem)) public item: NgbAccordionItem,
		public ngbCollapse: NgbCollapse,
	) {}
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
	constructor(
		@Inject(forwardRef(() => NgbAccordionItem)) public item: NgbAccordionItem,
		@Inject(forwardRef(() => NgbAccordionDirective)) public accordion: NgbAccordionDirective,
	) {}
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
	hostDirectives: [
		{
			directive: NgbAccordionToggle,
		},
	],
})
export class NgbAccordionButton {
	constructor(@Inject(forwardRef(() => NgbAccordionItem)) public item: NgbAccordionItem) {}
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
	constructor(@Inject(forwardRef(() => NgbAccordionItem)) public item: NgbAccordionItem) {}
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
export class NgbAccordionItem implements AfterContentInit, OnDestroy {
	constructor(
		@Inject(forwardRef(() => NgbAccordionDirective)) private _accordion: NgbAccordionDirective,
		private _cd: ChangeDetectorRef,
	) {}

	private _subscriptions: Subscription[] = [];
	private _collapsed = true;
	private _id = `ngb-accordion-item-${nextId++}`;

	animatingBodyCollapse = false;

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
	@Input() destroyOnHide = this._accordion.destroyOnHide;

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
		if (this.collapsed !== collapsed) {
			// checking if accordion allows to expand the panel in respect to 'closeOthers' flag
			if (this.collapsed && !this._accordion._ensureCanExpand(this)) {
				return;
			}

			this._collapsed = collapsed;
			this._cd.markForCheck(); // need if the accordion is used inside a component having OnPush change detection strategy
			// we need force CD to get template into DOM before starting animation to calculate its height correctly
			if (!this.collapsed) {
				this.animatingBodyCollapse = true;
				this._cd.detectChanges();
			}
			// we also need to make sure 'animation' flag is up-to- date
			this._collapse.ngbCollapse.animation = this._accordion.animation;
			this._collapse.ngbCollapse.collapsed = this.collapsed;
		}
	}

	/**
	 * Event emitted when the expanding animation is finished. It has no payload.
	 */
	@Output() shown = new EventEmitter<void>();

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

	ngAfterContentInit() {
		const { ngbCollapse } = this._collapse;
		// we need to disable the animation for the first init
		ngbCollapse.animation = false;
		ngbCollapse.collapsed = this.collapsed;
		// we set the animation to the default of the accordion
		ngbCollapse.animation = this._accordion.animation;
		// event forwarding from 'ngbCollapse' to 'ngbAccordion'
		this._subscriptions.push(
			ngbCollapse.hidden.subscribe(() => {
				// when the animation finishes we can remove the template from DOM
				this.animatingBodyCollapse = false;
				this.hidden.emit();
				this._accordion.hidden.emit(this.id);
			}),
			ngbCollapse.shown.subscribe(() => {
				this.shown.emit();
				this._accordion.shown.emit(this.id);
			}),
		);
	}

	ngOnDestroy() {
		this._subscriptions.forEach((s) => s.unsubscribe());
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
		this.collapsed = false;
	}

	/**
	 * Collapses an accordion item.
	 */
	collapse() {
		this.collapsed = true;
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
	exportAs: 'ngbAccordion',
	standalone: true,
	selector: '[ngbAccordion]',
	host: { '[class.accordion]': 'true' },
})
export class NgbAccordionDirective {
	@ContentChildren(NgbAccordionItem, { descendants: false }) private _items?: QueryList<NgbAccordionItem>;
	/**
	 * If `true`, accordion will be animated.
	 */
	@Input() animation: boolean;

	/**
	 * If `true`, only one item at the time can stay open.
	 */
	@Input() closeOthers: boolean;

	/**
	 * If `true`, the content of the accordion items body will be removed from the DOM. It will be just hidden otherwise.
	 *
	 * This property can be overwritten at the [`NgbAccordionItem`](#/components/accordion/api#NgbAccordionItem) level
	 */
	@Input() destroyOnHide = true;

	/**
	 * Event emitted when the expanding animation is finished. The payload is the id of shown accordion item.
	 */
	@Output() shown = new EventEmitter<string>();

	/**
	 * Event emitted when the collapsing animation is finished and before the content is removed from DOM.
	 * The payload is the id of hidden accordion item.
	 */
	@Output() hidden = new EventEmitter<string>();

	private _anItemWasAlreadyExpandedDuringInitialisation = false;

	constructor(config: NgbAccordionConfig) {
		this.animation = config.animation;
		this.closeOthers = config.closeOthers;
	}

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
