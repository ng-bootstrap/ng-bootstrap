import { ComponentFixture, TestBed } from '@angular/core/testing';
import { createGenericTestComponent, isBrowserVisible } from '../test/common';

import { Component } from '@angular/core';

import { NgbCollapse } from './collapse';
import { NgbConfig } from '@ng-bootstrap/ng-bootstrap/config';
import { NgbConfigAnimation } from '../test/ngb-config-animation';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const createTestComponent = (html: string) =>
	createGenericTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;

function getCollapsibleContent(element: HTMLElement): HTMLDivElement {
	return <HTMLDivElement>element.querySelector('.collapse');
}

describe('ngb-collapse', () => {
	it('should have content open', () => {
		const fixture = createTestComponent(`<div [ngbCollapse]="collapsed">Some content</div>`);

		const collapseEl = getCollapsibleContent(fixture.nativeElement);

		expect(collapseEl).toHaveCssClass('show');
	});

	it(`should set css classes for horizontal collapse`, () => {
		const fixture = createTestComponent(`<div [ngbCollapse]="collapsed">Some content</div>`);
		const element = fixture.debugElement.query(By.directive(NgbCollapse));
		const directive = element.injector.get(NgbCollapse);

		expect(element.nativeElement).toHaveCssClass('collapse');
		expect(element.nativeElement).not.toHaveCssClass('collapse-horizontal');

		directive.horizontal = true;
		fixture.detectChanges();

		expect(element.nativeElement).toHaveCssClass('collapse');
		expect(element.nativeElement).toHaveCssClass('collapse-horizontal');
	});

	it('should have content closed', () => {
		const fixture = createTestComponent(`<div [ngbCollapse]="collapsed">Some content</div>`);
		const tc = fixture.componentInstance;
		tc.collapsed = true;
		fixture.detectChanges();

		const collapseEl = getCollapsibleContent(fixture.nativeElement);

		expect(collapseEl).not.toHaveCssClass('show');
	});

	it('should toggle collapsed content based on bound model change', () => {
		const fixture = createTestComponent(`<div [ngbCollapse]="collapsed">Some content</div>`);
		fixture.detectChanges();

		const tc = fixture.componentInstance;
		const collapseEl = getCollapsibleContent(fixture.nativeElement);
		expect(collapseEl).toHaveCssClass('show');

		tc.collapsed = true;
		fixture.detectChanges();
		expect(collapseEl).not.toHaveCssClass('show');

		tc.collapsed = false;
		fixture.detectChanges();
		expect(collapseEl).toHaveCssClass('show');
	});

	it('should allow toggling collapse from outside', () => {
		const fixture = createTestComponent(`
      <button (click)="collapse.toggle()">Collapse</button>
      <div [ngbCollapse]="collapsed" #collapse="ngbCollapse"></div>`);

		const compiled = fixture.nativeElement;
		const collapseEl = getCollapsibleContent(compiled);
		const buttonEl = compiled.querySelector('button');

		buttonEl.click();
		fixture.detectChanges();
		expect(collapseEl).not.toHaveCssClass('show');

		buttonEl.click();
		fixture.detectChanges();
		expect(collapseEl).toHaveCssClass('show');
	});

	it('should work with no binding', () => {
		const fixture = createTestComponent(`
      <button (click)="collapse.toggle()">Collapse</button>
      <div ngbCollapse #collapse="ngbCollapse"></div>`);

		const compiled = fixture.nativeElement;
		const collapseEl = getCollapsibleContent(compiled);
		const buttonEl = compiled.querySelector('button');

		buttonEl.click();
		fixture.detectChanges();
		expect(collapseEl).not.toHaveCssClass('show');

		buttonEl.click();
		fixture.detectChanges();
		expect(collapseEl).toHaveCssClass('show');
	});
});

