import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { createGenericTestComponent, isBrowserVisible } from '../test/common';

import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	Inject,
	input,
	QueryList,
	signal,
	ViewChild,
	ViewChildren,
} from '@angular/core';

import {
	NgbAccordionButton,
	NgbAccordionConfig,
	NgbAccordionDirective,
	NgbAccordionItem,
	NgbAccordionHeader,
	NgbAccordionCollapse,
	NgbAccordionBody,
	NgbAccordionToggle,
} from './accordion.module';
import { NgbConfig } from '@ng-bootstrap/ng-bootstrap/config';
import { NgbConfigAnimation } from '../test/ngb-config-animation';
import { assert, beforeEach, describe, expect, it, vi } from 'vitest';

const createTestComponent = (html: string) =>
	createGenericTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;

function getCollapses(element: HTMLElement): HTMLDivElement[] {
	return <HTMLDivElement[]>Array.from(element.querySelectorAll('.accordion-item > .accordion-collapse'));
}

function getCollapseContent(element: HTMLElement): HTMLDivElement[] {
	return <HTMLDivElement[]>(
		Array.from(element.querySelectorAll('.accordion-item > .collapse.accordion-collapse > .accordion-body'))
	);
}

function getPanelsButtons(element: HTMLElement): HTMLButtonElement[] {
	return <HTMLButtonElement[]>Array.from(element.querySelectorAll('.accordion-item > .accordion-header button'));
}

function getPanelsTitle(element: HTMLElement): string[] {
	return getPanelsButtons(element).map((button) => button.textContent!.trim());
}

function getCollapseBodyContent(collapseElement: HTMLElement): string {
	return collapseElement.querySelector('.accordion-body')!.textContent!.trim();
}

function getHeaders(element: HTMLElement): HTMLElement[] {
	return <HTMLButtonElement[]>Array.from(element.querySelectorAll('.accordion-item > .accordion-heading'));
}

function getButton(element: HTMLElement, index: number): HTMLButtonElement {
	return <HTMLButtonElement>element.querySelectorAll('button[type="button"]')[index];
}

function getItem(element: HTMLElement, index: number): HTMLElement {
	return <HTMLElement>element.querySelectorAll('.accordion-item')[index];
}

function getItemsIds(element: HTMLElement): string[] {
	return Array.from(element.querySelectorAll('.accordion-item')).map((el) => el.id);
}

function expectOpenPanels(nativeEl: HTMLElement, openPanelsDef: boolean[]) {
	const noOfOpenPanelsExpected = openPanelsDef.reduce((soFar, def) => (def ? soFar + 1 : soFar), 0);
	const collapseElements = getCollapses(nativeEl);
	expect(collapseElements.length, 'number of collapse elements').toBe(openPanelsDef.length);

	const panelsButton = getPanelsButtons(nativeEl);
	const result = panelsButton.map((titleEl) => {
		const isAriaExpanded = titleEl.getAttribute('aria-expanded') === 'true';
		const isCSSCollapsed = titleEl.classList.contains('collapsed');
		return isAriaExpanded === !isCSSCollapsed ? isAriaExpanded : assert.fail('inconsistent state');
	});
	const noOfOpenPanels = collapseElements
		.map((collapse) => {
			return collapse.classList.contains('show');
		})
		.reduce((soFar, def) => (def ? soFar + 1 : soFar), 0);

	expect(noOfOpenPanels, 'number of open panels').toBe(noOfOpenPanelsExpected);
	expect(result).toEqual(openPanelsDef);
}

