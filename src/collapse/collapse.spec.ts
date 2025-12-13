import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Locator, page } from 'vitest/browser';
import { createGenericTestComponent, isBrowserVisible } from '../test/common';

import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NgbCollapse } from './collapse';
import { NgbConfig } from '@ng-bootstrap/ng-bootstrap/config';
import { NgbConfigAnimation } from '../test/ngb-config-animation';
import { beforeEach, describe, expect, it, vi } from 'vitest';

class CollapseTester {
	readonly fixture: ComponentFixture<TestComponent>;
	readonly componentInstance: TestComponent;
	readonly content: Locator;

	constructor(html: string) {
		this.fixture = createGenericTestComponent(html, TestComponent, false);
		this.componentInstance = this.fixture.componentInstance;
		this.content = page.elementLocator(this.fixture.nativeElement).getByCss('div');
	}
}

describe('ngb-collapse', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({});
	});

	it('should have content open', async () => {
		const tester = new CollapseTester(`<div [ngbCollapse]="collapsed()">Some content</div>`);

		await expect.element(tester.content).toHaveClass('show');
	});

	it(`should set css classes for horizontal collapse`, async () => {
		const tester = new CollapseTester(
			`<div [ngbCollapse]="collapsed()" [horizontal]="horizontal()">Some content</div>`,
		);
		await expect.element(tester.content).toHaveClass('collapse');
		await expect.element(tester.content).not.toHaveClass('collapse-horizontal');

		tester.componentInstance.horizontal.set(true);

		await expect.element(tester.content).toHaveClass('collapse');
		await expect.element(tester.content).toHaveClass('collapse-horizontal');
	});

	it('should have content closed', async () => {
		const tester = new CollapseTester(`<div [ngbCollapse]="collapsed()">Some content</div>`);
		await expect.element(tester.content).toBeVisible();

		tester.componentInstance.collapsed.set(true);

		await expect.element(tester.content).not.toHaveClass('show');
	});

	it('should toggle collapsed content based on bound model change', async () => {
		const tester = new CollapseTester(`<div [ngbCollapse]="collapsed()">Some content</div>`);

		await expect.element(tester.content).toHaveClass('show');

		tester.componentInstance.collapsed.set(true);

		await expect.element(tester.content).not.toHaveClass('show');

		tester.componentInstance.collapsed.set(false);

		await expect.element(tester.content).toHaveClass('show');
	});

	it('should allow toggling collapse from outside', async () => {
		const tester = new CollapseTester(`
      <button (click)="collapse.toggle()">Collapse</button>
      <div [ngbCollapse]="collapsed()" #collapse="ngbCollapse"></div>`);
		const button = page.getByRole('button');
		await expect.element(button).toBeVisible();

		await button.click();

		await expect.element(tester.content).not.toHaveClass('show');

		await button.click();
		await expect.element(tester.content).toHaveClass('show');
	});

	it('should work with no binding', async () => {
		const tester = new CollapseTester(`
      <button (click)="collapse.toggle()">Collapse</button>
      <div ngbCollapse #collapse="ngbCollapse"></div>`);
		const button = page.getByRole('button');
		await expect.element(button).toBeVisible();

		await button.click();
		await expect.element(tester.content).not.toHaveClass('show');

		await button.click();
		await expect.element(tester.content).toHaveClass('show');
	});
});

