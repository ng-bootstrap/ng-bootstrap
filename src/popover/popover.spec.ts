import { TestBed } from '@angular/core/testing';
import { createGenericAsyncTestComponent, isBrowserVisible, triggerEvent } from '../test/common';
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { environment } from '../utils/transition/ngbTransition';

import { By } from '@angular/platform-browser';
import {
	Component,
	ViewChild,
	Service,
	OnDestroy,
	TemplateRef,
	ViewContainerRef,
	AfterViewInit,
	signal,
	inputBinding,
	inject,
} from '@angular/core';

import { NgbPopover, NgbPopoverWindow } from './popover';
import { NgbPopoverConfig } from './popover-config';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap/tooltip';
import { NgbConfig } from '@ng-bootstrap/ng-bootstrap/config';
import { NgbConfigAnimation } from '../test/ngb-config-animation';
import { Options } from '@popperjs/core';

@Service({ autoProvided: false })
class SpyService {
	called = false;
}

const createTestComponent = (html: string) => createGenericAsyncTestComponent(html, TestComponent);

const createOnPushTestComponent = (html: string) => createGenericAsyncTestComponent(html, TestOnPushComponent);

function getWindow(element) {
	return element.querySelector('ngb-popover-window');
}

describe('ngb-popover-window', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({});
	});

	afterEach(() => {
		// Cleaning elements, because of a TestBed issue with the id attribute
		Array.from(document.body.children).map((element: HTMLElement) => {
			if (element.tagName.toLocaleLowerCase() === 'div') {
				element.parentNode!.removeChild(element);
			}
		});
	});

	it('should render popover on top by default', async () => {
		const fixture = TestBed.createComponent(NgbPopoverWindow, {
			bindings: [
				inputBinding('title', () => 'Test title'),
				// Firefox may fire mouseenter event causing the test to fail because of missing function input
				inputBinding('onMouseEnter', () => () => {}),
			],
		});
		await fixture.whenStable();

		expect(fixture.nativeElement).toHaveCssClass('popover');
		expect(fixture.nativeElement).not.toHaveCssClass('show');
		expect(fixture.nativeElement).not.toHaveCssClass('fade');
		expect(fixture.nativeElement).not.toHaveCssClass('bs-popover-top');
		expect(fixture.nativeElement.getAttribute('role')).toBe('tooltip');
		expect(fixture.nativeElement.querySelector('.popover-header').textContent).toBe('Test title');
	});

	it('should optionally have a custom class', async () => {
		const popoverClass = signal<string | undefined>(undefined);
		const fixture = TestBed.createComponent(NgbPopoverWindow, {
			bindings: [
				inputBinding('popoverClass', popoverClass),
				// Firefox may fire mouseenter event causing the test to fail because of missing function input
				inputBinding('onMouseEnter', () => () => {}),
			],
		});
		await fixture.whenStable();

		expect(fixture.nativeElement).not.toHaveCssClass('my-custom-class');

		popoverClass.set('my-custom-class');
		await fixture.whenStable();

		expect(fixture.nativeElement).toHaveCssClass('my-custom-class');
	});
});