describe('ngb-accordion directive', () => {
	let html = `
		<div ngbAccordion #acc="ngbAccordion"
			[closeOthers]="closeOthers()" [destroyOnHide]="destroyOnHide()"
			(show)="showCallback($event)" (hide)="hideCallback($event)"
			(shown)="shownCallback($event)" (hidden)="hiddenCallback($event)">
			@for (item of items; track item) {
				<div ngbAccordionItem
					[disabled]="item.disabled()"
					[collapsed]="item.collapsed()"
					[destroyOnHide]="item.destroyOnHide()"
					(show) = "itemShowCallback($event)"
					(shown) = "itemShownCallback($event)"
					(hide) = "itemHideCallback($event)"
					(hidden) = "itemHiddenCallback($event)"
					>
					<h2 ngbAccordionHeader>
						<button ngbAccordionButton>{{item.header}}</button>
					</h2>
					<div ngbAccordionCollapse>
						<div ngbAccordionBody><ng-template>{{item.body}}</ng-template></div>
					</div>
				</div>
			}
		</div>
		@for (panel of panels; track panel) {
			<button (click)="acc.toggle(panel.id)">Toggle the panel {{ panel.id }}</button>
		}
	`;
	beforeEach(() => {
		TestBed.overrideComponent(TestComponent, { set: { template: html } });
	});

	it('should initialize inputs with default values', () => {
		const defaultConfig = TestBed.inject(NgbAccordionConfig);

		TestBed.runInInjectionContext(() => {
			let accordion = new NgbAccordionDirective();
			expect(accordion.closeOthers).toBe(defaultConfig.closeOthers);
			expect(accordion.animation).toBe(defaultConfig.animation);
		});
	});

	it('should have no open panels', () => {
		const fixture = TestBed.createComponent(TestComponent);
		fixture.detectChanges();

		const el = fixture.nativeElement;
		expectOpenPanels(el, [false, false, false]);
	});

	it('should have proper css classes', () => {
		const fixture = TestBed.createComponent(TestComponent);
		fixture.detectChanges();

		const accordion = fixture.debugElement.query(By.directive(NgbAccordionDirective));
		expect(accordion.nativeElement).toHaveCssClass('accordion');
	});

	it('should have the appropriate collapse', () => {
		const fixture = TestBed.createComponent(TestComponent);
		fixture.detectChanges();
		const el = fixture.nativeElement;
		const collapses = getCollapses(el);
		const buttons = getPanelsButtons(el);
		collapses.forEach((collapse, idx) => {
			expect(collapse.getAttribute('aria-labelledby')).toBe(buttons[idx].id);
			expect(collapse).toHaveCssClass('collapse');
		});
	});

	it('should toggle panels independently', async () => {
		const fixture = TestBed.createComponent(TestComponent);
		fixture.detectChanges();

		const el = fixture.nativeElement;

		getButton(el, 1).click();
		// expanding triggers change detection for animation reasons
		expectOpenPanels(el, [false, true, false]);

		getButton(el, 0).click();
		// expanding triggers change detection for animation reasons
		expectOpenPanels(el, [true, true, false]);

		getButton(el, 1).click();
		fixture.detectChanges();
		await fixture.whenStable();
		expectOpenPanels(el, [true, false, false]);

		getButton(el, 2).click();
		// expanding triggers change detection for animation reasons
		expectOpenPanels(el, [true, false, true]);

		getButton(el, 0).click();
		await fixture.whenStable();
		expectOpenPanels(el, [false, false, true]);

		getButton(el, 2).click();
		await fixture.whenStable();
		expectOpenPanels(el, [false, false, false]);
	});

	it('should allow only one panel to be active with "closeOthers" flag', () => {
		const fixture = TestBed.createComponent(TestComponent);
		fixture.detectChanges();

		fixture.componentRef.setInput('closeOthers', true);
		const el = fixture.nativeElement;

		getButton(el, 0).click();
		expectOpenPanels(el, [true, false, false]);

		getButton(el, 1).click();
		expectOpenPanels(el, [false, true, false]);
	});

	it('should have the appropriate heading', () => {
		const fixture = TestBed.createComponent(TestComponent);
		fixture.detectChanges();

		const el = fixture.nativeElement;

		const titles = getPanelsTitle(el);
		expect(titles.length).not.toBe(0);
		titles.forEach((title, idx) => {
			expect(title).toBe(`Panel ${idx + 1}`);
		});
	});

	it('should not crash for an empty accordion', () => {
		const fixture = createTestComponent('<div ngbAccordion></div>');
		fixture.detectChanges();
		expect(getCollapses(fixture.nativeElement).length).toBe(0);
	});

	it('should not crash for panels without content', () => {
		const fixture = createTestComponent(`<div ngbAccordion>
				<div ngbAccordionItem>
					<h2 ngbAccordionHeader><button ngbAccordionButton>Toggle</button></h2>
					<div ngbAccordionCollapse><div ngbAccordionBody></div></div>
				</div>
			</div>`);
		fixture.detectChanges();
		const panelsContent = getCollapseContent(fixture.nativeElement);

		expect(panelsContent.length).toBe(1);
		expect(panelsContent[0].textContent!.trim()).toBe('');
	});

	it('should have the appropriate content', () => {
		const fixture = TestBed.createComponent(TestComponent);
		fixture.detectChanges();
		fixture.componentInstance.items.forEach((item) => item.destroyOnHide.set(false));

		getCollapses(fixture.nativeElement).forEach((collapse, idx) => {
			expect(getCollapseBodyContent(collapse)).toBe(fixture.componentInstance.items[idx].body);
		});
	});

	it('should remove body content from DOM', async () => {
		const fixture = TestBed.createComponent(TestComponent);
		fixture.detectChanges();

		fixture.componentInstance.items.forEach((item) => item.destroyOnHide.set(true));
		await fixture.whenStable();

		getCollapses(fixture.nativeElement).forEach((collapse) => {
			expect(getCollapseBodyContent(collapse)).toBe('');
		});
	});

	it('should not remove body content if destroyOnHide is false on the accordion and unset for the items', () => {
		const fixture = createTestComponent(`<div ngbAccordion [destroyOnHide]="false">
				@for (item of items; track item) {
					<div ngbAccordionItem>
						<h2 ngbAccordionHeader>
							<button ngbAccordionButton>{{item.header}}</button>
						</h2>
						<div ngbAccordionCollapse>
							<div ngbAccordionBody><ng-template>{{item.body}}</ng-template></div>
						</div>
					</div>
				}
			</div>`);
		fixture.detectChanges();

		getCollapses(fixture.nativeElement).forEach((collapse, idx) => {
			expect(getCollapseBodyContent(collapse)).toBe(fixture.componentInstance.items[idx].body);
		});
	});

	it('should respect destroyOnHide on the accordion-item if is set in accordion and accordion-item', async () => {
		const fixture = createTestComponent(`<div ngbAccordion [destroyOnHide]="false">
				@for (item of items; track item) {
					<div ngbAccordionItem [destroyOnHide]="item.destroyOnHide()">
						<h2 ngbAccordionHeader>
							<button ngbAccordionButton>{{item.header}}</button>
						</h2>
						<div ngbAccordionCollapse>
							<div ngbAccordionBody><ng-template>{{item.body}}</ng-template></div>
						</div>
					</div>
				}
			</div>`);
		fixture.detectChanges();

		fixture.componentInstance.items[0].destroyOnHide.set(true);
		await fixture.whenStable();

		getCollapses(fixture.nativeElement).forEach((collapse, idx) => {
			expect(getCollapseBodyContent(collapse)).toBe(idx === 0 ? '' : fixture.componentInstance.items[idx].body);
		});
	});

	it(`should allow customizing headers with 'NgbAccordionToggle'`, async () => {
		const fixture = createTestComponent(`<div ngbAccordion>
				@for (item of items; track item; let index = $index) {
					<div [ngbAccordionItem]="'custom-' + index">
						<div ngbAccordionHeader class='accordion-button'>
							<button type='button' ngbAccordionToggle>{{item.header}}</button>
						</div>
						<div ngbAccordionCollapse>
							<div ngbAccordionBody><ng-template>{{item.body}}</ng-template></div>
						</div>
					</div>
				}
			</div>`);
		fixture.detectChanges();

		const el = fixture.nativeElement;
		expectOpenPanels(el, [false, false, false]);

		// open second
		getButton(el, 1).click();
		expectOpenPanels(el, [false, true, false]);

		// close second
		getButton(el, 1).click();
		await fixture.whenStable();
		expectOpenPanels(el, [false, false, false]);
	});

	it(`should no allow clicking on disabled headers with 'NgbAccordionToggle'`, () => {
		const fixture = createTestComponent(`<div ngbAccordion>
				<div ngbAccordionItem [disabled]="true">
					<div ngbAccordionHeader class="accordion-button">
						<button type='button' ngbAccordionToggle>Toggle</button>
					</div>
					<div ngbAccordionCollapse>
						<div ngbAccordionBody><ng-template>Body</ng-template></div>
					</div>
				</div>
			</div>`);
		fixture.detectChanges();

		const el = fixture.nativeElement;
		expectOpenPanels(el, [false]);

		// user click should not open the panel
		getButton(el, 0).click();
		expectOpenPanels(el, [false]);
	});

	it('should remove body content from DOM only for the first collapse', async () => {
		const fixture = TestBed.createComponent(TestComponent);
		fixture.detectChanges();

		const originalItems = fixture.componentInstance.items;
		originalItems[0].destroyOnHide.set(true);
		await fixture.whenStable();

		getCollapses(fixture.nativeElement).forEach((collapse, idx) => {
			if (idx === 0) {
				expect(getCollapseBodyContent(collapse)).toBe('');
			} else {
				expect(getCollapseBodyContent(collapse)).toBe(originalItems[idx].body);
			}
		});
	});

	it('should have a custom panel id', () => {
		const fixture = createTestComponent(`<div ngbAccordion>
				@for (item of items; track item; let index = $index) {
					<div [ngbAccordionItem]="'custom-' + index">
						<h2 ngbAccordionHeader>
							<button ngbAccordionButton>{{item.header}}</button>
						</h2>
						<div ngbAccordionCollapse>
							<div ngbAccordionBody><ng-template>{{item.body}}</ng-template></div>
						</div>
					</div>
				}
			</div>`);
		fixture.detectChanges();
		expect(getItemsIds(fixture.nativeElement)).toEqual(['custom-0', 'custom-1', 'custom-2']);
	});

	it('should remove body content from DOM if destroyOnHide is not set on accordion and on accordion-item', () => {
		const fixture = createTestComponent(`<div ngbAccordion>
				@for (item of items; track item) {
					<div ngbAccordionItem>
						<h2 ngbAccordionHeader>
							<button ngbAccordionButton>{{item.header}}</button>
						</h2>
						<div ngbAccordionCollapse>
							<div ngbAccordionBody><ng-template>{{item.body}}</ng-template></div>
						</div>
					</div>
				}
			</div>`);
		fixture.detectChanges();

		getCollapses(fixture.nativeElement).forEach((collapse) => {
			expect(getCollapseBodyContent(collapse)).toBe('');
		});
	});

	it('should not toggle disabled items', async () => {
		const fixture = TestBed.createComponent(TestComponent);
		fixture.detectChanges();

		fixture.componentInstance.items[0].disabled.set(true);
		await fixture.whenStable();
		const el = fixture.nativeElement;

		expectOpenPanels(el, [false, false, false]);

		getButton(el, 0).click();
		expectOpenPanels(el, [false, false, false]);
	});

	it('should not change collapse when panels are disabled', async () => {
		const fixture = TestBed.createComponent(TestComponent);
		fixture.detectChanges();

		const oItems = fixture.componentInstance.items;
		const el = fixture.nativeElement;
		oItems[0].collapsed.set(false);
		await fixture.whenStable();

		expectOpenPanels(el, [true, false, false]);

		oItems[0].disabled.set(true);
		await fixture.whenStable();
		expectOpenPanels(el, [true, false, false]);

		oItems[0].disabled.set(false);
		await fixture.whenStable();
		expectOpenPanels(el, [true, false, false]);

		getButton(el, 0).click();
		await fixture.whenStable();
		expectOpenPanels(el, [false, false, false]);
	});

	it('should have correct disabled state', async () => {
		const fixture = TestBed.createComponent(TestComponent);
		fixture.detectChanges();

		const oItems = fixture.componentInstance.items;
		const el = fixture.nativeElement;

		oItems[0].collapsed.set(false);
		await fixture.whenStable();

		const toggleButtons = getPanelsButtons(el);
		expectOpenPanels(el, [true, false, false]);
		expect(toggleButtons[0].disabled).toBeFalsy();

		oItems[0].disabled.set(true);
		await fixture.whenStable();
		expectOpenPanels(el, [true, false, false]);
		expect(toggleButtons[0].disabled).toBeTruthy();
	});

	it(`should allow using 'ngbAccordionItem' from the template`, async () => {
		const fixture = createTestComponent(`<div ngbAccordion>
					<div ngbAccordionItem='item' #item='ngbAccordionItem' [collapsed]='false'>
						<h2 ngbAccordionHeader>
							<button ngbAccordionButton>{{ item.collapsed ? 'collapsed-' : 'expanded-' }}{{ item.disabled ? 'disabled' : 'enabled' }}</button>
						</h2>
						<div ngbAccordionCollapse><div ngbAccordionBody></div></div>
					</div>
				</div>
				<button id="btn-toggle" (click)='item.toggle()'></button>
				<button id="btn-expand" (click)='item.collapsed = false'></button>
				<button id="btn-disable" (click)='item.disabled = true'></button>`);
		fixture.detectChanges();

		const el = fixture.nativeElement;

		// initial state
		expect(getPanelsTitle(el)).toEqual(['expanded-enabled']);

		// toggling via item.toggle()
		el.querySelector('#btn-toggle').click();
		await fixture.whenStable();
		expect(getPanelsTitle(el)).toEqual(['collapsed-enabled']);

		// expanding via item.collapsed = false
		el.querySelector('#btn-expand').click();
		expect(getPanelsTitle(el)).toEqual(['expanded-enabled']);

		// changing disabled state via item.disabled = true
		el.querySelector('#btn-disable').click();
		await fixture.whenStable();
		expect(getPanelsTitle(el)).toEqual(['expanded-disabled']);
	});

	it(`should allow using 'ngbAccordionItem' from the template in a loop`, async () => {
		const fixture = createTestComponent(`<div ngbAccordion>
				@for (i of items; track i) {
					<div ngbAccordionItem #item='ngbAccordionItem'[collapsed]='i.collapsed()' [disabled]='i.disabled()'>
						<h2 ngbAccordionHeader>
							<button ngbAccordionButton>{{ item.collapsed ? 'collapsed-' : 'expanded-' }}{{ item.disabled ? 'disabled' : 'enabled' }}</button>
						</h2>
						<div ngbAccordionCollapse><div ngbAccordionBody></div></div>
					</div>
				}
			</div>`);
		fixture.detectChanges();

		const el = fixture.nativeElement;

		expect(getPanelsTitle(el)).toEqual(['collapsed-enabled', 'collapsed-enabled', 'collapsed-enabled']);

		fixture.componentInstance.items[1].disabled.set(true);
		fixture.componentInstance.items[0].collapsed.set(false);
		await fixture.whenStable();

		expect(getPanelsTitle(el)).toEqual(['expanded-enabled', 'collapsed-disabled', 'collapsed-enabled']);
	});

	it('should emit panel events when toggling panels', () => {
		const fixture = TestBed.createComponent(TestComponent);
		fixture.detectChanges();

		const el = fixture.nativeElement;
		const ci = fixture.componentInstance;

		vi.spyOn(ci, 'showCallback');
		vi.spyOn(ci, 'shownCallback');
		vi.spyOn(ci, 'hideCallback');
		vi.spyOn(ci, 'hiddenCallback');
		vi.spyOn(ci, 'itemShowCallback');
		vi.spyOn(ci, 'itemShownCallback');
		vi.spyOn(ci, 'itemHideCallback');
		vi.spyOn(ci, 'itemHiddenCallback');

		getButton(el, 0).click();
		const itemId = getItem(el, 0).id;

		expect(fixture.componentInstance.showCallback).toHaveBeenCalledWith(itemId);
		expect(fixture.componentInstance.shownCallback).toHaveBeenCalledWith(itemId);
		expect(fixture.componentInstance.itemShowCallback).toHaveBeenCalledWith(undefined);
		expect(fixture.componentInstance.itemShownCallback).toHaveBeenCalledWith(undefined);

		getButton(el, 0).click();
		expect(fixture.componentInstance.hideCallback).toHaveBeenCalledWith(itemId);
		expect(fixture.componentInstance.hiddenCallback).toHaveBeenCalledWith(itemId);
		expect(fixture.componentInstance.itemHideCallback).toHaveBeenCalledWith(undefined);
		expect(fixture.componentInstance.itemHiddenCallback).toHaveBeenCalledWith(undefined);
	});

	it('should have the proper roles', async () => {
		const fixture = TestBed.createComponent(TestComponent);
		fixture.detectChanges();

		const el = fixture.nativeElement;
		fixture.componentInstance.items.forEach((item) => item.collapsed.set(false));
		await fixture.whenStable();

		getHeaders(el).forEach((header) => expect(header.getAttribute('role')).toBe('heading'));

		getCollapses(el).forEach((collapse) => expect(collapse.getAttribute('role')).toBe('region'));
	});

	it(`should toggle '.collapsed' class on header when panel is toggled`, async () => {
		const fixture = createTestComponent(`
			<div ngbAccordion>
				<div ngbAccordionItem [collapsed]="false">
					<div ngbAccordionHeader><button ngbAccordionToggle>Toggle</button></div>
					<div ngbAccordionCollapse><div ngbAccordionBody></div></div>
				</div>
			</div>
		`);
		fixture.detectChanges();

		const header = fixture.nativeElement.querySelector('[ngbAccordionHeader]');
		const toggle = fixture.nativeElement.querySelector('[ngbAccordionToggle]');

		expect(header).not.toHaveCssClass('collapsed');

		toggle.click();
		await fixture.whenStable();
		expect(header).toHaveCssClass('collapsed');
	});

	describe('closeOthers', () => {
		@Component({
			imports: [
				NgbAccordionDirective,
				NgbAccordionItem,
				NgbAccordionHeader,
				NgbAccordionButton,
				NgbAccordionCollapse,
				NgbAccordionBody,
			],
			template: `
				<div ngbAccordion #accordion="ngbAccordion" [closeOthers]="true">
					@for (_ of state; track $index) {
						<div [ngbAccordionItem]="keys[$index]" #item="ngbAccordionItem" [collapsed]="state[$index]">
							<h2 ngbAccordionHeader>
								<button ngbAccordionButton>{{ item.collapsed }}</button>
							</h2>
							<div ngbAccordionCollapse>
								<div ngbAccordionBody></div>
							</div>
						</div>
					}
				</div>
			`,
			changeDetection: ChangeDetectionStrategy.OnPush,
		})
		class CloseOthersComponent {
			keys = ['one', 'two', 'three', 'four'];

			@ViewChild(NgbAccordionDirective)
			accordion: NgbAccordionDirective;
			@ViewChildren(NgbAccordionItem)
			items: QueryList<NgbAccordionItem>;

			constructor(
				@Inject('state')
				public state: boolean[],
			) {}
		}

		it(`should allow expanding one panel initially`, () => {
			TestBed.overrideProvider('state', { useValue: [true, false, true] });
			const fixture = TestBed.createComponent(CloseOthersComponent);
			fixture.detectChanges();

			expect(getPanelsTitle(fixture.nativeElement)).toEqual(['true', 'false', 'true']);
		});

		it(`should work with one panel opened initially + collapse on click`, async () => {
			TestBed.overrideProvider('state', { useValue: [true, false, true] });
			const fixture = TestBed.createComponent(CloseOthersComponent);
			fixture.detectChanges();

			getButton(fixture.nativeElement, 1).click();
			await fixture.whenStable();
			expect(getPanelsTitle(fixture.nativeElement)).toEqual(['true', 'true', 'true']);
		});

		it(`should work with one panel opened initially + collapse on item.toggle()`, async () => {
			TestBed.overrideProvider('state', { useValue: [true, false, true] });
			const fixture = TestBed.createComponent(CloseOthersComponent);
			fixture.detectChanges();

			fixture.componentInstance.items.get(1)!.toggle();
			await fixture.whenStable();
			expect(getPanelsTitle(fixture.nativeElement)).toEqual(['true', 'true', 'true']);
		});

		it(`should work with one panel opened initially + collapse on item.collapse = true`, async () => {
			TestBed.overrideProvider('state', { useValue: [true, false, true] });
			const fixture = TestBed.createComponent(CloseOthersComponent);
			fixture.detectChanges();

			fixture.componentInstance.items.get(1)!.collapsed = true;
			await fixture.whenStable();
			expect(getPanelsTitle(fixture.nativeElement)).toEqual(['true', 'true', 'true']);
		});

		it(`should work with one panel opened initially + collapse on accordion.toggle(item)`, async () => {
			TestBed.overrideProvider('state', { useValue: [true, false, true] });
			const fixture = TestBed.createComponent(CloseOthersComponent);
			fixture.detectChanges();

			fixture.componentInstance.accordion.toggle('two');
			await fixture.whenStable();
			expect(getPanelsTitle(fixture.nativeElement)).toEqual(['true', 'true', 'true']);
		});

		it(`should work with one panel opened initially + expand on click`, () => {
			TestBed.overrideProvider('state', { useValue: [true, false, true] });
			const fixture = TestBed.createComponent(CloseOthersComponent);
			fixture.detectChanges();

			getButton(fixture.nativeElement, 0).click();
			expect(getPanelsTitle(fixture.nativeElement)).toEqual(['false', 'true', 'true']);
		});

		it(`should work with one panel opened initially + expand on item.toggle()`, () => {
			TestBed.overrideProvider('state', { useValue: [true, false, true] });
			const fixture = TestBed.createComponent(CloseOthersComponent);
			fixture.detectChanges();

			fixture.componentInstance.items.get(0)!.toggle();
			expect(getPanelsTitle(fixture.nativeElement)).toEqual(['false', 'true', 'true']);
		});

		it(`should work with one panel opened initially + expand on item.collapse = false`, () => {
			TestBed.overrideProvider('state', { useValue: [true, false, true] });
			const fixture = TestBed.createComponent(CloseOthersComponent);
			fixture.detectChanges();

			fixture.componentInstance.items.get(0)!.collapsed = false;
			expect(getPanelsTitle(fixture.nativeElement)).toEqual(['false', 'true', 'true']);
		});

		it(`should work with one panel opened initially + expand on accordion.toggle(item)`, () => {
			TestBed.overrideProvider('state', { useValue: [true, false, true] });
			const fixture = TestBed.createComponent(CloseOthersComponent);
			fixture.detectChanges();

			fixture.componentInstance.accordion.toggle('one');
			expect(getPanelsTitle(fixture.nativeElement)).toEqual(['false', 'true', 'true']);
		});

		it(`should not allow expanding multiple panels initially`, () => {
			TestBed.overrideProvider('state', { useValue: [false, false, false, true] });
			const fixture = TestBed.createComponent(CloseOthersComponent);
			fixture.detectChanges();
			expect(getPanelsTitle(fixture.nativeElement)).toEqual(['false', 'true', 'true', 'true']);
		});
	});

	describe('imperative API', () => {
		function createTestImperativeAccordion(testHtml: string) {
			const fixture = createTestComponent(testHtml);
			fixture.detectChanges();
			const directiveEl = fixture.debugElement.query(By.directive(NgbAccordionDirective));
			const accordionDirective = directiveEl.injector.get(NgbAccordionDirective);
			const nativeElement = fixture.nativeElement;
			return { fixture, accordionDirective, nativeElement };
		}

		it(`ensure methods don't fail when called before view init`, () => {
			TestBed.runInInjectionContext(() => {
				const accordion = new NgbAccordionDirective();
				accordion.toggle('one');
				accordion.collapse('one');
				accordion.expand('one');
				accordion.expandAll();
				accordion.collapseAll();
				accordion.isExpanded('one');
			});
		});

		it('should check if a panel with a given id is expanded', () => {
			const html = `
				<div ngbAccordion>
					<div ngbAccordionItem [collapsed]="false">
						<h2 ngbAccordionHeader><button ngbAccordionButton>Toggle</button></h2>
						<div ngbAccordionCollapse><div ngbAccordionBody></div></div>
					</div>
					<div ngbAccordionItem>
						<h2 ngbAccordionHeader><button ngbAccordionButton>Toggle</button></h2>
						<div ngbAccordionCollapse><div ngbAccordionBody></div></div>
					</div>
				</div>`;
			const { accordionDirective, nativeElement } = createTestImperativeAccordion(html);
			expectOpenPanels(nativeElement, [true, false]);
			const ids = getItemsIds(nativeElement);
			expect(accordionDirective.isExpanded(ids[0])).toBe(true);
			expect(accordionDirective.isExpanded(ids[1])).toBe(false);
		});

		it('should expanded and collapse individual panels', async () => {
			const html = `
			<div ngbAccordion>
				<div ngbAccordionItem>
					<h2 ngbAccordionHeader><button ngbAccordionButton>Toggle</button></h2>
					<div ngbAccordionCollapse><div ngbAccordionBody></div></div>
				</div>
				<div ngbAccordionItem>
					<h2 ngbAccordionHeader><button ngbAccordionButton>Toggle</button></h2>
					<div ngbAccordionCollapse><div ngbAccordionBody></div></div>
				</div>
			</div>
			`;
			const { accordionDirective, nativeElement, fixture } = createTestImperativeAccordion(html);
			const ids = getItemsIds(nativeElement);

			expectOpenPanels(nativeElement, [false, false]);

			accordionDirective.expand(ids[0]);
			expectOpenPanels(nativeElement, [true, false]);

			accordionDirective.expand(ids[1]);
			expectOpenPanels(nativeElement, [true, true]);

			accordionDirective.collapse(ids[1]);
			await fixture.whenStable();
			expectOpenPanels(nativeElement, [true, false]);
		});

		it('should not expand / collapse if already expanded / collapsed', () => {
			const testHtml = `
			<div ngbAccordion (hidden)="hiddenCallback($event)" (shown)="shownCallback($event)">
				<div ngbAccordionItem [collapsed]="false">
					<h2 ngbAccordionHeader><button ngbAccordionButton>Toggle</button></h2>
					<div ngbAccordionCollapse><div ngbAccordionBody></div></div>
				</div>
				<div ngbAccordionItem>
					<h2 ngbAccordionHeader><button ngbAccordionButton>Toggle</button></h2>
					<div ngbAccordionCollapse><div ngbAccordionBody></div></div>
				</div>
			</div>`;

			const { accordionDirective, nativeElement, fixture } = createTestImperativeAccordion(testHtml);
			const ids = getItemsIds(nativeElement);
			expectOpenPanels(nativeElement, [true, false]);

			vi.spyOn(fixture.componentInstance, 'hiddenCallback');
			vi.spyOn(fixture.componentInstance, 'shownCallback');

			accordionDirective.expand(ids[0]);
			expectOpenPanels(nativeElement, [true, false]);
			expect(fixture.componentInstance.shownCallback).not.toHaveBeenCalled();

			accordionDirective.collapse(ids[1]);
			expectOpenPanels(nativeElement, [true, false]);
			expect(fixture.componentInstance.hiddenCallback).not.toHaveBeenCalled();
		});

		it('should close panel open when close others is true and another one gets toggled', () => {
			const testHtml = `
			<div ngbAccordion [closeOthers]="true">
				<div ngbAccordionItem>
					<h2 ngbAccordionHeader><button ngbAccordionButton>Toggle</button></h2>
					<div ngbAccordionCollapse><div ngbAccordionBody></div></div>
				</div>
				<div ngbAccordionItem [collapsed]="false">
					<h2 ngbAccordionHeader><button ngbAccordionButton>Toggle</button></h2>
					<div ngbAccordionCollapse><div ngbAccordionBody></div></div>
				</div>
			</div>`;
			const { accordionDirective, nativeElement } = createTestImperativeAccordion(testHtml);
			const ids = getItemsIds(nativeElement);
			expectOpenPanels(nativeElement, [false, true]);
			accordionDirective.expand(ids[0]);
			expectOpenPanels(nativeElement, [true, false]);
		});

		it('should expand disabled panels', () => {
			const testHtml = `
			<div ngbAccordion (shown)="shownCallback($event)">
				<div ngbAccordionItem [disabled]="true">
					<h2 ngbAccordionHeader><button ngbAccordionButton>Toggle</button></h2>
					<div ngbAccordionCollapse><div ngbAccordionBody></div></div>
				</div>
			</div>`;
			const { accordionDirective, nativeElement, fixture } = createTestImperativeAccordion(testHtml);
			const ids = getItemsIds(nativeElement);

			expectOpenPanels(nativeElement, [false]);

			vi.spyOn(fixture.componentInstance, 'shownCallback');

			accordionDirective.expand(ids[0]);
			expectOpenPanels(nativeElement, [true]);
			expect(fixture.componentInstance.shownCallback).toHaveBeenCalled();
		});

		it('should expandAll when closeOthers is false', () => {
			const testHtml = `
			<div ngbAccordion [closeOthers]="false">
				<div ngbAccordionItem>
					<h2 ngbAccordionHeader><button ngbAccordionButton>Toggle</button></h2>
					<div ngbAccordionCollapse><div ngbAccordionBody></div></div>
				</div>
				<div ngbAccordionItem>
					<h2 ngbAccordionHeader><button ngbAccordionButton>Toggle</button></h2>
					<div ngbAccordionCollapse><div ngbAccordionBody></div></div>
				</div>
			</div>`;

			const { accordionDirective, nativeElement } = createTestImperativeAccordion(testHtml);

			expectOpenPanels(nativeElement, [false, false]);

			accordionDirective.expandAll();
			expectOpenPanels(nativeElement, [true, true]);
		});

		it('should expand only first panel when closeOthers is true and none of panels is expanded', () => {
			const testHtml = `
			<div ngbAccordion [closeOthers]="true">
				<div ngbAccordionItem>
					<h2 ngbAccordionHeader><button ngbAccordionButton>Toggle</button></h2>
					<div ngbAccordionCollapse><div ngbAccordionBody></div></div>
				</div>
				<div ngbAccordionItem>
					<h2 ngbAccordionHeader><button ngbAccordionButton>Toggle</button></h2>
					<div ngbAccordionCollapse><div ngbAccordionBody></div></div>
				</div>
			</div>`;

			const { accordionDirective, nativeElement } = createTestImperativeAccordion(testHtml);

			expectOpenPanels(nativeElement, [false, false]);

			accordionDirective.expandAll();
			expectOpenPanels(nativeElement, [true, false]);
		});

		it('should do nothing if closeOthers is true and one panel is expanded', () => {
			const testHtml = `
			<div ngbAccordion [closeOthers]="true">
				<div ngbAccordionItem>
					<h2 ngbAccordionHeader><button ngbAccordionButton>Toggle</button></h2>
					<div ngbAccordionCollapse><div ngbAccordionBody></div></div>
				</div>
				<div ngbAccordionItem [collapsed]="false">
					<h2 ngbAccordionHeader><button ngbAccordionButton>Toggle</button></h2>
					<div ngbAccordionCollapse><div ngbAccordionBody></div></div>
				</div>
			</div>`;

			const { accordionDirective, nativeElement } = createTestImperativeAccordion(testHtml);

			expectOpenPanels(nativeElement, [false, true]);

			accordionDirective.expandAll();
			expectOpenPanels(nativeElement, [false, true]);
		});

		it('should collapse all panels', async () => {
			const testHtml = `
			<div ngbAccordion>
				<div ngbAccordionItem>
					<h2 ngbAccordionHeader><button ngbAccordionButton>Toggle</button></h2>
					<div ngbAccordionCollapse> <div ngbAccordionBody></div></div>
				</div>
				<div ngbAccordionItem [collapsed]="false">
					<h2 ngbAccordionHeader><button ngbAccordionButton>Toggle</button></h2>
					<div ngbAccordionCollapse> <div ngbAccordionBody></div></div>
				</div>
			</div>`;

			const { accordionDirective, nativeElement, fixture } = createTestImperativeAccordion(testHtml);

			expectOpenPanels(nativeElement, [false, true]);

			accordionDirective.collapseAll();
			await fixture.whenStable();
			expectOpenPanels(nativeElement, [false, false]);
		});
	});
});

