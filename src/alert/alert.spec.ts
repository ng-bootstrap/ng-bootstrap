import { ComponentFixture, TestBed } from '@angular/core/testing';
import { createGenericTestComponent, isBrowserVisible } from '../test/common';
import { By } from '@angular/platform-browser';
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';

import { Component, signal } from '@angular/core';

import { NgbAlert } from './alert';
import { NgbAlertConfig } from './alert-config';

import { NgbConfig } from '@ng-bootstrap/ng-bootstrap/config';
import { NgbConfigAnimation } from '../test/ngb-config-animation';
import { environment } from '../utils/transition/ngbTransition';

const createTestComponent = (html: string) =>
	createGenericTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;

function getAlertElement(element: HTMLElement): HTMLDivElement {
	return <HTMLDivElement>element.querySelector('.alert');
}

function getCloseButton(element: HTMLElement): HTMLButtonElement {
	return <HTMLButtonElement>element.querySelector('button');
}

describe('ngb-alert', () => {
	it('should initialize inputs with default values', () => {
		const defaultConfig = TestBed.inject(NgbAlertConfig);
		const alertCmp = TestBed.createComponent(NgbAlert).componentInstance;
		expect(alertCmp.dismissible).toBe(defaultConfig.dismissible);
		expect(alertCmp.type).toBe(defaultConfig.type);
	});

	it('should apply those default values to the template', () => {
		const fixture = createTestComponent('<ngb-alert>Cool!</ngb-alert>');
		fixture.detectChanges();

		const alertEl = getAlertElement(fixture.nativeElement);

		expect(alertEl.getAttribute('role')).toEqual('alert');
		expect(alertEl).toHaveCssClass('alert-warning');
		expect(alertEl).toHaveCssClass('alert-dismissible');
		expect(alertEl).toHaveCssClass('show');
		expect(alertEl).not.toHaveCssClass('fade');
	});

	it('should allow specifying alert type', () => {
		const fixture = createTestComponent(
			`<ngb-alert type="success" [class]="'class1'" class="class2" [class.class3]='true'>Cool!</ngb-alert>`,
		);
		fixture.detectChanges();

		const alertEl = getAlertElement(fixture.nativeElement);

		expect(alertEl.getAttribute('role')).toEqual('alert');
		expect(alertEl).toHaveCssClass('alert');
		expect(alertEl).toHaveCssClass('class1');
		expect(alertEl).toHaveCssClass('class2');
		expect(alertEl).toHaveCssClass('class3');
		expect(alertEl).toHaveCssClass('alert-success');
	});

	it('should allow changing alert type', async () => {
		const fixture = createTestComponent(
			`'<ngb-alert [type]="type()" [class]="'class1'" class="class2" [class.class3]='true'>Cool!</ngb-alert>'`,
		);
		fixture.detectChanges();

		const alertEl = getAlertElement(fixture.nativeElement);

		expect(alertEl).toHaveCssClass('alert-success');
		expect(alertEl).not.toHaveCssClass('alert-warning');

		fixture.componentInstance.type.set('warning');
		await fixture.whenStable();
		expect(alertEl).not.toHaveCssClass('alert-success');
		expect(alertEl).toHaveCssClass('alert');
		expect(alertEl).toHaveCssClass('class1');
		expect(alertEl).toHaveCssClass('class2');
		expect(alertEl).toHaveCssClass('class3');
		expect(alertEl).toHaveCssClass('alert-warning');
	});

	it('should allow adding custom CSS classes', () => {
		const fixture = createTestComponent('<ngb-alert type="success" class="myClass">Cool!</ngb-alert>');
		const alertEl = getAlertElement(fixture.nativeElement);

		expect(alertEl).toHaveCssClass('alert');
		expect(alertEl).toHaveCssClass('alert-success');
		expect(alertEl).toHaveCssClass('myClass');
	});

	it('should render close button when dismissible', () => {
		const fixture = createTestComponent('<ngb-alert [dismissible]="true">Watch out!</ngb-alert>');
		const alertEl = getAlertElement(fixture.nativeElement);
		const buttonEl = getCloseButton(alertEl);

		expect(alertEl).toHaveCssClass('alert-dismissible');
		expect(buttonEl).toBeTruthy();
		expect(buttonEl.getAttribute('class')).toContain('btn-close');
		expect(buttonEl.getAttribute('aria-label')).toBe('Close');
	});

	it('should not render the close button if it is not dismissible', () => {
		const fixture = createTestComponent(`<ngb-alert [dismissible]="false">Don't close!</ngb-alert>`);
		const alertEl = getAlertElement(fixture.nativeElement);

		expect(alertEl).not.toHaveCssClass('alert-dismissible');
		expect(getCloseButton(alertEl)).toBeFalsy();
	});

	it('should fire an event after closing a dismissible alert', () => {
		const fixture = createTestComponent(
			'<ngb-alert [dismissible]="true" (closed)="closed.set(true)">Watch out!</ngb-alert>',
		);
		const alertEl = getAlertElement(fixture.nativeElement);
		const buttonEl = getCloseButton(alertEl);

		expect(fixture.componentInstance.closed()).toBe(false);
		buttonEl.click();
		expect(alertEl).not.toHaveCssClass('show');
		expect(alertEl).not.toHaveCssClass('fade');
		expect(fixture.componentInstance.closed()).toBe(true);
	});

	it('should fire an event after closing a dismissible alert imperatively', () => {
		const fixture = createTestComponent(
			'<ngb-alert [dismissible]="true" (closed)="closed.set(true)">Watch out!</ngb-alert>',
		);
		const alertEl = getAlertElement(fixture.nativeElement);
		const alert = fixture.debugElement.query(By.directive(NgbAlert)).injector.get(NgbAlert);

		const closedSpy = vi.fn();
		expect(fixture.componentInstance.closed()).toBe(false);
		alert.close().subscribe(closedSpy);
		fixture.detectChanges();

		expect(fixture.componentInstance.closed()).toBe(true);
		expect(closedSpy).toHaveBeenCalledTimes(1);
		expect(alertEl).not.toHaveCssClass('show');
		expect(alertEl).not.toHaveCssClass('fade');
	});

	it('should project the content given into the component', () => {
		const fixture = createTestComponent('<ngb-alert>Cool!</ngb-alert>');
		const alertEl = getAlertElement(fixture.nativeElement);

		expect(alertEl.textContent).toContain('Cool!');
	});

	it('should project content before the closing button for a11y/screen readers', () => {
		const fixture = createTestComponent('<ngb-alert [dismissible]="true"><span>Cool!</span></ngb-alert>');
		const alertEl = getAlertElement(fixture.nativeElement);

		const childElements = Array.from(alertEl.children).map((node) => node.tagName.toLowerCase());
		expect(childElements).toEqual(['span', 'button']);
	});

	describe('Custom config', () => {
		let config: NgbAlertConfig;

		beforeEach(() => {
			config = TestBed.inject(NgbAlertConfig);
			config.dismissible = false;
			config.type = 'success';
		});

		it('should initialize inputs with provided config', () => {
			const fixture = TestBed.createComponent(NgbAlert);
			fixture.detectChanges();

			const alert = fixture.componentInstance;
			expect(alert.dismissible).toBe(config.dismissible);
			expect(alert.type).toBe(config.type);
		});
	});

	it('should initialize inputs with provided config as provider', () => {
		let config = TestBed.inject(NgbAlertConfig);
		config.dismissible = false;
		config.type = 'success';

		const alert = TestBed.createComponent(NgbAlert).componentInstance;
		expect(alert.dismissible).toBe(config.dismissible);
		expect(alert.type).toBe(config.type);
	});
});