describe('ngb-popover', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [SpyService],
		});
	});

	describe('basic functionality', () => {
		it('should open and close a popover - default settings and content as string', async () => {
			const fixture = await createTestComponent(
				`<div ngbPopover="Great tip!" popoverTitle="Title" style="margin-top: 110px;"></div>`,
			);
			const directive = fixture.debugElement.query(By.directive(NgbPopover));

			triggerEvent(directive, 'click');
			await fixture.whenStable();

			const windowEl = getWindow(fixture.nativeElement);
			const id = windowEl.getAttribute('id');

			expect(windowEl).toHaveCssClass('popover');
			expect(windowEl).toHaveCssClass('bs-popover-top');
			expect(windowEl).toHaveCssClass('show');
			expect(windowEl).not.toHaveCssClass('fade');
			expect(windowEl.textContent.trim()).toBe('TitleGreat tip!');
			expect(windowEl.getAttribute('role')).toBe('tooltip');
			expect(windowEl.parentNode).toBe(fixture.nativeElement);
			expect(directive.nativeElement.getAttribute('aria-describedby')).toBe(id);

			triggerEvent(directive, 'click');
			await fixture.whenStable();
			expect(getWindow(fixture.nativeElement)).toBeNull();
			expect(directive.nativeElement.getAttribute('aria-describedby')).toBeNull();
		});

		it('should open and close a popover - default settings and content from a template', async () => {
			const fixture = await createTestComponent(`
          <ng-template #t>Hello, {{name()}}!</ng-template>
          <div [ngbPopover]="t" popoverTitle="Title" style="margin-top: 150px;"></div>`);
			const directive = fixture.debugElement.query(By.directive(NgbPopover));

			triggerEvent(directive, 'click');
			await fixture.whenStable();
			const windowEl = getWindow(fixture.nativeElement);
			const id = windowEl.getAttribute('id');

			expect(windowEl).toHaveCssClass('popover');
			expect(windowEl).toHaveCssClass('bs-popover-top');
			expect(windowEl.textContent.trim()).toBe('TitleHello, World!');
			expect(windowEl.getAttribute('role')).toBe('tooltip');
			expect(windowEl.parentNode).toBe(fixture.nativeElement);
			expect(directive.nativeElement.getAttribute('aria-describedby')).toBe(id);

			triggerEvent(directive, 'click');
			await fixture.whenStable();
			expect(getWindow(fixture.nativeElement)).toBeNull();
			expect(directive.nativeElement.getAttribute('aria-describedby')).toBeNull();
		});

		it('should open and close a popover - default settings, content from a template and context supplied', async () => {
			const fixture = await createTestComponent(`
          <ng-template #t let-name="name">Hello, {{name}}!</ng-template>
          <div [ngbPopover]="t" popoverTitle="Title" style="margin-top: 150px;"></div>`);
			const directive = fixture.debugElement.query(By.directive(NgbPopover));

			directive.context.popover.open({ name: 'John' });
			await fixture.whenStable();
			const windowEl = getWindow(fixture.nativeElement);
			const id = windowEl.getAttribute('id');

			expect(windowEl).toHaveCssClass('popover');
			expect(windowEl).toHaveCssClass('bs-popover-top');
			expect(windowEl.textContent.trim()).toBe('TitleHello, John!');
			expect(windowEl.getAttribute('role')).toBe('tooltip');
			expect(windowEl.parentNode).toBe(fixture.nativeElement);
			expect(directive.nativeElement.getAttribute('aria-describedby')).toBe(id);

			triggerEvent(directive, 'click');
			await fixture.whenStable();
			expect(getWindow(fixture.nativeElement)).toBeNull();
			expect(directive.nativeElement.getAttribute('aria-describedby')).toBeNull();
		});

		it('should open and close a popover - default settings, content from a template and template context object supplied by markup', async () => {
			const fixture = await createTestComponent(`
          <ng-template #t let-name="name">Hello, {{name}}!</ng-template>
          <div [ngbPopover]="t" popoverTitle="Title" [popoverContext]="{name: 'John'}" style="margin-top: 150px;"></div>`);
			const directive = fixture.debugElement.query(By.directive(NgbPopover));

			directive.context.popover.open();
			await fixture.whenStable();
			const windowEl = getWindow(fixture.nativeElement);
			const id = windowEl.getAttribute('id');

			expect(windowEl).toHaveCssClass('popover');
			expect(windowEl).toHaveCssClass('bs-popover-top');
			expect(windowEl.textContent.trim()).toBe('TitleHello, John!');
			expect(windowEl.getAttribute('role')).toBe('tooltip');
			expect(windowEl.parentNode).toBe(fixture.nativeElement);
			expect(directive.nativeElement.getAttribute('aria-describedby')).toBe(id);

			triggerEvent(directive, 'click');
			await fixture.whenStable();
			expect(getWindow(fixture.nativeElement)).toBeNull();
			expect(directive.nativeElement.getAttribute('aria-describedby')).toBeNull();
		});

		it('should open and close a popover - default settings, content from a template and template context object supplied by markup, open by click', async () => {
			const fixture = await createTestComponent(`
          <ng-template #t let-name="name">Hello, {{name}}!</ng-template>
          <div [ngbPopover]="t" popoverTitle="Title" [popoverContext]="{name: 'John'}" style="margin-top: 150px;"></div>`);
			const directive = fixture.debugElement.query(By.directive(NgbPopover));

			triggerEvent(directive, 'click');
			await fixture.whenStable();
			const windowEl = getWindow(fixture.nativeElement);
			const id = windowEl.getAttribute('id');

			expect(windowEl).toHaveCssClass('popover');
			expect(windowEl).toHaveCssClass('bs-popover-top');
			expect(windowEl.textContent.trim()).toBe('TitleHello, John!');
			expect(windowEl.getAttribute('role')).toBe('tooltip');
			expect(windowEl.parentNode).toBe(fixture.nativeElement);
			expect(directive.nativeElement.getAttribute('aria-describedby')).toBe(id);

			triggerEvent(directive, 'click');
			await fixture.whenStable();
			expect(getWindow(fixture.nativeElement)).toBeNull();
			expect(directive.nativeElement.getAttribute('aria-describedby')).toBeNull();
		});

		it('should open and close a popover - default settings, content from a template and template context object supplied can be override with open method', async () => {
			const fixture = await createTestComponent(`
          <ng-template #t let-name="name">Hello, {{name}}!</ng-template>
          <div [ngbPopover]="t" popoverTitle="Title" [popoverContext]="{name: 'John'}" style="margin-top: 150px;"></div>`);
			const directive = fixture.debugElement.query(By.directive(NgbPopover));

			directive.context.popover.open({ name: 'World' });
			await fixture.whenStable();
			const windowEl = getWindow(fixture.nativeElement);
			const id = windowEl.getAttribute('id');

			expect(windowEl).toHaveCssClass('popover');
			expect(windowEl).toHaveCssClass('bs-popover-top');
			expect(windowEl.textContent.trim()).toBe('TitleHello, World!');
			expect(windowEl.getAttribute('role')).toBe('tooltip');
			expect(windowEl.parentNode).toBe(fixture.nativeElement);
			expect(directive.nativeElement.getAttribute('aria-describedby')).toBe(id);

			triggerEvent(directive, 'click');
			await fixture.whenStable();
			expect(getWindow(fixture.nativeElement)).toBeNull();
			expect(directive.nativeElement.getAttribute('aria-describedby')).toBeNull();
		});

		it('should open and close a popover - default settings and custom class', async () => {
			const fixture = await createTestComponent(`
        <div ngbPopover="Great tip!" popoverTitle="Title" popoverClass="my-custom-class" style="margin-top: 150px;"></div>`);
			const directive = fixture.debugElement.query(By.directive(NgbPopover));

			triggerEvent(directive, 'click');
			await fixture.whenStable();
			const windowEl = getWindow(fixture.nativeElement);
			const id = windowEl.getAttribute('id');

			expect(windowEl).toHaveCssClass('popover');
			expect(windowEl).toHaveCssClass('bs-popover-top');
			expect(windowEl).toHaveCssClass('my-custom-class');
			expect(windowEl.textContent.trim()).toBe('TitleGreat tip!');
			expect(windowEl.getAttribute('role')).toBe('tooltip');
			expect(windowEl.parentNode).toBe(fixture.nativeElement);
			expect(directive.nativeElement.getAttribute('aria-describedby')).toBe(id);

			triggerEvent(directive, 'click');
			await fixture.whenStable();
			expect(getWindow(fixture.nativeElement)).toBeNull();
			expect(directive.nativeElement.getAttribute('aria-describedby')).toBeNull();
		});

		it('should propagate popoverClass changes to the window', async () => {
			const fixture = await createTestComponent(
				`<div ngbPopover="Great tip!" popoverTitle="Title" [popoverClass]="popoverClass()"></div>`,
			);
			const directive = fixture.debugElement.query(By.directive(NgbPopover));

			triggerEvent(directive, 'click');
			await fixture.whenStable();
			const windowEl = getWindow(fixture.nativeElement);
			expect(windowEl).not.toHaveCssClass('my-popover-class');

			fixture.componentInstance.popoverClass.set('my-popover-class');
			await fixture.whenStable();
			expect(windowEl).toHaveCssClass('my-popover-class');
		});

		it('should accept a template for the title and properly destroy it when closing', async () => {
			const fixture = await createTestComponent(`
          <ng-template #t>Hello, {{name()}}! <destroyable-cmpt></destroyable-cmpt></ng-template>
          <div ngbPopover="Body" [popoverTitle]="t"></div>`);
			const directive = fixture.debugElement.query(By.directive(NgbPopover));
			const spyService = fixture.debugElement.injector.get(SpyService);

			triggerEvent(directive, 'click');
			await fixture.whenStable();
			const windowEl = getWindow(fixture.nativeElement);
			expect(windowEl.textContent.trim()).toBe('Hello, World! Some contentBody');
			expect(spyService.called).toBeFalsy();

			triggerEvent(directive, 'click');
			await fixture.whenStable();
			expect(getWindow(fixture.nativeElement)).toBeNull();
			expect(spyService.called).toBeTruthy();
		});

		it('should pass the context to the template for the title', async () => {
			const fixture = await createTestComponent(`
          <ng-template #t let-greeting="greeting">{{greeting}}, {{name()}}!</ng-template>
          <div ngbPopover="!!" [popoverTitle]="t"></div>`);
			const directive = fixture.debugElement.query(By.directive(NgbPopover));

			fixture.componentInstance.name.set('tout le monde');
			fixture.componentInstance.popover.open({ greeting: 'Bonjour' });
			await fixture.whenStable();
			const windowEl = getWindow(fixture.nativeElement);
			expect(windowEl.textContent.trim()).toBe('Bonjour, tout le monde!!!');

			triggerEvent(directive, 'click');
			await fixture.whenStable();
			expect(getWindow(fixture.nativeElement)).toBeNull();
		});

		it('should properly destroy TemplateRef content', async () => {
			const fixture = await createTestComponent(`
          <ng-template #t><destroyable-cmpt></destroyable-cmpt></ng-template>
          <div [ngbPopover]="t" popoverTitle="Title"></div>`);
			const directive = fixture.debugElement.query(By.directive(NgbPopover));
			const spyService = fixture.debugElement.injector.get(SpyService);

			triggerEvent(directive, 'click');
			await fixture.whenStable();
			expect(getWindow(fixture.nativeElement)).not.toBeNull();
			expect(spyService.called).toBeFalsy();

			triggerEvent(directive, 'click');
			await fixture.whenStable();
			expect(getWindow(fixture.nativeElement)).toBeNull();
			expect(spyService.called).toBeTruthy();
		});

		it('should not show a header if title is empty', async () => {
			const fixture = await createTestComponent(`<div ngbPopover="Great tip!" popoverTitle=""></div>`);
			const directive = fixture.debugElement.query(By.directive(NgbPopover));

			triggerEvent(directive, 'click');
			await fixture.whenStable();
			const windowEl = getWindow(fixture.nativeElement);
			expect(windowEl.querySelector('.popover-header')).toBeNull();
		});

		it('should not show a header if title is falsy', async () => {
			const fixture = await createTestComponent(`<div ngbPopover="Great tip!"></div>`);
			const directive = fixture.debugElement.query(By.directive(NgbPopover));

			triggerEvent(directive, 'click');
			await fixture.whenStable();
			const windowEl = getWindow(fixture.nativeElement);
			expect(windowEl.querySelector('.popover-header')).toBeNull();
		});

		it('should not open a popover if content and title are empty', async () => {
			const fixture = await createTestComponent(`<div [ngbPopover]="" [popoverTitle]=""></div>`);
			const directive = fixture.debugElement.query(By.directive(NgbPopover));

			triggerEvent(directive, 'click');
			await fixture.whenStable();
			const windowEl = getWindow(fixture.nativeElement);

			expect(windowEl).toBeNull();
		});

		it('should not open a popover if [disablePopover] flag', async () => {
			const fixture = await createTestComponent(`<div [ngbPopover]="Disabled!" [disablePopover]="true"></div>`);
			const directive = fixture.debugElement.query(By.directive(NgbPopover));

			triggerEvent(directive, 'click');
			await fixture.whenStable();
			const windowEl = getWindow(fixture.nativeElement);

			expect(windowEl).toBeNull();
		});

		it('should close the popover if content and title become empty', async () => {
			const fixture = await createTestComponent(`<div [ngbPopover]="name()" [popoverTitle]="title()"></div>`);
			const directive = fixture.debugElement.query(By.directive(NgbPopover));

			triggerEvent(directive, 'click');
			await fixture.whenStable();
			expect(getWindow(fixture.nativeElement)).not.toBeNull();

			fixture.componentInstance.name.set('');
			fixture.componentInstance.title.set('');
			await fixture.whenStable();
			expect(getWindow(fixture.nativeElement)).toBeNull();
		});

		it('should open the popover if content is empty but title has value', async () => {
			const fixture = await createTestComponent(`<div [ngbPopover]="" popoverTitle="title"></div>`);
			const directive = fixture.debugElement.query(By.directive(NgbPopover));

			triggerEvent(directive, 'click');
			await fixture.whenStable();
			const windowEl = getWindow(fixture.nativeElement);

			expect(windowEl).not.toBeNull();
		});

		it('should not close the popover if content becomes empty but title has value', async () => {
			const fixture = await createTestComponent(`<div [ngbPopover]="name()" popoverTitle="title"></div>`);
			const directive = fixture.debugElement.query(By.directive(NgbPopover));

			triggerEvent(directive, 'click');
			await fixture.whenStable();
			expect(getWindow(fixture.nativeElement)).not.toBeNull();

			fixture.componentInstance.name.set('');
			await fixture.whenStable();
			expect(getWindow(fixture.nativeElement)).not.toBeNull();
		});

		it('should allow re-opening previously closed popovers', async () => {
			const fixture = await createTestComponent(`<div ngbPopover="Great tip!" popoverTitle="Title"></div>`);
			const directive = fixture.debugElement.query(By.directive(NgbPopover));

			triggerEvent(directive, 'click');
			await fixture.whenStable();
			expect(getWindow(fixture.nativeElement)).not.toBeNull();

			triggerEvent(directive, 'click');
			await fixture.whenStable();
			expect(getWindow(fixture.nativeElement)).toBeNull();

			triggerEvent(directive, 'click');
			await fixture.whenStable();
			expect(getWindow(fixture.nativeElement)).not.toBeNull();
		});

		it('should not leave dangling popovers in the DOM', async () => {
			const fixture = await createTestComponent(`@if (show()) {
					<div ngbPopover="Great tip!" popoverTitle="Title"></div>
				}`);
			const directive = fixture.debugElement.query(By.directive(NgbPopover));

			triggerEvent(directive, 'click');
			await fixture.whenStable();
			expect(getWindow(fixture.nativeElement)).not.toBeNull();

			fixture.componentInstance.show.set(false);
			await fixture.whenStable();
			expect(getWindow(fixture.nativeElement)).toBeNull();
		});

		it('should properly cleanup popovers with manual triggers', async () => {
			const fixture = await createTestComponent(`@if (show()) {
					<div ngbPopover="Great tip!" triggers="manual" #p="ngbPopover" (mouseenter)="p.open()"></div>
				}`);
			const directive = fixture.debugElement.query(By.directive(NgbPopover));

			triggerEvent(directive, 'mouseenter');
			await fixture.whenStable();
			expect(getWindow(fixture.nativeElement)).not.toBeNull();

			fixture.componentInstance.show.set(false);
			await fixture.whenStable();
			expect(getWindow(fixture.nativeElement)).toBeNull();
		});

		it('should open popover from hooks', async () => {
			const fixture = TestBed.createComponent(TestHooksComponent);
			await fixture.whenStable();

			const popoverWindow = fixture.debugElement.query(By.directive(NgbPopoverWindow));
			expect(popoverWindow.nativeElement).toHaveCssClass('popover');
		});

		it('should cleanup popover when parent container is destroyed', async () => {
			const fixture = await createTestComponent(`@if (show()) {
           <div ngbPopover="Great popover!" [animation]="true"></div>
         }`);
			const popover = fixture.debugElement.query(By.directive(NgbPopover)).injector.get(NgbPopover);

			popover.open();
			await fixture.whenStable();
			expect(getWindow(fixture.nativeElement)).not.toBeNull();

			const hiddenSpy = vi.fn();
			popover.hidden.subscribe(hiddenSpy);

			// should close synchronously even with animations ON
			fixture.componentInstance.show.set(false);
			await fixture.whenStable();
			expect(hiddenSpy).toHaveBeenCalledTimes(1);
		});
	});

	describe('positioning', () => {
		it('should use requested position', async () => {
			const fixture = await createTestComponent(`<div ngbPopover="Great tip!" placement="start"></div>`);
			const directive = fixture.debugElement.query(By.directive(NgbPopover));

			triggerEvent(directive, 'click');
			await fixture.whenStable();
			const windowEl = getWindow(fixture.nativeElement);

			expect(windowEl).toHaveCssClass('popover');
			expect(windowEl).toHaveCssClass('bs-popover-start');
			expect(windowEl.textContent.trim()).toBe('Great tip!');
		});

		it('should properly position popovers when a component is using the OnPush strategy', async () => {
			const fixture = await createOnPushTestComponent(`<div ngbPopover="Great tip!" placement="start"></div>`);
			await fixture.whenStable();
			const directive = fixture.debugElement.query(By.directive(NgbPopover));

			triggerEvent(directive, 'click');
			await fixture.whenStable();
			const windowEl = getWindow(fixture.nativeElement);

			expect(windowEl).toHaveCssClass('popover');
			expect(windowEl).toHaveCssClass('bs-popover-start');
			expect(windowEl.textContent.trim()).toBe('Great tip!');
		});

		it('should have proper arrow placement', async () => {
			const fixture = await createTestComponent(`<div ngbPopover="Great tip!" placement="end-top"></div>`);
			const directive = fixture.debugElement.query(By.directive(NgbPopover));

			triggerEvent(directive, 'click');
			await fixture.whenStable();
			const windowEl = getWindow(fixture.nativeElement);

			expect(windowEl).toHaveCssClass('popover');
			expect(windowEl).toHaveCssClass('bs-popover-end');
			expect(windowEl).toHaveCssClass('bs-popover-end-top');
			expect(windowEl.textContent.trim()).toBe('Great tip!');
		});

		it('should accept placement in array (second value of the array should be applied)', async () => {
			const fixture = await createTestComponent(
				`<div ngbPopover="Great tip!" [placement]="['start-top','top-start']" style="margin-top: 100px;"></div>`,
			);
			const directive = fixture.debugElement.query(By.directive(NgbPopover));

			triggerEvent(directive, 'click');
			await fixture.whenStable();
			const windowEl = getWindow(fixture.nativeElement);

			expect(windowEl).toHaveCssClass('popover');
			expect(windowEl).toHaveCssClass('bs-popover-top');
			expect(windowEl).toHaveCssClass('bs-popover-top-start');
			expect(windowEl.textContent.trim()).toBe('Great tip!');
		});

		it('should accept placement with space separated values (second value should be applied)', async () => {
			const fixture = await createTestComponent(
				`<div ngbPopover="Great tip!" placement="start-top top-start" style="margin-top: 100px;"></div>`,
			);
			const directive = fixture.debugElement.query(By.directive(NgbPopover));

			triggerEvent(directive, 'click');
			await fixture.whenStable();
			const windowEl = getWindow(fixture.nativeElement);

			expect(windowEl).toHaveCssClass('popover');
			expect(windowEl).toHaveCssClass('bs-popover-top');
			expect(windowEl).toHaveCssClass('bs-popover-top-start');
			expect(windowEl.textContent.trim()).toBe('Great tip!');
		});

		it('should apply auto placement', async () => {
			const fixture = await createTestComponent(`<div ngbPopover="Great tip!" placement="auto"></div>`);
			const directive = fixture.debugElement.query(By.directive(NgbPopover));

			triggerEvent(directive, 'click');
			await fixture.whenStable();
			const windowEl = getWindow(fixture.nativeElement);

			expect(windowEl).toHaveCssClass('popover');
			// actual placement with auto is not known in advance, so use regex to check it
			expect(windowEl.getAttribute('class')).toMatch(/bs-popover-.*/);
			expect(windowEl.textContent.trim()).toBe('Great tip!');
		});

		it('should modify the popper options', async () => {
			const fixture = await createTestComponent(`<div ngbPopover="Great tip!" placement="right">Trigger</div>`);
			const popover = fixture.debugElement.query(By.directive(NgbPopover)).injector.get(NgbPopover);

			const spy = vi.fn();
			popover.popperOptions = (options: Partial<Options>) => {
				options.modifiers!.push({ name: 'test', enabled: true, phase: 'main', fn: spy });
				return options;
			};

			await new Promise<void>((resolve) => {
				popover.open();

				queueMicrotask(() => {
					expect(spy).toHaveBeenCalledTimes(1);
					resolve();
				});
			});
		});
	});

	describe('container', () => {
		it('should be appended to the element matching the selector passed to "container"', async () => {
			const selector = 'body';
			const fixture = await createTestComponent(`<div ngbPopover="Great tip!" container="` + selector + `"></div>`);
			const directive = fixture.debugElement.query(By.directive(NgbPopover));

			triggerEvent(directive, 'click');
			await fixture.whenStable();
			expect(getWindow(fixture.nativeElement)).toBeNull();
			expect(getWindow(window.document.querySelector(selector))).not.toBeNull();
		});

		it('should properly destroy popovers when the "container" option is used', async () => {
			const selector = 'body';
			const fixture = await createTestComponent(`@if (show()) {
					<div ngbPopover="Great tip!" container="${selector}"></div>
				}`);
			const directive = fixture.debugElement.query(By.directive(NgbPopover));

			triggerEvent(directive, 'click');
			await fixture.whenStable();

			expect(getWindow(document.querySelector(selector))).not.toBeNull();
			fixture.componentRef.instance.show.set(false);
			await fixture.whenStable();
			expect(getWindow(document.querySelector(selector))).toBeNull();
		});
	});

	describe('visibility', () => {
		it('should stay open if the popover is hovered before the closeDelay times out', async () => {
			vi.useFakeTimers({ shouldAdvanceTime: true });
			const fixture = await createTestComponent(
				`<div ngbPopover="Great tip!" triggers="hover" [closeDelay]="200" style="margin-top: 110px;"></div>`,
			);
			const directive = fixture.debugElement.query(By.directive(NgbPopover));

			triggerEvent(directive, 'mouseenter');
			vi.runAllTimers();
			expect(getWindow(fixture.nativeElement)).toBeTruthy();

			triggerEvent(directive, 'mouseleave');
			vi.advanceTimersByTime(100);
			triggerEvent(getWindow(fixture.nativeElement), 'mouseenter');
			vi.advanceTimersByTime(300);
			expect(getWindow(fixture.nativeElement)).toBeTruthy();

			triggerEvent(getWindow(fixture.nativeElement), 'mouseleave');
			vi.advanceTimersByTime(300);
			expect(getWindow(fixture.nativeElement)).toBeFalsy();
			vi.useRealTimers();
		});

		it('should emit events when showing and hiding popover', async () => {
			const fixture = await createTestComponent(
				`<div ngbPopover="Great tip!" triggers="click" (shown)="shown()" (hidden)="hidden()"></div>`,
			);
			const directive = fixture.debugElement.query(By.directive(NgbPopover));

			let shownSpy = vi.spyOn(fixture.componentInstance, 'shown');
			let hiddenSpy = vi.spyOn(fixture.componentInstance, 'hidden');

			triggerEvent(directive, 'click');
			await fixture.whenStable();
			expect(getWindow(fixture.nativeElement)).not.toBeNull();
			expect(shownSpy).toHaveBeenCalled();

			triggerEvent(directive, 'click');
			await fixture.whenStable();
			expect(getWindow(fixture.nativeElement)).toBeNull();
			expect(hiddenSpy).toHaveBeenCalled();
		});

		it('should not emit close event when already closed', async () => {
			const fixture = await createTestComponent(
				`<div ngbPopover="Great tip!" triggers="manual" (shown)="shown()" (hidden)="hidden()"></div>`,
			);

			let shownSpy = vi.spyOn(fixture.componentInstance, 'shown');
			let hiddenSpy = vi.spyOn(fixture.componentInstance, 'hidden');

			fixture.componentInstance.popover.open();
			await fixture.whenStable();

			fixture.componentInstance.popover.open();
			await fixture.whenStable();

			expect(getWindow(fixture.nativeElement)).not.toBeNull();
			expect(shownSpy).toHaveBeenCalled();
			expect(vi.mocked(shownSpy).mock.calls.length).toEqual(1);
			expect(hiddenSpy).not.toHaveBeenCalled();
		});

		it('should not emit open event when already opened', async () => {
			const fixture = await createTestComponent(
				`<div ngbPopover="Great tip!" triggers="manual" (shown)="shown()" (hidden)="hidden()"></div>`,
			);

			let shownSpy = vi.spyOn(fixture.componentInstance, 'shown');
			let hiddenSpy = vi.spyOn(fixture.componentInstance, 'hidden');

			fixture.componentInstance.popover.close();
			await fixture.whenStable();
			expect(getWindow(fixture.nativeElement)).toBeNull();
			expect(shownSpy).not.toHaveBeenCalled();
			expect(hiddenSpy).not.toHaveBeenCalled();
		});

		it('should report correct visibility', async () => {
			const fixture = await createTestComponent(`<div ngbPopover="Great tip!" triggers="manual"></div>`);
			await fixture.whenStable();

			expect(fixture.componentInstance.popover.isOpen()).toBeFalsy();

			fixture.componentInstance.popover.open();
			await fixture.whenStable();
			expect(fixture.componentInstance.popover.isOpen()).toBeTruthy();

			fixture.componentInstance.popover.close();
			await fixture.whenStable();
			expect(fixture.componentInstance.popover.isOpen()).toBeFalsy();
		});
	});

	describe('triggers', () => {
		it('should support toggle triggers', async () => {
			const fixture = await createTestComponent(`<div ngbPopover="Great tip!" triggers="click"></div>`);
			const directive = fixture.debugElement.query(By.directive(NgbPopover));

			triggerEvent(directive, 'click');
			await fixture.whenStable();
			expect(getWindow(fixture.nativeElement)).not.toBeNull();

			triggerEvent(directive, 'click');
			await fixture.whenStable();
			expect(getWindow(fixture.nativeElement)).toBeNull();
		});

		it('should non-default toggle triggers', async () => {
			const fixture = await createTestComponent(`<div ngbPopover="Great tip!" triggers="mouseenter:click"></div>`);
			const directive = fixture.debugElement.query(By.directive(NgbPopover));

			triggerEvent(directive, 'mouseenter');
			await fixture.whenStable();
			expect(getWindow(fixture.nativeElement)).not.toBeNull();

			triggerEvent(directive, 'click');
			await fixture.whenStable();
			expect(getWindow(fixture.nativeElement)).toBeNull();
		});

		it('should support multiple triggers', async () => {
			const fixture = await createTestComponent(
				`<div ngbPopover="Great tip!" triggers="mouseenter:mouseleave click"></div>`,
			);
			const directive = fixture.debugElement.query(By.directive(NgbPopover));

			triggerEvent(directive, 'mouseenter');
			await fixture.whenStable();
			expect(getWindow(fixture.nativeElement)).not.toBeNull();

			triggerEvent(directive, 'click');
			await fixture.whenStable();
			expect(getWindow(fixture.nativeElement)).toBeNull();
		});

		it('should not use default for manual triggers', async () => {
			const fixture = await createTestComponent(`<div ngbPopover="Great tip!" triggers="manual"></div>`);
			const directive = fixture.debugElement.query(By.directive(NgbPopover));

			triggerEvent(directive, 'mouseenter');
			await fixture.whenStable();
			expect(getWindow(fixture.nativeElement)).toBeNull();
		});

		it('should allow toggling for manual triggers', async () => {
			const fixture = await createTestComponent(`
                <div ngbPopover="Great tip!" triggers="manual" #t="ngbPopover"></div>
                <button (click)="t.toggle()">T</button>`);
			const button = fixture.nativeElement.querySelector('button');

			triggerEvent(button, 'click');
			await fixture.whenStable();
			expect(getWindow(fixture.nativeElement)).not.toBeNull();

			triggerEvent(button, 'click');
			await fixture.whenStable();
			expect(getWindow(fixture.nativeElement)).toBeNull();
		});

		it('should allow open / close for manual triggers', async () => {
			const fixture = await createTestComponent(`<div ngbPopover="Great tip!" triggers="manual" #t="ngbPopover"></div>
                <button (click)="t.open()">O</button>
                <button (click)="t.close()">C</button>`);
			const buttons = fixture.nativeElement.querySelectorAll('button');

			triggerEvent(buttons[0], 'click'); // open
			await fixture.whenStable();
			expect(getWindow(fixture.nativeElement)).not.toBeNull();

			triggerEvent(buttons[1], 'click'); // close
			await fixture.whenStable();
			expect(getWindow(fixture.nativeElement)).toBeNull();
		});

		it('should not throw when open called for manual triggers and open popover', async () => {
			const fixture = await createTestComponent(`
                <div ngbPopover="Great tip!" triggers="manual" #t="ngbPopover"></div>
                <button (click)="t.open()">O</button>`);
			const button = fixture.nativeElement.querySelector('button');

			triggerEvent(button, 'click'); // open
			await fixture.whenStable();
			expect(getWindow(fixture.nativeElement)).not.toBeNull();

			triggerEvent(button, 'click'); // open
			await fixture.whenStable();
			expect(getWindow(fixture.nativeElement)).not.toBeNull();
		});

		it('should not throw when closed called for manual triggers and closed popover', async () => {
			const fixture = await createTestComponent(`
                <div ngbPopover="Great tip!" triggers="manual" #t="ngbPopover"></div>
                <button (click)="t.close()">C</button>`);
			const button = fixture.nativeElement.querySelector('button');

			triggerEvent(button, 'click'); // close
			await fixture.whenStable();
			expect(getWindow(fixture.nativeElement)).toBeNull();
		});
	});

	describe('Custom config', () => {
		let config: NgbPopoverConfig;

		beforeEach(() => {
			TestBed.configureTestingModule({
				providers: [NgbPopoverConfig],
			});
			TestBed.overrideComponent(TestComponent, { set: { template: `<div ngbPopover="Great tip!"></div>` } });
			config = TestBed.inject(NgbPopoverConfig);
			config.placement = 'bottom';
			config.triggers = 'hover';
			config.container = 'body';
			config.popoverClass = 'my-custom-class';
		});

		it('should initialize inputs with provided config', async () => {
			const fixture = TestBed.createComponent(TestComponent);
			await fixture.whenStable();

			const popover = fixture.componentInstance.popover;

			expect(popover.placement).toBe(config.placement);
			expect(popover.triggers).toBe(config.triggers);
			expect(popover.container).toBe(config.container);
			expect(popover.popoverClass).toBe(config.popoverClass);
		});
	});

	it('should initialize inputs with provided config as provider', () => {
		TestBed.configureTestingModule({ providers: [NgbPopoverConfig] });
		TestBed.overrideComponent(TestComponent, { set: { template: `<div ngbPopover="Great tip!"></div>` } });

		let config = TestBed.inject(NgbPopoverConfig);
		config.placement = 'bottom';
		config.triggers = 'hover';
		config.popoverClass = 'my-custom-class';

		const { popover } = TestBed.createComponent(TestComponent).componentInstance;

		expect(popover.placement).toBe(config.placement);
		expect(popover.triggers).toBe(config.triggers);
		expect(popover.popoverClass).toBe(config.popoverClass);
	});

	describe('non-regression', () => {
		/**
		 * Under very specific conditions ngOnDestroy can be invoked without calling ngOnInit first.
		 * See discussion in https://github.com/ng-bootstrap/ng-bootstrap/issues/2199 for more details.
		 */
		it('should not try to call listener cleanup function when no listeners registered', async () => {
			const fixture = await createTestComponent(`
         <ng-template #tpl><div ngbPopover="Great tip!"></div></ng-template>
         <button (click)="createAndDestroyTplWithAPopover(tpl)"></button>
       `);
			const buttonEl = fixture.debugElement.query(By.css('button'));
			triggerEvent(buttonEl, 'click');
		});

		/**
		 * See https://github.com/ng-bootstrap/ng-bootstrap/issues/4494 for more details
		 * It moves the 'after' span to a new line when the popover is shown
		 */
		it('it should not move things to a new line when wrapped in a DOM element', async () => {
			const fixture = await createTestComponent(`
        <span>before</span><span><span id="popover" ngbPopover='popover' triggers='click:blur'></span></span><span id='after'>after</span>
      `);

			expect(getWindow(fixture.nativeElement)).toBeNull();

			let popover = fixture.nativeElement.querySelector('#popover') as HTMLButtonElement;
			let afterSpan = fixture.nativeElement.querySelector('#after') as HTMLSpanElement;

			const { x, y } = afterSpan.getBoundingClientRect();

			popover.click();
			expect(getWindow(fixture.nativeElement)).not.toBeNull();

			expect(afterSpan.getBoundingClientRect().x).toEqual(x);
			expect(afterSpan.getBoundingClientRect().y).toEqual(y);
		});
	});
});