describe('on push change detection strategy', () => {
	@Component({
		selector: 'test-cmp',
		template: `
			<div ngbAccordion [closeOthers]="true">
				<div ngbAccordionItem [collapsed]="false">
					<h2 ngbAccordionHeader><button ngbAccordionButton>Toggle</button></h2>
					<div ngbAccordionCollapse><div ngbAccordionBody></div></div>
				</div>
				<div ngbAccordionItem>
					<h2 ngbAccordionHeader><button ngbAccordionButton>Toggle</button></h2>
					<div ngbAccordionCollapse><div ngbAccordionBody></div></div>
				</div>
				<div ngbAccordionItem>
					<h2 ngbAccordionHeader><button ngbAccordionButton>Toggle</button></h2>
					<div ngbAccordionCollapse><div ngbAccordionBody></div></div>
				</div>
			</div>
		`,
		imports: [
			NgbAccordionDirective,
			NgbAccordionItem,
			NgbAccordionHeader,
			NgbAccordionButton,
			NgbAccordionCollapse,
			NgbAccordionBody,
		],
		changeDetection: ChangeDetectionStrategy.OnPush,
	})
	class TestOnPushComponent {}
	it('Update the other panels accordingly', () => {
		const fixture = TestBed.createComponent(TestOnPushComponent);
		fixture.detectChanges();
		const buttons = fixture.nativeElement.querySelectorAll('.accordion-header > .accordion-button');
		expectOpenPanels(fixture.nativeElement, [true, false, false]);

		buttons[1].click();
		expectOpenPanels(fixture.nativeElement, [false, true, false]);

		buttons[2].click();
		expectOpenPanels(fixture.nativeElement, [false, false, true]);

		buttons[0].click();
		expectOpenPanels(fixture.nativeElement, [true, false, false]);
	});
});