if (isBrowserVisible('ngb-collapse animations')) {
	// do not use locators and retried assertions here otherwise the timers, which are very short, trigger
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
			host: { '[class.ngb-reduce-motion]': 'reduceMotion()' },
			changeDetection: ChangeDetectionStrategy.OnPush,
		})
		class TestAnimationComponent {
			collapsed = signal(false);
			reduceMotion = signal(true);
			onCollapse = () => {};
			onShown = () => {};
			onHidden = () => {};
		}

		class CollapseAnimationsTester {
			readonly fixture = TestBed.createComponent(TestAnimationComponent);
			readonly componentInstance = this.fixture.componentInstance;
			readonly button = this.fixture.nativeElement.querySelector('button') as HTMLButtonElement;
			readonly content = this.fixture.nativeElement.querySelector('div') as HTMLDivElement;
		}

		beforeEach(() => {
			TestBed.configureTestingModule({
				providers: [{ provide: NgbConfig, useClass: NgbConfigAnimation }],
			});
		});

		it(`should run collapsing transition (force-reduced-motion = false)`, async () => {
			const tester = new CollapseAnimationsTester();
			tester.componentInstance.reduceMotion.set(false);
			await tester.fixture.whenStable();

			const onCollapseSpy = vi.spyOn(tester.componentInstance, 'onCollapse');
			const onShownSpy = vi.spyOn(tester.componentInstance, 'onShown');
			const onHiddenSpy = vi.spyOn(tester.componentInstance, 'onHidden');

			expect(tester.content).toHaveClass('collapse');
			expect(tester.content).toHaveClass('show');
			expect(tester.content).not.toHaveClass('collapsing');
			expect(tester.componentInstance.collapsed()).toBe(false);

			// Collapsing
			const onHiddenPromise = new Promise<void>((resolve) => onHiddenSpy.mockImplementation(resolve));

			tester.button.click();
			await tester.fixture.whenStable();

			expect(onHiddenSpy).not.toHaveBeenCalled();
			expect(onCollapseSpy).toHaveBeenCalledTimes(1);
			expect(tester.content).not.toHaveClass('collapse');
			expect(tester.content).not.toHaveClass('show');
			expect(tester.content).toHaveClass('collapsing');

			await onHiddenPromise;

			expect(tester.content).toHaveClass('collapse');
			expect(tester.content).not.toHaveClass('show');
			expect(tester.content).not.toHaveClass('collapsing');

			// Expanding
			const onShownPromise = new Promise<void>((resolve) => onShownSpy.mockImplementation(resolve));

			tester.button.click();
			await tester.fixture.whenStable();

			expect(onShownSpy).not.toHaveBeenCalled();
			expect(tester.content).not.toHaveClass('collapse');
			expect(tester.content).not.toHaveClass('show');
			expect(tester.content).toHaveClass('collapsing');

			await onShownPromise;

			expect(onCollapseSpy).toHaveBeenCalledTimes(2);
			expect(tester.content).toHaveClass('collapse');
			expect(tester.content).toHaveClass('show');
			expect(tester.content).not.toHaveClass('collapsing');
		});

		it(`should run collapsing transition (force-reduced-motion = true)`, async () => {
			const tester = new CollapseAnimationsTester();
			tester.componentInstance.reduceMotion.set(true);
			await tester.fixture.whenStable();

			const onCollapseSpy = vi.spyOn(tester.componentInstance, 'onCollapse');
			const onShownSpy = vi.spyOn(tester.componentInstance, 'onShown');
			const onHiddenSpy = vi.spyOn(tester.componentInstance, 'onHidden');

			expect(tester.content).toHaveClass('collapse');
			expect(tester.content).toHaveClass('show');
			expect(tester.content).not.toHaveClass('collapsing');
			expect(tester.componentInstance.collapsed()).toBe(false);

			// Collapsing
			tester.button.click();
			await tester.fixture.whenStable();

			expect(onHiddenSpy).toHaveBeenCalled();
			expect(onCollapseSpy).toHaveBeenCalledTimes(1);
			expect(tester.content).toHaveClass('collapse');
			expect(tester.content).not.toHaveClass('show');
			expect(tester.content).not.toHaveClass('collapsing');

			// Expanding
			tester.button.click();
			await tester.fixture.whenStable();

			expect(onShownSpy).toHaveBeenCalled();
			expect(onCollapseSpy).toHaveBeenCalledTimes(2);
			expect(tester.content).toHaveClass('collapse');
			expect(tester.content).toHaveClass('show');
			expect(tester.content).not.toHaveClass('collapsing');
		});

		it(`should run revert collapsing transition (force-reduced-motion = false)`, async () => {
			const tester = new CollapseAnimationsTester();
			tester.componentInstance.reduceMotion.set(false);
			await tester.fixture.whenStable();

			const onCollapseSpy = vi.spyOn(tester.componentInstance, 'onCollapse');
			const onShownSpy = vi.spyOn(tester.componentInstance, 'onShown');
			const onHiddenSpy = vi.spyOn(tester.componentInstance, 'onHidden');

			expect(tester.content).toHaveClass('collapse');
			expect(tester.content).toHaveClass('show');
			expect(tester.content).not.toHaveClass('collapsing');
			expect(tester.componentInstance.collapsed()).toBe(false);

			// Collapsing
			tester.button.click();
			await tester.fixture.whenStable();

			expect(onCollapseSpy).toHaveBeenCalledTimes(1);
			expect(tester.content).not.toHaveClass('collapse');
			expect(tester.content).not.toHaveClass('show');
			expect(tester.content).toHaveClass('collapsing');

			// Expanding before hidden
			const onShownPromise = new Promise<void>((resolve) => onShownSpy.mockImplementation(resolve));

			tester.button.click();
			await tester.fixture.whenStable();

			expect(onCollapseSpy).toHaveBeenCalledTimes(2);
			expect(tester.content).not.toHaveClass('collapse');
			expect(tester.content).not.toHaveClass('show');
			expect(tester.content).toHaveClass('collapsing');

			await onShownPromise;

			expect(onHiddenSpy).not.toHaveBeenCalled();
			expect(tester.componentInstance.collapsed()).toBe(false);
			expect(tester.content).toHaveClass('collapse');
			expect(tester.content).toHaveClass('show');
			expect(tester.content).not.toHaveClass('collapsing');
		});
	});
}

@Component({
	selector: 'test-cmp',
	imports: [NgbCollapse],
	template: '<div [ngbCollapse]="collapsed()"></div>',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestComponent {
	collapsed = signal(false);
	horizontal = signal(false);
}