describe('popover positionTarget', () => {
	function expectPopoverBePositionedAtHeightPx(heightPx: number) {
		expect(
			Math.abs(heightPx - window.document.querySelector('ngb-popover-window')!.getBoundingClientRect().top),
		).toBeLessThan(10);
	}

	it(`should be 'undefined' by default`, async () => {
		const fixture = await createTestComponent(`
        <div style="height: 50px" ngbPopover="Great tip!" placement="bottom">Popover positionTarget</div>
    `);

		const popoverElement = fixture.debugElement.query(By.directive(NgbPopover));
		const popover = popoverElement.injector.get(NgbPopover);
		expect(popover.positionTarget).toBeUndefined();

		popover.open();
		await fixture.whenStable();
		// window should be positioned at the bottom of the target element
		expectPopoverBePositionedAtHeightPx(50);
		popover.close();
	});

	it(`should be positioned against element reference`, async () => {
		const fixture = await createTestComponent(`
        <div style="height: 50px" ngbPopover="Great tip!" placement="bottom" [positionTarget]="t">Popover positionTarget</div>
        <div class="target" #t style="height: 50px"></div>
    `);

		const popoverElement = fixture.debugElement.query(By.directive(NgbPopover));
		const popover = popoverElement.injector.get(NgbPopover);
		expect(popover.positionTarget).toBe(fixture.nativeElement.querySelector('.target'));

		popover.open();
		await fixture.whenStable();

		// window should be positioned at the bottom of the target element
		expectPopoverBePositionedAtHeightPx(100);
		popover.close();
	});

	it(`should be positioned against element selector`, async () => {
		const fixture = await createTestComponent(`
        <div style="height: 50px" ngbPopover="Great tip!" placement="bottom" positionTarget=".target">Popover positionTarget</div>
        <div class="target" style="height: 50px"></div>
    `);

		const popoverElement = fixture.debugElement.query(By.directive(NgbPopover));
		const popover = popoverElement.injector.get(NgbPopover);

		popover.open();
		await fixture.whenStable();

		// window should be positioned at the bottom of the target element
		expectPopoverBePositionedAtHeightPx(100);
		popover.close();
	});

	it(`should fallback to initial position with invalid selector target`, async () => {
		const fixture = await createTestComponent(`
        <div style="height: 50px" ngbPopover="Great tip!" placement="bottom" positionTarget=".invalid-selector">Popover positionTarget</div>
    `);

		const popoverElement = fixture.debugElement.query(By.directive(NgbPopover));
		const popover = popoverElement.injector.get(NgbPopover);

		popover.open();
		await fixture.whenStable();

		// window should be positioned at the bottom of the target element
		expectPopoverBePositionedAtHeightPx(50);
		popover.close();
	});

	it(`should fallback to initial position with invalid element target`, async () => {
		const fixture = await createTestComponent(`
        <div style="height: 50px" ngbPopover="Great tip!" placement="bottom" [positionTarget]="null">Popover positionTarget</div>
    `);

		const popoverElement = fixture.debugElement.query(By.directive(NgbPopover));
		const popover = popoverElement.injector.get(NgbPopover);

		popover.open();
		await fixture.whenStable();

		// window should be positioned at the bottom of the target element
		expectPopoverBePositionedAtHeightPx(50);
		popover.close();
	});
});