it(`should allow querying from the body template`, () => {
	@Component({
		selector: 'query-test-cmp',
		imports: [
			NgbAccordionDirective,
			NgbAccordionItem,
			NgbAccordionHeader,
			NgbAccordionButton,
			NgbAccordionCollapse,
			NgbAccordionBody,
		],
		template: `
			<div ngbAccordion>
				<div ngbAccordionItem [collapsed]="false">
					<h2 ngbAccordionHeader>
						<button ngbAccordionButton>Foo</button>
					</h2>
					<div ngbAccordionCollapse>
						<div ngbAccordionBody>
							<ng-template>
								<div #bar>Bar</div>
							</ng-template>
						</div>
					</div>
				</div>
			</div>
		`,
		changeDetection: ChangeDetectionStrategy.OnPush,
	})
	class QueryTestComponent {
		@ViewChild('bar')
		bar: ElementRef;
	}

	let cmp = TestBed.createComponent(QueryTestComponent);
	cmp.detectChanges();
	expect(cmp.componentInstance.bar).toBeDefined();
	expect(cmp.componentInstance.bar.nativeElement.textContent).toBe('Bar');
});

describe('Custom config', () => {
	let config: NgbAccordionConfig;

	beforeEach(() => {
		config = TestBed.inject(NgbAccordionConfig);
		config.closeOthers = true;
	});

	it('should initialize inputs with provided config', () => {
		const fixture = TestBed.createComponent(TestComponent);
		fixture.detectChanges();

		const directiveEl = fixture.debugElement.query(By.directive(NgbAccordionDirective));
		const directive = directiveEl.injector.get(NgbAccordionDirective);

		expect(directive.closeOthers).toBe(config.closeOthers);
	});
});