if (isBrowserVisible('ngb-collapse animations')) {
	describe('ngb-collapse animations', () => {
		@Component({
			imports: [NgbCollapse],
			template: `
				<button (click)="c.toggle()">Collapse!</button>
				<div
					[(ngbCollapse)]="collapsed"
					#c="ngbCollapse"
					(ngbCollapseChange)="onCollapse()"
					(shown)="onShown()"
					(hidden)="onHidden()"
				></div>
			`,
			host: { '[class.ngb-reduce-motion]': 'reduceMotion' },
		})
		class TestAnimationComponent {
			collapsed = false;
			reduceMotion = true;
			onCollapse = () => {};
			onShown = () => {};
			onHidden = () => {};
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

			const buttonEl = fixture.nativeElement.querySelector('button');
			const content = getCollapsibleContent(fixture.nativeElement);

			const onCollapseSpy = vi.spyOn(fixture.componentInstance, 'onCollapse');
			const onShownSpy = vi.spyOn(fixture.componentInstance, 'onShown');
			const onHiddenSpy = vi.spyOn(fixture.componentInstance, 'onHidden');

			expect(content.classList.contains('collapse')).toBe(true);
			expect(content.classList.contains('show')).toBe(true);
			expect(content.classList.contains('collapsing')).toBe(false);
			expect(fixture.componentInstance.collapsed).toBe(false);

			// Collapsing
			const onHiddenPromise = new Promise<void>((resolve) => onHiddenSpy.mockImplementation(resolve));

			buttonEl.click();
			fixture.detectChanges();

			expect(onHiddenSpy).not.toHaveBeenCalled();
			expect(onCollapseSpy).toHaveBeenCalledTimes(1);
			expect(content.classList.contains('collapse')).toBe(false);
			expect(content.classList.contains('show')).toBe(false);
			expect(content.classList.contains('collapsing')).toBe(true);

			await onHiddenPromise;

			expect(content.classList.contains('collapse')).toBe(true);
			expect(content.classList.contains('show')).toBe(false);
			expect(content.classList.contains('collapsing')).toBe(false);

			// Expanding
			const onShownPromise = new Promise<void>((resolve) => onShownSpy.mockImplementation(resolve));

			buttonEl.click();
			fixture.detectChanges();
			expect(onShownSpy).not.toHaveBeenCalled();
			expect(content.classList.contains('collapse')).toBe(false);
			expect(content.classList.contains('show')).toBe(false);
			expect(content.classList.contains('collapsing')).toBe(true);

			await onShownPromise;

			expect(onCollapseSpy).toHaveBeenCalledTimes(2);
			expect(content.classList.contains('collapse')).toBe(true);
			expect(content.classList.contains('show')).toBe(true);
			expect(content.classList.contains('collapsing')).toBe(false);
		});

		it(`should run collapsing transition (force-reduced-motion = true)`, () => {
			const fixture = TestBed.createComponent(TestAnimationComponent);
			fixture.componentInstance.reduceMotion = true;
			fixture.detectChanges();

			const buttonEl = fixture.nativeElement.querySelector('button');
			const content = getCollapsibleContent(fixture.nativeElement);

			const onCollapseSpy = vi.spyOn(fixture.componentInstance, 'onCollapse');
			const onShownSpy = vi.spyOn(fixture.componentInstance, 'onShown');
			const onHiddenSpy = vi.spyOn(fixture.componentInstance, 'onHidden');

			expect(content.classList.contains('collapse')).toBe(true);
			expect(content.classList.contains('show')).toBe(true);
			expect(content.classList.contains('collapsing')).toBe(false);
			expect(fixture.componentInstance.collapsed).toBe(false);

			// Collapsing
			buttonEl.click();
			fixture.detectChanges();
			expect(onHiddenSpy).toHaveBeenCalled();
			expect(onCollapseSpy).toHaveBeenCalledTimes(1);
			expect(content.classList.contains('collapse')).toBe(true);
			expect(content.classList.contains('show')).toBe(false);
			expect(content.classList.contains('collapsing')).toBe(false);

			// Expanding
			buttonEl.click();
			fixture.detectChanges();
			expect(onShownSpy).toHaveBeenCalled();
			expect(onCollapseSpy).toHaveBeenCalledTimes(2);
			expect(content.classList.contains('collapse')).toBe(true);
			expect(content.classList.contains('show')).toBe(true);
			expect(content.classList.contains('collapsing')).toBe(false);
		});

		it(`should run revert collapsing transition (force-reduced-motion = false)`, async () => {
			const fixture = TestBed.createComponent(TestAnimationComponent);
			fixture.componentInstance.reduceMotion = false;
			fixture.detectChanges();

			const buttonEl = fixture.nativeElement.querySelector('button');
			const content = getCollapsibleContent(fixture.nativeElement);

			const onCollapseSpy = vi.spyOn(fixture.componentInstance, 'onCollapse');
			const onShownSpy = vi.spyOn(fixture.componentInstance, 'onShown');
			const onHiddenSpy = vi.spyOn(fixture.componentInstance, 'onHidden');

			expect(content.classList.contains('collapse')).toBe(true);
			expect(content.classList.contains('show')).toBe(true);
			expect(content.classList.contains('collapsing')).toBe(false);
			expect(fixture.componentInstance.collapsed).toBe(false);

			// Collapsing
			buttonEl.click();
			fixture.detectChanges();
			expect(onCollapseSpy).toHaveBeenCalledTimes(1);
			expect(content.classList.contains('collapse')).toBe(false);
			expect(content.classList.contains('show')).toBe(false);
			expect(content.classList.contains('collapsing')).toBe(true);

			// Expanding before hidden
			const onShownPromise = new Promise<void>((resolve) => onShownSpy.mockImplementation(resolve));

			buttonEl.click();
			fixture.detectChanges();
			expect(onCollapseSpy).toHaveBeenCalledTimes(2);
			expect(content.classList.contains('collapse')).toBe(false);
			expect(content.classList.contains('show')).toBe(false);
			expect(content.classList.contains('collapsing')).toBe(true);

			await onShownPromise;

			expect(onHiddenSpy).not.toHaveBeenCalled();
			expect(fixture.componentInstance.collapsed).toBe(false);
			expect(content.classList.contains('collapse')).toBe(true);
			expect(content.classList.contains('show')).toBe(true);
			expect(content.classList.contains('collapsing')).toBe(false);
		});
	});
}

@Component({
	selector: 'test-cmp',
	imports: [NgbCollapse],
	template: '',
})
class TestComponent {
	collapsed = false;
}