describe('popover-tooltip', () => {
	it(`should work when attached on the same element and container='body'`, async () => {
		const fixture = await createTestComponent(
			`<button ngbPopover="Popover" ngbTooltip="Tooltip" container="body"></button>`,
		);
		const button = fixture.nativeElement.querySelector('button');
		const tooltip = fixture.debugElement.query(By.directive(NgbTooltip)).injector.get(NgbTooltip);
		const popover = fixture.debugElement.query(By.directive(NgbPopover)).injector.get(NgbPopover);

		tooltip.open();
		expect(tooltip.isOpen()).toBe(true);
		expect(popover.isOpen()).toBe(false);

		// this should open the popover and have produced the "Error: Failed to execute 'insertBefore' on 'Node':
		// The node before which the new node is to be inserted is not a child of this node." exception with ivy
		button.click();
	});
});

if (isBrowserVisible('ngb-popover animations')) {
	describe('ngb-popover animations', () => {
		@Component({
			imports: [NgbPopover],
			template: `<button ngbPopover="Great tip!" triggers="click" (shown)="shown()" (hidden)="hidden()"></button>`,
			host: { '[class.ngb-reduce-motion]': 'reduceMotion()' },
		})
		class TestAnimationComponent {
			readonly reduceMotion = signal(true);
			shown = () => {};
			hidden = () => {};
		}

		function expectPopover(el: HTMLElement, classes: string[], noClasses: string[], opacity: string) {
			classes.forEach((c) => expect(el).toHaveCssClass(c));
			noClasses.forEach((c) => expect(el).not.toHaveCssClass(c));
			expect(window.getComputedStyle(el).opacity).toBe(opacity);
		}

		let transitionTimerDelayMs: Mock;

		beforeEach(() => {
			transitionTimerDelayMs = vi.spyOn(environment, 'getTransitionTimerDelayMs').mockReturnValue(100);
			TestBed.configureTestingModule({
				providers: [{ provide: NgbConfig, useClass: NgbConfigAnimation }],
			});
		});

		afterEach(() => {
			transitionTimerDelayMs.mockRestore();
		});

		it(`should run transition when toggling popover (force-reduced-motion = true)`, async () => {
			const fixture = TestBed.createComponent(TestAnimationComponent);
			fixture.componentInstance.reduceMotion.set(true);
			await fixture.whenStable();

			const buttonEl = fixture.nativeElement.querySelector('button');
			expect(getWindow(fixture.nativeElement)).toBeNull();

			const shownSpy = vi.spyOn(fixture.componentInstance, 'shown');
			const hiddenSpy = vi.spyOn(fixture.componentInstance, 'hidden');

			// 1. Opening popover
			buttonEl.click();
			await fixture.whenStable();

			expect(shownSpy).toHaveBeenCalledTimes(1);
			expect(hiddenSpy).not.toHaveBeenCalled();
			expectPopover(getWindow(fixture.nativeElement), ['show', 'fade'], [], '1');

			// 2. Closing popover
			buttonEl.click();
			await fixture.whenStable();

			expect(shownSpy).toHaveBeenCalledTimes(1);
			expect(hiddenSpy).toHaveBeenCalledTimes(1);
			expect(getWindow(fixture.nativeElement)).toBeNull();
		});

		it(`should run transition when toggling popover (force-reduced-motion = false)`, async () => {
			const fixture = TestBed.createComponent(TestAnimationComponent);
			fixture.componentInstance.reduceMotion.set(false);
			await fixture.whenStable();

			const buttonEl = fixture.nativeElement.querySelector('button');
			expect(getWindow(fixture.nativeElement)).toBeNull();

			// 1. Opening popover
			const shownPromise = new Promise<void>((resolve) =>
				vi.spyOn(fixture.componentInstance, 'shown').mockImplementation(resolve),
			);

			buttonEl.click();
			await fixture.whenStable();

			expectPopover(getWindow(fixture.nativeElement), ['show', 'fade'], [], '0');
			await shownPromise;
			expectPopover(getWindow(fixture.nativeElement), ['show', 'fade'], [], '1');

			// 2. Closing popover
			const hiddenPromise = new Promise<void>((resolve) =>
				vi.spyOn(fixture.componentInstance, 'hidden').mockImplementation(resolve),
			);

			buttonEl.click();
			await fixture.whenStable();

			expectPopover(getWindow(fixture.nativeElement), ['fade'], ['show'], '1');
			await hiddenPromise;
			expect(getWindow(fixture.nativeElement)).toBeNull();
		});

		it(`should revert popover opening`, async () => {
			const fixture = TestBed.createComponent(TestAnimationComponent);
			fixture.componentInstance.reduceMotion.set(false);
			await fixture.whenStable();

			const buttonEl = fixture.nativeElement.querySelector('button');
			expect(getWindow(fixture.nativeElement)).toBeNull();

			const shownSpy = vi.spyOn(fixture.componentInstance, 'shown');

			// 1. Opening popover
			buttonEl.click();
			await fixture.whenStable();

			expectPopover(getWindow(fixture.nativeElement), ['show', 'fade'], [], '0');

			// 2. Reverting popover opening
			const hiddenPromise = new Promise<void>((resolve) =>
				vi.spyOn(fixture.componentInstance, 'hidden').mockImplementation(resolve),
			);

			buttonEl.click();
			await fixture.whenStable();

			expectPopover(getWindow(fixture.nativeElement), ['fade'], ['show'], '0');

			// 3. Popover is closed
			await hiddenPromise;
			expect(getWindow(fixture.nativeElement)).toBeNull();
			expect(shownSpy).not.toHaveBeenCalled();
		});
	});
}

