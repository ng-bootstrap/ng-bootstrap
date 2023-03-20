import { TestBed, ComponentFixture, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { createGenericTestComponent, isBrowserVisible } from '../test/common';

import { Component } from '@angular/core';

import { NgbAccordionModule, NgbAccordionConfig, NgbAccordionDirective } from './accordion.module';
import { NgbConfig } from '../ngb-config';
import { NgbConfigAnimation } from '../test/ngb-config-animation';
import { NgFor } from '@angular/common';

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
	expect(collapseElements.length).toBe(openPanelsDef.length);

	const panelsButton = getPanelsButtons(nativeEl);
	const result = panelsButton.map((titleEl) => {
		const isAriaExpanded = titleEl.getAttribute('aria-expanded') === 'true';
		const isCSSCollapsed = titleEl.classList.contains('collapsed');
		return isAriaExpanded === !isCSSCollapsed ? isAriaExpanded : fail('inconsistent state');
	});
	const noOfOpenPanels = collapseElements
		.map((collapse) => {
			return collapse.classList.contains('show');
		})
		.reduce((soFar, def) => (def ? soFar + 1 : soFar), 0);

	expect(noOfOpenPanels).toBe(noOfOpenPanelsExpected);
	expect(result).toEqual(openPanelsDef);
}

