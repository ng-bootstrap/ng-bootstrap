import {
	AfterContentChecked,
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
	OnChanges,
	OnDestroy,
	Output,
	QueryList,
	SimpleChanges,
	TemplateRef,
} from '@angular/core';
import { NgbCollapse } from '../collapse/collapse';
import { NgTemplateOutlet } from '@angular/common';
import { Subscription } from 'rxjs';
import { NgbAccordionConfig } from './accordion-config';
import { isString } from '../util/util';

/*
 * This is the proof of concept for the new Accordion component.
 *
 * What is missing:
 * - [ ] proper string ID generation
 * - [ ] activeIDs implementation, but I think we should explore removing it completely
 */

@Directive({
	selector: '[ngbAccordionHeader]',
	standalone: true,
	host: { '[class.accordion-header]': 'true', '[id]': 'item.headingId' },
})
export class NgbAccordionHeader {
	constructor(@Inject(forwardRef(() => NgbAccordionItem)) public item: NgbAccordionItem) {}
}

@Directive({
	selector: '[ngbAccordionToggle]',
	standalone: true,
	host: {
		'[class.accordion-button]': 'true',
		type: 'button',
		'(click)': 'accordion.toggle(item.id)',
		'[class.collapsed]': 'item.collapsed',
		'[attr.aria-expanded]': '!item.collapsed',
		'[attr.aria-controls]': 'item.collapseId',
	},
})
export class NgbAccordionToggle {
	constructor(
		@Inject(forwardRef(() => NgbAccordionItem)) public item: NgbAccordionItem,
		@Inject(forwardRef(() => NgbAccordionDirective)) public accordion: NgbAccordionDirective,
	) {}
}

@Directive({
	selector: '[ngbAccordionCollapse]',
	standalone: true,
	host: { '[class.accordion-collapse]': 'true', '[attr.aria-Labelledby]': 'item.headingId', '[id]': 'item.collapseId' },
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

	@Input() set ngbAccordionCollapse(collapsed: boolean) {
		// if it's not set in the template it will be initialized with empty string and will break 'ngbCollapse'
		if (collapsed === true || collapsed === false) {
			this.item.collapsed = collapsed;
		}
	}
}

@Component({
	selector: '[ngbAccordionBody]',
	standalone: true,
	imports: [NgTemplateOutlet],
	host: { '[class.accordion-body]': 'true' },
	template: ` <ng-template [ngTemplateOutlet]="shouldPutBodyInDOM() ? this.template : null"></ng-template>`,
})
export class NgbAccordionBody {
	@ContentChild(TemplateRef) template: TemplateRef<any>;
	@Input() destroyOnHide = true;

	constructor(@Inject(forwardRef(() => NgbAccordionItem)) public item: NgbAccordionItem) {}

	shouldPutBodyInDOM() {
		return this.destroyOnHide === false || this.item.animatingBodyCollapse;
	}
}

@Directive({ selector: '[ngbAccordionItem]', standalone: true, host: { '[class.accordion-item]': 'true' } })
export class NgbAccordionItem implements AfterContentInit, OnDestroy {
	animatingBodyCollapse = false;

	private _collapsed = true;
	private _subscriptions: Subscription[] = [];

	@Input('ngbAccordionItem') id: string;

	@ContentChild(NgbAccordionToggle, { static: true }) private _button: NgbAccordionToggle;
	@ContentChild(NgbAccordionCollapse, { static: true }) private _collapse: NgbAccordionCollapse;

	constructor(
		@Inject(forwardRef(() => NgbAccordionDirective)) private _accordion: NgbAccordionDirective,
		private _cd: ChangeDetectorRef,
	) {}

	ngAfterContentInit() {
		const { ngbCollapse } = this._collapse;
		ngbCollapse.collapsed = this.collapsed;

		// event forwarding from 'ngbCollapse' to 'ngbAccordion'
		this._subscriptions.push(
			ngbCollapse.hidden.subscribe(() => {
				// when the animation finishes we can remove the template from DOM
				this.animatingBodyCollapse = false;
				this._accordion.hidden.emit(this.id);
			}),
			ngbCollapse.shown.subscribe(() => {
				this._accordion.shown.emit(this.id);
			}),
		);
	}

	ngOnDestroy() {
		for (const subscription of this._subscriptions) {
			subscription?.unsubscribe();
		}
	}

	get headingId() {
		return `ngb-accordion-heading-${this.id}`;
	}

	get collapseId() {
		return `ngb-accordion-collapse-${this.id}`;
	}

	set collapsed(collapsed: boolean) {
		if (this.collapsed !== collapsed) {
			this._collapsed = collapsed;

			// we need force CD to get template into DOM before starting animation to calculate its height correctly
			if (!collapsed) {
				this.animatingBodyCollapse = true;
				this._cd.detectChanges();
			}
			// we also need to make sure 'animation' flag is up-to- date
			this._collapse.ngbCollapse.animation = this._accordion.animation;
			this._collapse.ngbCollapse.collapsed = collapsed;
		}
	}

	get collapsed() {
		return this._collapsed;
	}

	toggle() {
		this.collapsed = !this.collapsed;
	}
}

@Directive({ selector: '[ngbAccordion]', standalone: true, host: { '[class.accordion]': 'true' } })
export class NgbAccordionDirective implements AfterContentChecked, OnChanges {
	@Input() animation: boolean;
	@Input() closeOthers: boolean;
	@Input() activeIds: string | readonly string[] = [];

	@Output() shown = new EventEmitter<string>();
	@Output() hidden = new EventEmitter<string>();

	private refreshActiveIds = false;

	@ContentChildren(NgbAccordionItem) private _items: QueryList<NgbAccordionItem>;

	ngOnChanges({ activeIds }: SimpleChanges) {
		if (activeIds) {
			this.refreshActiveIds = true;
			if (isString(this.activeIds)) {
				this.activeIds = this.activeIds.split(/\s*,\s*/);
			}
		}
	}

	ngAfterContentChecked() {
		if (this.activeIds.length !== 0 && this.refreshActiveIds) {
			this.refreshActiveIds = false;
			this._items.forEach((item) => {
				item.collapsed = !this.activeIds.includes(item.id);
			});
		}
	}

	toggle(id: string) {
		this._items.forEach((item) => {
			if (item.id === id) {
				item.toggle();
			} else if (this.closeOthers) {
				item.collapsed = true;
			}
		});
	}

	constructor(config: NgbAccordionConfig) {
		this.animation = config.animation;
		this.closeOthers = config.closeOthers;
	}
}