it('should initialize inputs with provided config', () => {
	let config = TestBed.inject(NgbAccordionConfig);
	config.closeOthers = true;
	config.destroyOnHide = false;

	const fixture = TestBed.createComponent(TestComponent);
	fixture.detectChanges();

	const directive = fixture.debugElement.query(By.directive(NgbAccordionDirective)).injector.get(NgbAccordionDirective);
	expect(directive.closeOthers).toBe(config.closeOthers);
	expect(directive.destroyOnHide).toBe(config.destroyOnHide);
});

if (isBrowserVisible('ngb-accordion-directive animations')) {
	describe('ngb-accordion-directive animations', () => {
		@Component({
			imports: [
				NgbAccordionDirective,
				NgbAccordionItem,
				NgbAccordionHeader,
				NgbAccordionButton,
				NgbAccordionCollapse,
				NgbAccordionBody,
				NgbAccordionToggle,
			],
			template: `
				<div ngbAccordion (shown)="onShown($event)" (hidden)="onHidden($event)">
					<div ngbAccordionItem [collapsed]="false" (shown)="onCollapseShown()" (hidden)="onCollapseHidden()">
						<h2 ngbAccordionHeader><button ngbAccordionButton>Toggle</button></h2>
						<div ngbAccordionCollapse><div ngbAccordionBody></div></div>
					</div>
					<div ngbAccordionItem>
						<h2 ngbAccordionHeader><button ngbAccordionButton>Toggle</button></h2>
						<div ngbAccordionCollapse><div ngbAccordionBody></div></div>
					</div>
				</div>
			`,
			host: { '[class.ngb-reduce-motion]': 'reduceMotion' },
			changeDetection: ChangeDetectionStrategy.OnPush,
		})
		class TestAnimationComponent {
			reduceMotion = true;
			onShown = (panelId) => panelId;
			onHidden = (panelId) => panelId;
			onCollapseShown = () => {};
			onCollapseHidden = () => {};
		}
		beforeEach(() => {
			TestBed.configureTestingModule({
				providers: [{ provide: NgbConfig, useClass: NgbConfigAnimation }],
			});
		});

		it(`should run collapsing transition (force-reduced-motion = false)`, async () => {
			const fixture = TestBed.createComponent(TestAnimationComponent);
			fixture.componentInstance.reduceMotion = false;
			fixture.detectChanges();

			const el = fixture.nativeElement;
			const id = getItemsIds(el)[0];

			const buttonEl = getPanelsButtons(el)[0];
			const collapseEl = getCollapses(el)[0];
			const onShownSpy = vi.spyOn(fixture.componentInstance, 'onShown');
			const onHiddenSpy = vi.spyOn(fixture.componentInstance, 'onHidden');
			const onCollapseShownSpy = vi.spyOn(fixture.componentInstance, 'onCollapseShown');
			const onCollapseHiddenSpy = vi.spyOn(fixture.componentInstance, 'onCollapseHidden');

			const collapsePromise = new Promise<void>((resolve) =>
				onHiddenSpy.mockImplementation((collapseId) => {
					expect(onCollapseHiddenSpy).toHaveBeenCalled();
					expect(collapseId).toBe(id);

					expect(collapseEl.classList.contains('collapse')).toBe(true);
					expect(collapseEl.classList.contains('collapsing')).toBe(false);
					expect(collapseEl.classList.contains('show')).toBe(false);

					resolve();
				}),
			);

			// Collapsing
			buttonEl.click();

			expect(collapseEl.classList.contains('collapse')).toBe(false);
			expect(collapseEl.classList.contains('show')).toBe(false);
			expect(collapseEl.classList.contains('collapsing')).toBe(true);

			await collapsePromise;

			const expandPromise = new Promise<void>((resolve) =>
				onShownSpy.mockImplementation((collapseId) => {
					expect(onCollapseShownSpy).toHaveBeenCalled();
					expect(collapseId).toBe(id);

					expect(collapseEl.classList.contains('collapse')).toBe(true);
					expect(collapseEl.classList.contains('collapsing')).toBe(false);
					expect(collapseEl.classList.contains('show')).toBe(true);
					resolve();
				}),
			);

			// Expanding
			buttonEl.click();

			expect(collapseEl.classList.contains('collapse')).toBe(false);
			expect(collapseEl.classList.contains('show')).toBe(false);
			expect(collapseEl.classList.contains('collapsing')).toBe(true);

			await expandPromise;
		});

		it(`should run collapsing transition (force-reduced-motion = true)`, () => {
			const fixture = TestBed.createComponent(TestAnimationComponent);
			fixture.componentInstance.reduceMotion = true;
			fixture.detectChanges();

			const el = fixture.nativeElement;
			const id = getItemsIds(el)[0];

			const buttonEl = getPanelsButtons(el)[0];
			const collapseEl = getCollapses(el)[0];
			const onShownSpy = vi.spyOn(fixture.componentInstance, 'onShown');
			const onHiddenSpy = vi.spyOn(fixture.componentInstance, 'onHidden');
			const onCollapseShownSpy = vi.spyOn(fixture.componentInstance, 'onCollapseShown');
			const onCollapseHiddenSpy = vi.spyOn(fixture.componentInstance, 'onCollapseHidden');

			expect(collapseEl.classList.contains('collapse')).toBe(true);
			expect(collapseEl.classList.contains('show')).toBe(true);
			expect(collapseEl.classList.contains('collapsing')).toBe(false);

			// Collapsing
			buttonEl.click();

			expect(onHiddenSpy).toHaveBeenCalledWith(id);
			expect(onCollapseHiddenSpy).toHaveBeenCalled();
			expect(collapseEl.classList.contains('collapse')).toBe(true);
			expect(collapseEl.classList.contains('show')).toBe(false);
			expect(collapseEl.classList.contains('collapsing')).toBe(false);

			// Expanding
			buttonEl.click();

			expect(onShownSpy).toHaveBeenCalledWith(id);
			expect(onCollapseShownSpy).toHaveBeenCalled();

			expect(collapseEl.classList.contains('collapse')).toBe(true);
			expect(collapseEl.classList.contains('show')).toBe(true);
			expect(collapseEl.classList.contains('collapsing')).toBe(false);
		});

		it(`should run revert collapsing transition (force-reduced-motion = false)`, async () => {
			const fixture = TestBed.createComponent(TestAnimationComponent);
			fixture.componentInstance.reduceMotion = false;
			fixture.detectChanges();

			const el = fixture.nativeElement;
			const id = getItemsIds(el)[0];

			const buttonEl = getPanelsButtons(el)[0];
			const collapseEl = getCollapses(el)[0];

			const onHiddenSpy = vi.spyOn(fixture.componentInstance, 'onHidden');
			const onShownSpy = vi.spyOn(fixture.componentInstance, 'onShown');
			const onCollapseShownSpy = vi.spyOn(fixture.componentInstance, 'onCollapseShown');
			const onCollapseHiddenSpy = vi.spyOn(fixture.componentInstance, 'onCollapseHidden');

			expect(collapseEl.classList.contains('collapse')).toBe(true);
			expect(collapseEl.classList.contains('show')).toBe(true);
			expect(collapseEl.classList.contains('collapsing')).toBe(false);

			// Collapsing
			buttonEl.click();

			expect(collapseEl.classList.contains('collapse')).toBe(false);
			expect(collapseEl.classList.contains('show')).toBe(false);
			expect(collapseEl.classList.contains('collapsing')).toBe(true);

			const expandPromise = new Promise<void>((resolve) =>
				onShownSpy.mockImplementation((panelId) => {
					expect(onHiddenSpy).not.toHaveBeenCalled();
					expect(onCollapseHiddenSpy).not.toHaveBeenCalled();
					expect(onCollapseShownSpy).toHaveBeenCalled();
					expect(panelId).toBe(id);

					expect(collapseEl.classList.contains('collapse')).toBe(true);
					expect(collapseEl.classList.contains('show')).toBe(true);
					expect(collapseEl.classList.contains('collapsing')).toBe(false);
					resolve();
				}),
			);

			// Expanding
			buttonEl.click();

			expect(collapseEl.classList.contains('collapse')).toBe(false);
			expect(collapseEl.classList.contains('show')).toBe(false);
			expect(collapseEl.classList.contains('collapsing')).toBe(true);

			await expandPromise;
		});
	});
}

@Component({
	selector: 'test-cmp',
	template: '<div ngbAccordion></div>',
	imports: [
		NgbAccordionDirective,
		NgbAccordionItem,
		NgbAccordionHeader,
		NgbAccordionButton,
		NgbAccordionCollapse,
		NgbAccordionBody,
		NgbAccordionToggle,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestComponent {
	destroyOnHide = input(true);
	closeOthers = input(false);
	items = [
		{
			disabled: signal(false),
			header: 'Panel 1',
			body: 'foo',
			collapsed: signal(true),
			destroyOnHide: signal(false),
		},
		{
			disabled: signal(false),
			header: 'Panel 2',
			body: 'bar',
			collapsed: signal(true),
			destroyOnHide: signal(false),
		},
		{
			disabled: signal(false),
			header: 'Panel 3',
			body: 'baz',
			collapsed: signal(true),
			destroyOnHide: signal(false),
		},
	];
	showCallback = (_: string) => {};
	shownCallback = (_: string) => {};
	hideCallback = (_: string) => {};
	hiddenCallback = (_: string) => {};
	itemShowCallback = (_?) => {};
	itemShownCallback = (_?) => {};
	itemHideCallback = (_?) => {};
	itemHiddenCallback = (_?) => {};
}