if (isBrowserVisible('ngb-alert animations')) {
	describe('ngb-alert animations', () => {
		@Component({
			imports: [NgbAlert],
			template: ` <ngb-alert type="success" (closed)="onClose()">Cool!</ngb-alert>`,
			host: { '[class.ngb-reduce-motion]': 'reduceMotion' },
		})
		class TestAnimationComponent {
			reduceMotion = true;
			onClose = () => {};
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

		[true, false].forEach((reduceMotion) => {
			it(`should run fade transition when closing alert (force-reduced-motion = ${reduceMotion})`, async () => {
				const fixture = TestBed.createComponent(TestAnimationComponent);
				fixture.componentInstance.reduceMotion = reduceMotion;
				fixture.detectChanges();

				const alertEl = getAlertElement(fixture.nativeElement);
				const buttonEl = fixture.nativeElement.querySelector('button');

				const closePromise = new Promise<void>((resolve) =>
					vi.spyOn(fixture.componentInstance, 'onClose').mockImplementation(resolve),
				);

				expect(window.getComputedStyle(alertEl).opacity).toBe('1');
				expect(alertEl).toHaveCssClass('show');
				expect(alertEl).toHaveCssClass('fade');
				buttonEl.click();

				await closePromise;
				expect(window.getComputedStyle(alertEl).opacity).toBe('0');
				expect(alertEl).not.toHaveCssClass('show');
				expect(alertEl).toHaveCssClass('fade');
			});
		});
	});
}

@Component({
	selector: 'test-cmp',
	imports: [NgbAlert],
	template: '',
})
class TestComponent {
	closed = signal(false);
	type = signal('success');
}