@Component({
	selector: 'destroyable-cmpt',
	template: 'Some content',
})
export class DestroyableCmpt implements OnDestroy {
	private readonly _spyService = inject(SpyService);

	ngOnDestroy(): void {
		this._spyService.called = true;
	}
}

@Component({
	selector: 'test-cmpt',
	imports: [NgbPopover, NgbTooltip, DestroyableCmpt],
	template: ``,
})
export class TestComponent {
	readonly name = signal('World');
	readonly show = signal(true);
	readonly title = signal<string | undefined>(undefined);
	readonly placement = signal<string | undefined>(undefined);
	readonly popoverClass = signal<string | undefined>(undefined);

	@ViewChild(NgbPopover, { static: true })
	popover: NgbPopover;

	private readonly _vcRef = inject(ViewContainerRef);

	createAndDestroyTplWithAPopover(tpl: TemplateRef<any>) {
		this._vcRef.createEmbeddedView(tpl, {}, 0);
		this._vcRef.remove(0);
	}

	shown = () => {};
	hidden = () => {};
}

@Component({
	selector: 'test-onpush-cmpt',
	imports: [NgbPopover],
	template: ``,
})
export class TestOnPushComponent {}

@Component({
	selector: 'test-hooks',
	imports: [NgbPopover],
	template: `<div ngbPopover="popover"></div>`,
})
export class TestHooksComponent implements AfterViewInit {
	@ViewChild(NgbPopover, { static: true })
	popover;

	ngAfterViewInit() {
		this.popover.open();
	}
}