describe('ngb-accordion directive', () => {
	let html = `
		<div ngbAccordion #acc="ngbAccordion"
			[closeOthers]="closeOthers" [destroyOnHide]="destroyOnHide" (shown)="shownCallback($event)" (hidden)="hiddenCallback($event)">
			<div ngbAccordionItem *ngFor="let item of items"
				[disabled]="item.disabled"
				[collapsed]="item.collapsed"
				[destroyOnHide]="item.destroyOnHide"
				(shown) = "itemShownCallback($event)"
				(hidden) = "itemHiddenCallback($event)"
				>
				<h2 ngbAccordionHeader>
					<button ngbAccordionButton>{{item.header}}</button>
				</h2>
				<div ngbAccordionCollapse>
					<div ngbAccordionBody><ng-template>{{item.body}}</ng-template></div>
				</div>
			</div>
		</div>
		<button *ngFor="let panel of panels" (click)="acc.toggle(panel.id)">Toggle the panel {{ panel.id }}</button>
	`;
	beforeEach(() => {
		TestBed.overrideComponent(TestComponent, { set: { template: html } });
	});

	it('should initialize inputs with default values', () => {
		const defaultConfig = new NgbAccordionConfig(new NgbConfig());
		const accordion = new NgbAccordionDirective(defaultConfig);
		expect(accordion.closeOthers).toBe(defaultConfig.closeOthers);
		expect(accordion.animation).toBe(defaultConfig.animation);
	});

	it('should have no open panels', () => {
		const fixture = TestBed.createComponent(TestComponent);
		const el = fixture.nativeElement;
		fixture.detectChanges();
		expectOpenPanels(el, [false, false, false]);
	});

	it('should have proper css classes', () => {
		const fixture = TestBed.createComponent(TestComponent);
		const accordion = fixture.debugElement.query(By.directive(NgbAccordionDirective));
		fixture.detectChanges();
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

	it('should toggle panels independently', () => {
		const fixture = TestBed.createComponent(TestComponent);
		fixture.detectChanges();

		const el = fixture.nativeElement;

		getButton(el, 1).click();
		fixture.detectChanges();
		expectOpenPanels(el, [false, true, false]);

		getButton(el, 0).click();
		fixture.detectChanges();
		expectOpenPanels(el, [true, true, false]);

		getButton(el, 1).click();
		fixture.detectChanges();
		expectOpenPanels(el, [true, false, false]);

		getButton(el, 2).click();
		fixture.detectChanges();

		expectOpenPanels(el, [true, false, true]);

		getButton(el, 0).click();
		fixture.detectChanges();
		expectOpenPanels(el, [false, false, true]);

		getButton(el, 2).click();
		fixture.detectChanges();
		expectOpenPanels(el, [false, false, false]);
	});

	it('should allow only one panel to be active with "closeOthers" flag', () => {
		const fixture = TestBed.createComponent(TestComponent);
		fixture.detectChanges();

		fixture.componentInstance.closeOthers = true;
		const el = fixture.nativeElement;

		fixture.detectChanges();

		getButton(el, 0).click();
		fixture.detectChanges();
		expectOpenPanels(el, [true, false, false]);

		getButton(el, 1).click();
		fixture.detectChanges();
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
		expect(getCollapses(fixture.nativeElement).length).toBe(0);
	});

	it('should not crash for panels without content', () => {
		const fixture = createTestComponent(
			`<div ngbAccordion>
				<div ngbAccordionItem>
					<h2 ngbAccordionHeader><button ngbAccordionButton>Toggle</button></h2>
					<div ngbAccordionCollapse><div ngbAccordionBody></div></div>
				</div>
			</div>`,
		);
		const panelsContent = getCollapseContent(fixture.nativeElement);

		expect(panelsContent.length).toBe(1);
		expect(panelsContent[0].textContent!.trim()).toBe('');
	});

	it('should have the appropriate content', () => {
		const fixture = TestBed.createComponent(TestComponent);
		const originalItems = fixture.componentInstance.items;
		originalItems.forEach((item) => (item.destroyOnHide = false));
		fixture.detectChanges();

		getCollapses(fixture.nativeElement).forEach((collapse, idx) => {
			expect(getCollapseBodyContent(collapse)).toBe(originalItems[idx].body);
		});
	});

	it('should remove body content from DOM', () => {
		const fixture = TestBed.createComponent(TestComponent);
		fixture.componentInstance.items.forEach((item) => (item.destroyOnHide = true));
		fixture.detectChanges();

		getCollapses(fixture.nativeElement).forEach((collapse) => {
			expect(getCollapseBodyContent(collapse)).toBe('');
		});
	});

	it(`should allow customizing headers with 'NgbAccordionToggle'`, () => {
		const fixture = createTestComponent(
			`<div ngbAccordion>
				<div [ngbAccordionItem]="'custom-' + index" *ngFor="let item of items; let index = index;">
					<div ngbAccordionHeader class='accordion-button'>
						<button type='button' ngbAccordionToggle>{{item.header}}</button>
					</div>
					<div ngbAccordionCollapse>
						<div ngbAccordionBody><ng-template>{{item.body}}</ng-template></div>
					</div>
				</div>
			</div>`,
		);

		fixture.detectChanges();

		const el = fixture.nativeElement;
		expectOpenPanels(el, [false, false, false]);

		// open second
		getButton(el, 1).click();
		fixture.detectChanges();
		expectOpenPanels(el, [false, true, false]);

		// close second
		getButton(el, 1).click();
		fixture.detectChanges();
		expectOpenPanels(el, [false, false, false]);
	});

	it(`should no allow clicking on disabled headers with 'NgbAcdordionToggle'`, () => {
		const fixture = createTestComponent(
			`<div ngbAccordion>
				<div ngbAccordionItem [disabled]="true">
					<div ngbAccordionHeader class="accordion-button">
						<button type='button' ngbAccordionToggle>Toggle</button>
					</div>
					<div ngbAccordionCollapse>
						<div ngbAccordionBody><ng-template>Body</ng-template></div>
					</div>
				</div>
			</div>`,
		);

		fixture.detectChanges();

		const el = fixture.nativeElement;
		expectOpenPanels(el, [false]);

		// user click should not open the panel
		getButton(el, 0).click();
		fixture.detectChanges();
		expectOpenPanels(el, [false]);
	});

	it('should remove body content from DOM only for the first collapse', () => {
		const fixture = TestBed.createComponent(TestComponent);
		const originalItems = fixture.componentInstance.items;
		originalItems[0].destroyOnHide = true;
		getCollapses(fixture.nativeElement).forEach((collapse, idx) => {
			if (idx === 0) {
				expect(getCollapseBodyContent(collapse)).toBe('');
			} else {
				expect(getCollapseBodyContent(collapse)).toBe(originalItems[idx].body);
			}
		});
	});

	it('should have a custom panel id', () => {
		const fixture = createTestComponent(
			`<div ngbAccordion>
				<div [ngbAccordionItem]="'custom-' + index" *ngFor="let item of items; let index = index;">
					<h2 ngbAccordionHeader>
						<button ngbAccordionButton>{{item.header}}</button>
					</h2>
					<div ngbAccordionCollapse>
						<div ngbAccordionBody><ng-template>{{item.body}}</ng-template></div>
					</div>
			</div>
			</div>`,
		);
		expect(getItemsIds(fixture.nativeElement)).toEqual(['custom-0', 'custom-1', 'custom-2']);
	});

	it('should remove body content from DOM if destroyOnHide is not set on accordion and on accordion-collapse', () => {
		const fixture = createTestComponent(
			`<div ngbAccordion>
				<div ngbAccordionItem *ngFor="let item of items">
					<h2 ngbAccordionHeader>
						<button ngbAccordionButton>{{item.header}}</button>
					</h2>
					<div ngbAccordionCollapse>
						<div ngbAccordionBody><ng-template>{{item.body}}</ng-template></div>
					</div>
			</div>
			</div>`,
		);

		getCollapses(fixture.nativeElement).forEach((collapse) => {
			expect(getCollapseBodyContent(collapse)).toBe('');
		});
	});

	it('should not toggle disabled items', () => {
		const fixture = TestBed.createComponent(TestComponent);
		fixture.componentInstance.items[0].disabled = true;
		const el = fixture.nativeElement;

		fixture.detectChanges();
		expectOpenPanels(el, [false, false, false]);

		getButton(el, 0).click();
		fixture.detectChanges();
		expectOpenPanels(el, [false, false, false]);
	});

	it('should not change collapse when panels are disabled', () => {
		const fixture = TestBed.createComponent(TestComponent);
		const oItems = fixture.componentInstance.items;
		const el = fixture.nativeElement;
		oItems[0].collapsed = false;
		fixture.detectChanges();
		expectOpenPanels(el, [true, false, false]);

		oItems[0].disabled = true;
		fixture.detectChanges();
		expectOpenPanels(el, [true, false, false]);

		oItems[0].disabled = false;
		fixture.detectChanges();
		expectOpenPanels(el, [true, false, false]);

		getButton(el, 0).click();
		fixture.detectChanges();
		expectOpenPanels(el, [false, false, false]);
	});

	it('should have correct disabled state', () => {
		const fixture = TestBed.createComponent(TestComponent);
		const oItems = fixture.componentInstance.items;
		const el = fixture.nativeElement;

		oItems[0].collapsed = false;
		fixture.detectChanges();
		const toggleButtons = getPanelsButtons(el);
		expectOpenPanels(el, [true, false, false]);
		expect(toggleButtons[0].disabled).toBeFalsy();

		oItems[0].disabled = true;
		fixture.detectChanges();
		expectOpenPanels(el, [true, false, false]);
		expect(toggleButtons[0].disabled).toBeTruthy();
	});

	it('should emit panel events when toggling panels', () => {
		const fixture = TestBed.createComponent(TestComponent);
		const el = fixture.nativeElement;
		const ci = fixture.componentInstance;
		fixture.detectChanges();

		spyOn(ci, 'shownCallback');
		spyOn(ci, 'hiddenCallback');
		spyOn(ci, 'itemShownCallback');
		spyOn(ci, 'itemHiddenCallback');

		getButton(el, 0).click();
		fixture.detectChanges();
		const itemId = getItem(el, 0).id;

		expect(fixture.componentInstance.shownCallback).toHaveBeenCalledWith(itemId);
		expect(fixture.componentInstance.itemShownCallback).toHaveBeenCalledWith(undefined);

		getButton(el, 0).click();
		fixture.detectChanges();
		expect(fixture.componentInstance.hiddenCallback).toHaveBeenCalledWith(itemId);
		expect(fixture.componentInstance.itemHiddenCallback).toHaveBeenCalledWith(undefined);
	});

	it('should have the proper roles', () => {
		const fixture = TestBed.createComponent(TestComponent);
		const items = fixture.componentInstance.items;
		const el = fixture.nativeElement;
		items.forEach((item) => {
			item.collapsed = false;
		});
		fixture.detectChanges();

		getHeaders(el).forEach((header) => expect(header.getAttribute('role')).toBe('heading'));

		getCollapses(el).forEach((collapse) => expect(collapse.getAttribute('role')).toBe('region'));
	});

	describe('imperative API', () => {
		function createTestImperativeAccordion(testHtml: string) {
			const fixture = createTestComponent(testHtml);
			const directiveEl = fixture.debugElement.query(By.directive(NgbAccordionDirective));
			const accordionDirective = directiveEl.injector.get(NgbAccordionDirective);
			const nativeElement = fixture.nativeElement;
			return { fixture, accordionDirective, nativeElement };
		}

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

		it('should expanded and collapse individual panels', () => {
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
			fixture.detectChanges();
			expectOpenPanels(nativeElement, [true, false]);

			accordionDirective.expand(ids[1]);
			fixture.detectChanges();
			expectOpenPanels(nativeElement, [true, true]);

			accordionDirective.collapse(ids[1]);
			fixture.detectChanges();
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

			spyOn(fixture.componentInstance, 'hiddenCallback');
			spyOn(fixture.componentInstance, 'shownCallback');

			accordionDirective.expand(ids[0]);
			fixture.detectChanges();
			expectOpenPanels(nativeElement, [true, false]);
			expect(fixture.componentInstance.shownCallback).not.toHaveBeenCalled();

			accordionDirective.collapse(ids[1]);
			fixture.detectChanges();
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
			const { accordionDirective, nativeElement, fixture } = createTestImperativeAccordion(testHtml);
			const ids = getItemsIds(nativeElement);
			expectOpenPanels(nativeElement, [false, true]);
			accordionDirective.expand(ids[0]);
			fixture.detectChanges();
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

			spyOn(fixture.componentInstance, 'shownCallback');

			accordionDirective.expand(ids[0]);
			fixture.detectChanges();
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

			const { accordionDirective, nativeElement, fixture } = createTestImperativeAccordion(testHtml);

			expectOpenPanels(nativeElement, [false, false]);

			accordionDirective.expandAll();
			fixture.detectChanges();
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

			const { accordionDirective, nativeElement, fixture } = createTestImperativeAccordion(testHtml);

			expectOpenPanels(nativeElement, [false, false]);

			accordionDirective.expandAll();
			fixture.detectChanges();
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

			const { accordionDirective, nativeElement, fixture } = createTestImperativeAccordion(testHtml);

			expectOpenPanels(nativeElement, [false, true]);

			accordionDirective.expandAll();
			fixture.detectChanges();
			expectOpenPanels(nativeElement, [false, true]);
		});

		it('should collapse all panels', () => {
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
			fixture.detectChanges();
			expectOpenPanels(nativeElement, [false, false]);
		});
	});
});

describe('Custom config', () => {
	let config: NgbAccordionConfig;

	beforeEach(inject([NgbAccordionConfig], (c: NgbAccordionConfig) => {
		config = c;
		config.closeOthers = true;
	}));

	it('should initialize inputs with provided config', () => {
		const fixture = TestBed.createComponent(TestComponent);
		fixture.detectChanges();

		const directiveEl = fixture.debugElement.query(By.directive(NgbAccordionDirective));
		const directive = directiveEl.injector.get(NgbAccordionDirective);

		expect(directive.closeOthers).toBe(config.closeOthers);
	});
});
describe('Custom config as provider', () => {
	let config = new NgbAccordionConfig(new NgbConfig());
	beforeEach(() => {
		config = new NgbAccordionConfig(new NgbConfig());
		config.closeOthers = true;
		TestBed.overrideProvider(NgbAccordionConfig, { useValue: config });
	});

	it('should initialize inputs with provided config as provider', () => {
		const fixture = TestBed.createComponent(TestComponent);
		fixture.detectChanges();

		const directiveEl = fixture.debugElement.query(By.directive(NgbAccordionDirective));
		const directive = directiveEl.injector.get(NgbAccordionDirective);

		expect(directive.closeOthers).toBe(config.closeOthers);
	});
});

if (isBrowserVisible('ngb-accordion-directive animations')) {
	describe('ngb-accordion-directive animations', () => {
		@Component({
			standalone: true,
			imports: [NgbAccordionModule],
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

		it(`should run collapsing transition (force-reduced-motion = false)`, (done) => {
			const fixture = TestBed.createComponent(TestAnimationComponent);
			fixture.componentInstance.reduceMotion = false;
			fixture.detectChanges();
			const el = fixture.nativeElement;
			const id = getItemsIds(el)[0];

			const buttonEl = getPanelsButtons(el)[0];
			const collapseEl = getCollapses(el)[0];
			const onShownSpy = spyOn(fixture.componentInstance, 'onShown');
			const onHiddenSpy = spyOn(fixture.componentInstance, 'onHidden');
			const onCollapseShownSpy = spyOn(fixture.componentInstance, 'onCollapseShown');
			const onCollapseHiddenSpy = spyOn(fixture.componentInstance, 'onCollapseHidden');

			onHiddenSpy.and.callFake((collapseId) => {
				expect(onCollapseHiddenSpy).toHaveBeenCalled();
				expect(collapseId).toBe(id);

				expect(collapseEl).toHaveClass('collapse');
				expect(collapseEl).not.toHaveClass('collapsing');
				expect(collapseEl).not.toHaveClass('show');

				// Expanding
				buttonEl.click();
				fixture.detectChanges();
			});

			onShownSpy.and.callFake((collapseId) => {
				expect(onCollapseShownSpy).toHaveBeenCalled();
				expect(collapseId).toBe(id);

				expect(collapseEl).toHaveClass('collapse');
				expect(collapseEl).not.toHaveClass('collapsing');
				expect(collapseEl).toHaveClass('show');
				done();
			});

			expect(collapseEl).toHaveClass('collapse');
			expect(collapseEl).toHaveClass('show');
			expect(collapseEl).not.toHaveClass('collapsing');

			// Collapsing
			buttonEl.click();
			fixture.detectChanges();

			expect(collapseEl).not.toHaveClass('collapse');
			expect(collapseEl).not.toHaveClass('show');
			expect(collapseEl).toHaveClass('collapsing');
		});

		it(`should run collapsing transition (force-reduced-motion = true)`, () => {
			const fixture = TestBed.createComponent(TestAnimationComponent);
			fixture.componentInstance.reduceMotion = true;
			fixture.detectChanges();
			const el = fixture.nativeElement;
			const id = getItemsIds(el)[0];

			const buttonEl = getPanelsButtons(el)[0];
			const collapseEl = getCollapses(el)[0];
			const onShownSpy = spyOn(fixture.componentInstance, 'onShown');
			const onHiddenSpy = spyOn(fixture.componentInstance, 'onHidden');
			const onCollapseShownSpy = spyOn(fixture.componentInstance, 'onCollapseShown');
			const onCollapseHiddenSpy = spyOn(fixture.componentInstance, 'onCollapseHidden');

			expect(collapseEl).toHaveClass('collapse');
			expect(collapseEl).toHaveClass('show');
			expect(collapseEl).not.toHaveClass('collapsing');

			// Collapsing
			buttonEl.click();
			fixture.detectChanges();

			expect(onHiddenSpy).toHaveBeenCalledWith(id);
			expect(onCollapseHiddenSpy).toHaveBeenCalled();
			expect(collapseEl).toHaveClass('collapse');
			expect(collapseEl).not.toHaveClass('show');
			expect(collapseEl).not.toHaveClass('collapsing');

			// Expanding
			buttonEl.click();
			fixture.detectChanges();

			expect(onShownSpy).toHaveBeenCalledWith(id);
			expect(onCollapseShownSpy).toHaveBeenCalled();

			expect(collapseEl).toHaveClass('collapse');
			expect(collapseEl).toHaveClass('show');
			expect(collapseEl).not.toHaveClass('collapsing');
		});

		it(`should run revert collapsing transition (force-reduced-motion = false)`, (done) => {
			const fixture = TestBed.createComponent(TestAnimationComponent);
			fixture.componentInstance.reduceMotion = false;
			fixture.detectChanges();

			const el = fixture.nativeElement;
			const id = getItemsIds(el)[0];

			const buttonEl = getPanelsButtons(el)[0];
			const collapseEl = getCollapses(el)[0];

			const onHiddenSpy = spyOn(fixture.componentInstance, 'onHidden');
			const onShownSpy = spyOn(fixture.componentInstance, 'onShown');
			const onCollapseShownSpy = spyOn(fixture.componentInstance, 'onCollapseShown');
			const onCollapseHiddenSpy = spyOn(fixture.componentInstance, 'onCollapseHidden');

			onShownSpy.and.callFake((panelId) => {
				expect(onHiddenSpy).not.toHaveBeenCalled();
				expect(onCollapseHiddenSpy).not.toHaveBeenCalled();
				expect(onCollapseShownSpy).toHaveBeenCalled();
				expect(panelId).toBe(id);

				expect(collapseEl).toHaveClass('collapse');
				expect(collapseEl).toHaveClass('show');
				expect(collapseEl).not.toHaveClass('collapsing');
				done();
			});

			expect(collapseEl).toHaveClass('collapse');
			expect(collapseEl).toHaveClass('show');
			expect(collapseEl).not.toHaveClass('collapsing');

			// Collapsing
			buttonEl.click();
			fixture.detectChanges();

			expect(collapseEl).not.toHaveClass('collapse');
			expect(collapseEl).not.toHaveClass('show');
			expect(collapseEl).toHaveClass('collapsing');

			// Expanding
			buttonEl.click();
			fixture.detectChanges();

			expect(collapseEl).not.toHaveClass('collapse');
			expect(collapseEl).not.toHaveClass('show');
			expect(collapseEl).toHaveClass('collapsing');
		});
	});
}

@Component({
	selector: 'test-cmp',
	template: '<div ngbAccordion></div>',
	standalone: true,
	imports: [NgbAccordionModule, NgFor],
})
class TestComponent {
	destroyOnHide = true;
	closeOthers = false;
	items = [
		{
			disabled: false,
			header: 'Panel 1',
			body: 'foo',
			collapsed: true,
			destroyOnHide: false,
		},
		{
			disabled: false,
			header: 'Panel 2',
			body: 'bar',
			collapsed: true,
			destroyOnHide: false,
		},
		{
			disabled: false,
			header: 'Panel 3',
			body: 'baz',
			collapsed: true,
			destroyOnHide: false,
		},
	];
	shownCallback = (panelId: string) => {};
	hiddenCallback = (panelId: string) => {};
	itemShownCallback = (panelId?: string) => {};
	itemHiddenCallback = (panelId?: string) => {};
}
