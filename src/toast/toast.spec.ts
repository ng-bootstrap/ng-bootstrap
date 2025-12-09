import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { createGenericTestComponent, isBrowserVisible } from '../test/common';

import { NgbToast, NgbToastHeader } from './toast';
import { NgbConfig } from '@ng-bootstrap/ng-bootstrap/config';
import { NgbConfigAnimation } from '../test/ngb-config-animation';
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { environment } from '../utils/transition/ngbTransition';

const createTestComponent = (html: string) =>
	createGenericTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;

const getElementWithSelector = (element: HTMLElement, className) => element.querySelector(className);

const getToastElement = (element: HTMLElement): Element => getElementWithSelector(element, 'ngb-toast');
const getToastHeaderElement = (element: HTMLElement): Element =>
	getElementWithSelector(element, 'ngb-toast .toast-header');
const getToastBodyElement = (element: HTMLElement): Element => getElementWithSelector(element, 'ngb-toast .toast-body');

describe('ngb-toast', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	describe('via declarative usage', () => {
		it('should be instantiable declaratively', () => {
			const fixture = createTestComponent(`<ngb-toast header="header">body</ngb-toast>`);
			expect(fixture.componentInstance).toBeTruthy();
		});

		it('should have default classnames', () => {
			const fixture = createTestComponent(`<ngb-toast header="header">body</ngb-toast>`);
			// Below getter are using Bootstrap classnames
			const toast = getToastElement(fixture.nativeElement);
			const header = getToastHeaderElement(fixture.nativeElement);
			const body = getToastBodyElement(fixture.nativeElement);

			expect(toast).toBeDefined();
			expect(toast).toHaveCssClass('toast');
			expect(toast).not.toHaveCssClass('fade');
			expect(toast).toHaveCssClass('show');
			expect(header).toBeDefined();
			expect(body).toBeDefined();
		});

		it('should not generate a header element when header input is not specified', () => {
			const fixture = createTestComponent(`<ngb-toast>body</ngb-toast>`);
			const toastHeader = getToastHeaderElement(fixture.nativeElement);
			expect(toastHeader).toBeNull();
		});

		it('should contain a close button when header is specified', () => {
			const fixture = createTestComponent(`<ngb-toast header="header">body</ngb-toast>`);
			const toastHeader = getToastHeaderElement(fixture.nativeElement);
			expect(toastHeader.querySelector('button.btn-close')).toBeDefined();
		});

		it('should contain a close button when ngbToastHeader is used', () => {
			const fixture = createTestComponent(`<ngb-toast>
        <ng-template ngbToastHeader>{{header}}</ng-template>
        body
      </ngb-toast>`);
			const toastHeader = getToastHeaderElement(fixture.nativeElement);
			expect(toastHeader.querySelector('button.btn-close')).toBeDefined();
		});

		it('should emit hide output when close is clicked', () => {
			const fixture = createTestComponent(
				`<ngb-toast header="header" [autohide]="false" (hidden)="hide()">body</ngb-toast>`,
			);

			const toast = getToastElement(fixture.nativeElement);
			const closeButton = toast.querySelector('button.btn-close') as HTMLElement;
			closeButton.click();
			fixture.detectChanges();
			expect(fixture.componentInstance.hide).toHaveBeenCalled();
		});

		it('should emit hide output after default delay (5000ms)', () => {
			const fixture = createTestComponent(`<ngb-toast header="header" (hidden)="hide()">body</ngb-toast>`);
			vi.advanceTimersByTime(4999);
			fixture.detectChanges();
			expect(fixture.componentInstance.hide).not.toHaveBeenCalled();
			vi.advanceTimersByTime(5000);
			fixture.detectChanges();
			expect(fixture.componentInstance.hide).toHaveBeenCalledTimes(1);
		});

		it('should emit hide output after a custom delay in ms', () => {
			const fixture = createTestComponent(
				`<ngb-toast header="header" [delay]="10000" (hidden)="hide()">body</ngb-toast>`,
			);
			vi.advanceTimersByTime(9999);
			fixture.detectChanges();
			expect(fixture.componentInstance.hide).not.toHaveBeenCalled();
			vi.advanceTimersByTime(10000);
			fixture.detectChanges();
			expect(fixture.componentInstance.hide).toHaveBeenCalledTimes(1);
		});

		it('should emit hide only one time regardless of autohide toggling', () => {
			const fixture = createTestComponent(
				`<ngb-toast header="header" [autohide]="autohide" (hidden)="hide()">body</ngb-toast>`,
			);
			vi.advanceTimersByTime(250);
			fixture.componentInstance.autohide = false;
			fixture.detectChanges();
			vi.advanceTimersByTime(250);
			fixture.detectChanges();
			expect(fixture.componentInstance.hide).not.toHaveBeenCalled();
			fixture.componentInstance.autohide = true;
			fixture.detectChanges();
			vi.advanceTimersByTime(5000);
			fixture.detectChanges();
			expect(fixture.componentInstance.hide).toHaveBeenCalledTimes(1);
		});
	});
});

if (isBrowserVisible('ngb-toast animations')) {
	describe('ngb-toast animations', () => {
		@Component({
			imports: [NgbToast, NgbToastHeader],
			template: ` <ngb-toast header="Hello" [autohide]="false" (shown)="onShown()" (hidden)="onHidden()"
				>Cool!</ngb-toast
			>`,
			host: { '[class.ngb-reduce-motion]': 'reduceMotion' },
		})
		class TestAnimationComponent {
			reduceMotion = true;
			onShown = () => {};
			onHidden = () => {};
		}
		let transitionTimerDelayMs: Mock;

		beforeEach(() => {
			transitionTimerDelayMs = vi.spyOn(environment, 'getTransitionTimerDelayMs').mockReturnValue(500);
			TestBed.configureTestingModule({
				providers: [{ provide: NgbConfig, useClass: NgbConfigAnimation }],
			});
		});

		afterEach(() => {
			transitionTimerDelayMs.mockRestore();
		});

		[true, false].forEach((reduceMotion) => {
			it(`should run the transition when creating a toast (force-reduced-motion = ${reduceMotion})`, () => {
				const fixture = TestBed.createComponent(TestAnimationComponent);
				fixture.componentInstance.reduceMotion = reduceMotion;
				fixture.detectChanges();

				const toastEl = getToastElement(fixture.nativeElement);

				vi.spyOn(fixture.componentInstance, 'onShown').mockImplementation(() => {
					expect(window.getComputedStyle(toastEl).opacity).toBe('1');
					expect(toastEl).not.toHaveCssClass('showing');
					expect(toastEl).toHaveCssClass('show');
					expect(toastEl).toHaveCssClass('fade');
				});

				expect(toastEl).toHaveCssClass('fade');
				if (reduceMotion) {
					expect(window.getComputedStyle(toastEl).opacity).toBe('1');
					expect(toastEl).toHaveCssClass('show');
				} else {
					expect(window.getComputedStyle(toastEl).opacity).toBe('0');
					expect(toastEl).toHaveCssClass('show');
					expect(toastEl).toHaveCssClass('showing');
				}
			});

			it(`should run the transition when closing a toast (force-reduced-motion = ${reduceMotion})`, async () => {
				const fixture = TestBed.createComponent(TestAnimationComponent);
				fixture.componentInstance.reduceMotion = reduceMotion;

				const onShown = new Promise<void>((resolve) => {
					vi.spyOn(fixture.componentInstance, 'onShown').mockImplementation(() => {
						const toastEl = getToastElement(fixture.nativeElement);
						expect(toastEl).not.toHaveCssClass('showing');
						expect(toastEl).toHaveCssClass('show');
						expect(toastEl).toHaveCssClass('fade');

						resolve();
					});
				});
				fixture.detectChanges();
				await onShown;

				const toastEl = getToastElement(fixture.nativeElement);

				const onHidden = new Promise<void>((resolve) => {
					vi.spyOn(fixture.componentInstance, 'onHidden').mockImplementation(() => {
						expect(toastEl).not.toHaveCssClass('show');
						expect(toastEl).toHaveCssClass('fade');

						resolve();
					});
				});

				fixture.nativeElement.querySelector('button').click();
				await onHidden;
			});
		});
	});
}

@Component({
	selector: 'test-cmp',
	imports: [NgbToast, NgbToastHeader],
	template: '',
})
export class TestComponent {
	visible = true;
	autohide = true;
	hide = vi.fn();
}
