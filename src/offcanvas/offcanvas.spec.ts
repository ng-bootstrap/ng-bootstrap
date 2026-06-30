import { Component, inject, Service, Injector, OnDestroy, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbOffcanvasConfig, NgbOffcanvasOptions } from './offcanvas-config';
import { NgbActiveOffcanvas, NgbOffcanvas, NgbOffcanvasRef, OffcanvasDismissReasons } from './offcanvas.module';
import { isBrowserVisible } from '../test/common';
import { NgbConfig } from '@ng-bootstrap/ng-bootstrap/config';
import { NgbConfigAnimation } from '../test/ngb-config-animation';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { firstValueFrom } from 'rxjs';

const NOOP = () => {};

@Service({ autoProvided: false })
class SpyService {
	called = false;
}

@Service({ autoProvided: false })
class CustomSpyService {
	called = false;
}

describe('ngb-offcanvas', () => {
	let fixture: ComponentFixture<TestComponent>;

	afterEach(() => {
		// detect left-over modals and report errors when found

		const remainingOffcanvasPanels = document.querySelectorAll('ngb-offcanvas-panel');
		if (remainingOffcanvasPanels.length) {
			throw new Error(`${remainingOffcanvasPanels.length} offcanvas panels were left in the DOM.`);
		}

		const remainingOffcanvasBackdrops = document.querySelectorAll('ngb-offcanvas-backdrop');
		if (remainingOffcanvasBackdrops.length) {
			throw new Error(`${remainingOffcanvasBackdrops.length} offcanvas backdrops were left in the DOM.`);
		}
	});

	describe('default configuration', () => {
		beforeEach(() => {
			TestBed.configureTestingModule({ providers: [SpyService] });
			fixture = TestBed.createComponent(TestComponent);
		});

		describe('basic functionality', () => {
			it('should open and close offcanvas with default options', async () => {
				const offcanvasInstance = fixture.componentInstance.open('foo');
				await fixture.whenStable();
				expect(fixture.nativeElement).toHaveOffcanvas('foo');

				const offcanvasEl = document.querySelector('ngb-offcanvas-panel') as HTMLElement;
				expect(offcanvasEl.classList.contains('fade')).toBe(false);
				expect(offcanvasEl.classList.contains('show')).toBe(true);

				offcanvasInstance.close('some result');
				await fixture.whenStable();
				expect(fixture.nativeElement).not.toHaveOffcanvas();
			});

			it('should open and close offcanvas from a TemplateRef content', async () => {
				const offcanvasInstance = fixture.componentInstance.openTpl();
				await fixture.whenStable();
				expect(fixture.nativeElement).toHaveOffcanvas('Hello, World!');

				offcanvasInstance.close('some result');
				await fixture.whenStable();
				expect(fixture.nativeElement).not.toHaveOffcanvas();
			});

			it('should properly destroy TemplateRef content', async () => {
				const spyService = fixture.debugElement.injector.get(SpyService);
				const offcanvasInstance = fixture.componentInstance.openDestroyableTpl();
				await fixture.whenStable();
				expect(fixture.nativeElement).toHaveOffcanvas('Some content');
				expect(spyService.called).toBeFalsy();

				offcanvasInstance.close('some result');
				await fixture.whenStable();
				expect(fixture.nativeElement).not.toHaveOffcanvas();
				expect(spyService.called).toBeTruthy();
			});

			it('should open and close offcanvas from a component type', async () => {
				const spyService = fixture.debugElement.injector.get(SpyService);
				const offcanvasInstance = fixture.componentInstance.openCmpt(DestroyableCmpt);
				await fixture.whenStable();
				expect(fixture.nativeElement).toHaveOffcanvas('Some content');
				expect(spyService.called).toBeFalsy();

				offcanvasInstance.close('some result');
				await fixture.whenStable();
				expect(fixture.nativeElement).not.toHaveOffcanvas();
				expect(spyService.called).toBeTruthy();
			});

			it('should inject active offcanvas ref when component is used as content', async () => {
				fixture.componentInstance.openCmpt(WithActiveOffcanvasCmpt);
				await fixture.whenStable();
				expect(fixture.nativeElement).toHaveOffcanvas('Close');

				(<HTMLElement>document.querySelector('button.closeFromInside')).click();
				await fixture.whenStable();
				expect(fixture.nativeElement).not.toHaveOffcanvas();
			});

			it('should expose component used as offcanvas content', async () => {
				const offcanvasInstance = fixture.componentInstance.openCmpt(WithActiveOffcanvasCmpt);
				await fixture.whenStable();
				expect(fixture.nativeElement).toHaveOffcanvas('Close');
				expect(offcanvasInstance.componentInstance instanceof WithActiveOffcanvasCmpt).toBeTruthy();

				offcanvasInstance.close();
				await fixture.whenStable();
				expect(fixture.nativeElement).not.toHaveOffcanvas();
				expect(offcanvasInstance.componentInstance).toBe(undefined);
			});

			it('should open and close offcanvas from inside', async () => {
				fixture.componentInstance.openTplClose();
				await fixture.whenStable();
				expect(fixture.nativeElement).toHaveOffcanvas();

				(<HTMLElement>document.querySelector('button#close')).click();
				await fixture.whenStable();
				expect(fixture.nativeElement).not.toHaveOffcanvas();
			});

			it('should open and dismiss offcanvas from inside', async () => {
				fixture.componentInstance.openTplDismiss().result.catch(NOOP);
				await fixture.whenStable();
				expect(fixture.nativeElement).toHaveOffcanvas();

				(<HTMLElement>document.querySelector('button#dismiss')).click();
				await fixture.whenStable();
				expect(fixture.nativeElement).not.toHaveOffcanvas();
			});

			it('should open and close offcanvas from template implicit context', async () => {
				fixture.componentInstance.openTplImplicitContext();
				await fixture.whenStable();
				expect(fixture.nativeElement).toHaveOffcanvas();

				(<HTMLElement>document.querySelector('button#close')).click();
				await fixture.whenStable();
				expect(fixture.nativeElement).not.toHaveOffcanvas();
			});

			it('should open and dismiss offcanvas from template implicit context', async () => {
				fixture.componentInstance.openTplImplicitContext().result.catch(NOOP);
				await fixture.whenStable();
				expect(fixture.nativeElement).toHaveOffcanvas();

				(<HTMLElement>document.querySelector('button#dismiss')).click();
				await fixture.whenStable();
				expect(fixture.nativeElement).not.toHaveOffcanvas();
			});

			it(`should emit 'closed' on close`, async () => {
				const closedSpy = vi.fn();
				fixture.componentInstance.openTplClose().closed.subscribe(closedSpy);
				await fixture.whenStable();
				expect(fixture.nativeElement).toHaveOffcanvas();

				(<HTMLElement>document.querySelector('button#close')).click();
				await fixture.whenStable();
				expect(fixture.nativeElement).not.toHaveOffcanvas();

				expect(closedSpy).toHaveBeenCalledWith('myResult');
			});

			it(`should emit 'dismissed' on dismissal`, async () => {
				const dismissSpy = vi.fn();
				fixture.componentInstance.openTplDismiss().dismissed.subscribe(dismissSpy);
				await fixture.whenStable();
				expect(fixture.nativeElement).toHaveOffcanvas();

				(<HTMLElement>document.querySelector('button#dismiss')).click();
				await fixture.whenStable();
				expect(fixture.nativeElement).not.toHaveOffcanvas();

				expect(dismissSpy).toHaveBeenCalledWith('myReason');
			});

			it('should resolve result promise on close', async () => {
				let resolvedResult;
				fixture.componentInstance.openTplClose().result.then((result) => (resolvedResult = result));
				await fixture.whenStable();
				expect(fixture.nativeElement).toHaveOffcanvas();

				(<HTMLElement>document.querySelector('button#close')).click();
				await fixture.whenStable();
				expect(fixture.nativeElement).not.toHaveOffcanvas();

				await fixture.whenStable();
				expect(resolvedResult).toBe('myResult');
			});

			it('should reject result promise on dismiss', async () => {
				let rejectReason;
				fixture.componentInstance.openTplDismiss().result.catch((reason) => (rejectReason = reason));
				await fixture.whenStable();
				expect(fixture.nativeElement).toHaveOffcanvas();

				(<HTMLElement>document.querySelector('button#dismiss')).click();
				await fixture.whenStable();
				expect(fixture.nativeElement).not.toHaveOffcanvas();

				await fixture.whenStable();
				expect(rejectReason).toBe('myReason');
			});

			it(`should emit 'shown' and 'hidden' events`, async () => {
				const shownSpy = vi.fn();
				const hiddenSpy = vi.fn();
				const modalRef = fixture.componentInstance.openTplClose();
				modalRef.shown.subscribe(shownSpy);
				modalRef.hidden.subscribe(hiddenSpy);
				await fixture.whenStable();
				expect(fixture.nativeElement).toHaveOffcanvas();
				expect(shownSpy).toHaveBeenCalledWith(undefined);

				(<HTMLElement>document.querySelector('button#close')).click();
				await fixture.whenStable();
				expect(fixture.nativeElement).not.toHaveOffcanvas();
				expect(hiddenSpy).toHaveBeenCalledWith(undefined);
			});

			it('should remove / restore scroll bar when offcanvas is open and closed', async () => {
				expect(window.getComputedStyle(document.body).overflow).not.toBe('hidden');
				const offcanvasRef = fixture.componentInstance.open('bar');
				await fixture.whenStable();
				expect(window.getComputedStyle(document.body).overflow).toBe('hidden');

				offcanvasRef.close('bar result');
				await fixture.whenStable();

				expect(window.getComputedStyle(document.body).overflow).not.toBe('hidden');
			});

			it('should not throw when close called multiple times', async () => {
				const offcanvasInstance = fixture.componentInstance.open('foo');
				await fixture.whenStable();
				expect(fixture.nativeElement).toHaveOffcanvas('foo');

				offcanvasInstance.close('some result');
				await fixture.whenStable();
				expect(fixture.nativeElement).not.toHaveOffcanvas();

				offcanvasInstance.close('some result');
				await fixture.whenStable();
				expect(fixture.nativeElement).not.toHaveOffcanvas();
			});

			it('should dismiss with service dismiss', async () => {
				fixture.componentInstance.open('foo');
				await fixture.whenStable();
				expect(fixture.nativeElement).toHaveOffcanvas('foo');

				fixture.componentInstance.dismiss('dismissArg');
				await fixture.whenStable();
				expect(fixture.nativeElement).not.toHaveOffcanvas();
			});

			it('should dismiss with backdrop mousedown', async () => {
				let rejectReason: any;
				fixture.componentInstance.open('foo').result.catch((reason) => (rejectReason = reason));
				await fixture.whenStable();
				expect(fixture.nativeElement).toHaveOffcanvas('foo');

				document.querySelector('ngb-offcanvas-backdrop')?.dispatchEvent(new Event('mousedown'));
				await fixture.whenStable();

				expect(fixture.nativeElement).not.toHaveOffcanvas();
				await fixture.whenStable();
				expect(rejectReason).toBe(OffcanvasDismissReasons.BACKDROP_CLICK);
			});

			it('should not throw when service dismiss called with no active offcanvas', async () => {
				expect(fixture.nativeElement).not.toHaveOffcanvas();

				fixture.componentInstance.dismiss();
				await fixture.whenStable();
				expect(fixture.nativeElement).not.toHaveOffcanvas();
			});

			it('should not throw when dismiss called multiple times', async () => {
				const modalRef = fixture.componentInstance.open('foo');
				modalRef.result.catch(NOOP);

				await fixture.whenStable();
				expect(fixture.nativeElement).toHaveOffcanvas('foo');

				modalRef.dismiss('some reason');
				await fixture.whenStable();
				expect(fixture.nativeElement).not.toHaveOffcanvas();

				modalRef.dismiss('some reason');
				await fixture.whenStable();
				expect(fixture.nativeElement).not.toHaveOffcanvas();
			});

			it('should indicate if there is an open offcanvas', async () => {
				fixture.componentInstance.open('foo');
				await fixture.whenStable();
				expect(fixture.nativeElement).toHaveOffcanvas('foo');
				expect(fixture.componentInstance.offcanvasService.hasOpenOffcanvas()).toBe(true);

				fixture.componentInstance.dismiss();
				await fixture.whenStable();
				expect(fixture.nativeElement).not.toHaveOffcanvas();
				expect(fixture.componentInstance.offcanvasService.hasOpenOffcanvas()).toBe(false);
			});
		});

		describe('backdrop options', () => {
			it('should have backdrop by default', async () => {
				const offcanvasInstance = fixture.componentInstance.open('foo');
				await fixture.whenStable();

				expect(fixture.nativeElement).toHaveOffcanvas('foo');
				expect(fixture.nativeElement).toHaveOffcanvasBackdrop();

				offcanvasInstance.close('some reason');
				await fixture.whenStable();

				expect(fixture.nativeElement).not.toHaveOffcanvas();
				expect(fixture.nativeElement).not.toHaveOffcanvasBackdrop();
			});

			it('should open and close offcanvas without backdrop', async () => {
				const offcanvasInstance = fixture.componentInstance.open('foo', { backdrop: false });
				await fixture.whenStable();

				expect(fixture.nativeElement).toHaveOffcanvas('foo');
				expect(fixture.nativeElement).not.toHaveOffcanvasBackdrop();

				offcanvasInstance.close('some reason');
				await fixture.whenStable();

				expect(fixture.nativeElement).not.toHaveOffcanvas();
				expect(fixture.nativeElement).not.toHaveOffcanvasBackdrop();
			});

			it('should open and close offcanvas with static backdrop', async () => {
				const offcanvasInstance = fixture.componentInstance.open('foo', { backdrop: 'static' });
				await fixture.whenStable();

				expect(fixture.nativeElement).toHaveOffcanvas('foo');
				expect(fixture.nativeElement).toHaveOffcanvasBackdrop();

				offcanvasInstance.close('some reason');
				await fixture.whenStable();

				expect(fixture.nativeElement).not.toHaveOffcanvas();
				expect(fixture.nativeElement).not.toHaveOffcanvasBackdrop();
			});

			it('should not close with backdrop mousedown if backdrop is static', async () => {
				let rejectReason: any;
				const offcanvasInstance = fixture.componentInstance.open('foo', { backdrop: 'static' });
				offcanvasInstance.result.catch((reason) => (rejectReason = reason));
				await fixture.whenStable();
				expect(fixture.nativeElement).toHaveOffcanvas('foo');

				document.querySelector('ngb-offcanvas-backdrop')?.dispatchEvent(new Event('mousedown'));
				await fixture.whenStable();

				expect(fixture.nativeElement).toHaveOffcanvas();
				expect(fixture.nativeElement).toHaveOffcanvasBackdrop();

				await fixture.whenStable();
				expect(rejectReason).toBeUndefined();

				offcanvasInstance.close('some reason');
				await fixture.whenStable();

				expect(fixture.nativeElement).not.toHaveOffcanvas();
				expect(fixture.nativeElement).not.toHaveOffcanvasBackdrop();
			});

			it('should open and close offcanvas without backdrop from template content', async () => {
				const offcanvasInstance = fixture.componentInstance.openTpl({ backdrop: false });
				await fixture.whenStable();

				expect(fixture.nativeElement).toHaveOffcanvas('Hello, World!');
				expect(fixture.nativeElement).not.toHaveOffcanvasBackdrop();

				offcanvasInstance.close('some reason');
				await fixture.whenStable();

				expect(fixture.nativeElement).not.toHaveOffcanvas();
				expect(fixture.nativeElement).not.toHaveOffcanvasBackdrop();
			});

			it('should not dismiss on clicks that result in detached elements', async () => {
				const offcanvasInstance = fixture.componentInstance.openTplIf({});
				await fixture.whenStable();
				expect(fixture.nativeElement).toHaveOffcanvas();

				(<HTMLElement>document.querySelector('button#if')).click();
				await fixture.whenStable();
				expect(fixture.nativeElement).toHaveOffcanvas();

				offcanvasInstance.close();
				await fixture.whenStable();
				expect(fixture.nativeElement).not.toHaveOffcanvas();
			});
		});

		describe('beforeDismiss options', () => {
			it('should not dismiss when the callback returns false', async () => {
				const offcanvasInstance = fixture.componentInstance.openTplDismiss({
					beforeDismiss: () => {
						return false;
					},
				});
				await fixture.whenStable();
				expect(fixture.nativeElement).toHaveOffcanvas();

				(<HTMLElement>document.querySelector('button#dismiss')).click();
				await fixture.whenStable();
				expect(fixture.nativeElement).toHaveOffcanvas();

				offcanvasInstance.close();
				await fixture.whenStable();
				expect(fixture.nativeElement).not.toHaveOffcanvas();
			});

			it('should dismiss when the callback does not return false', async () => {
				fixture.componentInstance.openTplDismiss(<any>{ beforeDismiss: () => {} });
				await fixture.whenStable();
				expect(fixture.nativeElement).toHaveOffcanvas();

				(<HTMLElement>document.querySelector('button#dismiss')).click();
				await fixture.whenStable();
				expect(fixture.nativeElement).not.toHaveOffcanvas();
			});

			it('should not dismiss when the returned promise is resolved with false', async () => {
				const offcanvasInstance = fixture.componentInstance.openTplDismiss({
					beforeDismiss: () => Promise.resolve(false),
				});
				await fixture.whenStable();
				expect(fixture.nativeElement).toHaveOffcanvas();

				(<HTMLElement>document.querySelector('button#dismiss')).click();
				await fixture.whenStable();
				expect(fixture.nativeElement).toHaveOffcanvas();

				offcanvasInstance.close();
				await fixture.whenStable();
				expect(fixture.nativeElement).not.toHaveOffcanvas();
			});

			it('should not dismiss when the returned promise is rejected', async () => {
				const offcanvasInstance = fixture.componentInstance.openTplDismiss({
					beforeDismiss: () => Promise.reject('error'),
				});
				await fixture.whenStable();
				expect(fixture.nativeElement).toHaveOffcanvas();

				(<HTMLElement>document.querySelector('button#dismiss')).click();
				await fixture.whenStable();
				expect(fixture.nativeElement).toHaveOffcanvas();

				offcanvasInstance.close();
				await fixture.whenStable();
				expect(fixture.nativeElement).not.toHaveOffcanvas();
			});

			it('should dismiss when the returned promise is not resolved with false', async () => {
				fixture.componentInstance.openTplDismiss(<any>{ beforeDismiss: () => Promise.resolve() });
				await fixture.whenStable();
				expect(fixture.nativeElement).toHaveOffcanvas();

				(<HTMLElement>document.querySelector('button#dismiss')).click();
				await fixture.whenStable();
				expect(fixture.nativeElement).not.toHaveOffcanvas();
			});

			it('should dismiss when the callback is not defined', async () => {
				fixture.componentInstance.openTplDismiss({});
				await fixture.whenStable();
				expect(fixture.nativeElement).toHaveOffcanvas();

				(<HTMLElement>document.querySelector('button#dismiss')).click();
				await fixture.whenStable();
				expect(fixture.nativeElement).not.toHaveOffcanvas();
			});
		});

		describe('container options', () => {
			it('should attach offcanvas and backdrop elements to the specified container', async () => {
				const offcanvasInstance = fixture.componentInstance.open('foo', { container: '#testContainer' });
				await fixture.whenStable();
				expect(fixture.nativeElement).toHaveOffcanvas('foo', '#testContainer');
				expect(fixture.nativeElement).toHaveOffcanvasBackdrop('#testContainer');

				offcanvasInstance.close();
				await fixture.whenStable();
				expect(fixture.nativeElement).not.toHaveOffcanvas();
				expect(fixture.nativeElement).not.toHaveOffcanvasBackdrop();
			});

			it('should attach offcanvas and backdrop elements to the specified container DOM element', async () => {
				const containerDomEl = document.querySelector('div#testContainer');
				const offcanvasInstance = fixture.componentInstance.open('foo', { container: containerDomEl as HTMLElement });
				await fixture.whenStable();
				expect(fixture.nativeElement).toHaveOffcanvas('foo', '#testContainer');
				expect(fixture.nativeElement).toHaveOffcanvasBackdrop('#testContainer');

				offcanvasInstance.close();
				await fixture.whenStable();
				expect(fixture.nativeElement).not.toHaveOffcanvas();
				expect(fixture.nativeElement).not.toHaveOffcanvasBackdrop();
			});

			it("should throw when the specified container element doesn't exist", async () => {
				const brokenSelector = '#notInTheDOM';
				expect(() => {
					fixture.componentInstance.open('foo', { container: brokenSelector });
				}).toThrow(`The specified offcanvas container "${brokenSelector}" was not found in the DOM.`);
			});
		});

		describe('position options', () => {
			it('should render offcanvas with specified position', async () => {
				const offcanvasInstance = fixture.componentInstance.open('foo', { position: 'end' });
				await fixture.whenStable();
				expect(fixture.nativeElement).toHaveOffcanvas('foo');
				expect(document.querySelector('ngb-offcanvas-panel')).toHaveCssClass('offcanvas-end');

				offcanvasInstance.close();
				await fixture.whenStable();
				expect(fixture.nativeElement).not.toHaveOffcanvas();
			});
		});

		describe('panel custom class options', () => {
			it('should render offcanvas with the correct panel custom classes', async () => {
				const offcanvasInstance = fixture.componentInstance.open('foo', { panelClass: 'bar' });
				await fixture.whenStable();
				expect(fixture.nativeElement).toHaveOffcanvas('foo');
				expect(document.querySelector('ngb-offcanvas-panel')).toHaveCssClass('bar');

				offcanvasInstance.close();
				await fixture.whenStable();
				expect(fixture.nativeElement).not.toHaveOffcanvas();
			});
		});

		describe('backdrop custom class options', () => {
			it('should render offcanvas with the correct backdrop custom classes', async () => {
				const offcanvasInstance = fixture.componentInstance.open('foo', { backdropClass: 'my-fancy-backdrop' });
				await fixture.whenStable();
				expect(fixture.nativeElement).toHaveOffcanvas('foo');
				expect(document.querySelector('ngb-offcanvas-backdrop')).toHaveCssClass('my-fancy-backdrop');

				offcanvasInstance.close();
				await fixture.whenStable();
				expect(fixture.nativeElement).not.toHaveOffcanvas();
			});
		});

		describe('custom injector option', () => {
			it('should render offcanvas with a custom injector', async () => {
				const customInjector = Injector.create({
					providers: [{ provide: CustomSpyService, useClass: CustomSpyService, deps: [] }],
				});
				const offcanvasInstance = fixture.componentInstance.openCmpt(CustomInjectorCmpt, { injector: customInjector });
				await fixture.whenStable();
				expect(fixture.nativeElement).toHaveOffcanvas('Some content');

				offcanvasInstance.close();
				await fixture.whenStable();
				expect(fixture.nativeElement).not.toHaveOffcanvas();
			});
		});

		describe('focus management', () => {
			describe('initial focus', () => {
				it('should focus the proper specified element when [ngbAutofocus] is used', async () => {
					await fixture.whenStable();
					const offcanvasInstance = fixture.componentInstance.openCmpt(WithAutofocusOffcanvasCmpt);
					await fixture.whenStable();

					expect(document.activeElement).toBe(document.querySelector('button.withNgbAutofocus'));
					offcanvasInstance.close();
				});

				it('should focus the first focusable element when [ngbAutofocus] is not used', async () => {
					await fixture.whenStable();
					const offcanvasInstance = fixture.componentInstance.openCmpt(WithFirstFocusableOffcanvasCmpt);
					await fixture.whenStable();

					expect(document.activeElement).toBe(document.querySelector('button.firstFocusable'));
					offcanvasInstance.close();
					await fixture.whenStable();
				});

				it('should skip element with tabindex=-1 when finding the first focusable element', async () => {
					await fixture.whenStable();
					const offcanvasInstance = fixture.componentInstance.openCmpt(WithSkipTabindexFirstFocusableOffcanvasCmpt);
					await fixture.whenStable();

					expect(document.activeElement).toBe(document.querySelector('button.other'));
					offcanvasInstance.close();
					await fixture.whenStable();
				});

				it('should focus offcanvas panel as a default fallback option', async () => {
					await fixture.whenStable();
					const offcanvasInstance = fixture.componentInstance.open('content');
					await fixture.whenStable();

					expect(document.activeElement).toBe(document.querySelector('ngb-offcanvas-panel'));
					offcanvasInstance.close();
					await fixture.whenStable();
				});
			});
		});

		describe('scrollable document', () => {
			it('should keep the document scrollable', async () => {
				const offcanvasInstance = fixture.componentInstance.open('foo', { scroll: true });
				await fixture.whenStable();
				expect(fixture.nativeElement).toHaveOffcanvas('foo');
				expect(window.getComputedStyle(document.body).overflow).not.toBe('hidden');

				offcanvasInstance.close();
				await fixture.whenStable();
				expect(fixture.nativeElement).not.toHaveOffcanvas();
			});
		});

		describe('accessibility', () => {
			it('should support aria-labelledby', async () => {
				const id = 'aria-labelledby-id';

				const offcanvasInstance = fixture.componentInstance.open('foo', { ariaLabelledBy: id });
				await fixture.whenStable();

				const modalElement = <HTMLElement>document.querySelector('ngb-offcanvas-panel');
				expect(modalElement.getAttribute('aria-labelledby')).toBe(id);

				offcanvasInstance.close('some result');
				await fixture.whenStable();
				expect(fixture.nativeElement).not.toHaveOffcanvas();
			});

			it('should support aria-describedby', async () => {
				const id = 'aria-describedby-id';

				const offcanvasInstance = fixture.componentInstance.open('foo', { ariaDescribedBy: id });
				await fixture.whenStable();

				const modalElement = <HTMLElement>document.querySelector('ngb-offcanvas-panel');
				expect(modalElement.getAttribute('aria-describedby')).toBe(id);

				offcanvasInstance.close('some result');
				await fixture.whenStable();
				expect(fixture.nativeElement).not.toHaveOffcanvas();
			});

			it('should have aria-modal attribute', async () => {
				const a11yFixture = TestBed.createComponent(TestA11yComponent);
				const offcanvasInstance = a11yFixture.componentInstance.open();

				const modalElement = <HTMLElement>document.querySelector('ngb-offcanvas-panel');
				expect(modalElement.getAttribute('aria-modal')).toBe('true');

				offcanvasInstance.close();
				await fixture.whenStable();
				expect(fixture.nativeElement).not.toHaveOffcanvas();
			});

			// unlike modal, we don't set aria-hidden on siblings: Bootstrap doesn't seem to do it. If we do, then we have to
			// be careful about the backdrop option: if no backdrop, then the siblings are not really hidden, and we can still
			// interact with them
		});
	});

	describe('custom global configuration', () => {
		beforeEach(() => {
			TestBed.configureTestingModule({
				providers: [{ provide: NgbOffcanvasConfig, useValue: { position: 'end' } }],
			});
			fixture = TestBed.createComponent(TestComponent);
		});

		it('should accept global configuration under the NgbOffcanvasConfig token', async () => {
			const offcanvasInstance = fixture.componentInstance.open('foo');
			await fixture.whenStable();

			expect(fixture.nativeElement).toHaveOffcanvas('foo');
			expect(document.querySelector('ngb-offcanvas-panel')).toHaveCssClass('offcanvas-end');
			expect(document.querySelector('ngb-offcanvas-panel')).not.toHaveCssClass('offcanvas-start');

			offcanvasInstance.close('some reason');
			await fixture.whenStable();
		});

		it('should override global configuration with local options', async () => {
			const offcanvasInstance = fixture.componentInstance.open('foo', { position: 'top' });
			await fixture.whenStable();

			expect(fixture.nativeElement).toHaveOffcanvas('foo');
			expect(document.querySelector('ngb-offcanvas-panel')).toHaveCssClass('offcanvas-top');
			expect(document.querySelector('ngb-offcanvas-panel')).not.toHaveCssClass('offcanvas-end');
			expect(document.querySelector('ngb-offcanvas-panel')).not.toHaveCssClass('offcanvas-start');

			offcanvasInstance.close('some reason');
			await fixture.whenStable();
		});
	});

	if (isBrowserVisible('ngb-offcanvas animations')) {
		describe('ngb-offcanvas animations', () => {
			@Component({
				template: `
					<ng-template #content let-close="close" let-dismiss="dismiss">
						<div id="inside-div">Bla bla</div>
						<button class="btn btn-primary" id="close" (click)="close('myResult')">Close me</button>
					</ng-template>
				`,
			})
			class TestAnimationComponent {
				@ViewChild('content', { static: true })
				content;

				private readonly offcanvasService = inject(NgbOffcanvas);

				open(backdrop = true, keyboard = true) {
					return this.offcanvasService.open(this.content, { backdrop, keyboard });
				}
			}

			beforeEach(() => {
				TestBed.configureTestingModule({
					providers: [{ provide: NgbConfig, useClass: NgbConfigAnimation }],
				});
			});

			afterEach(() => document.body.classList.remove('ngb-reduce-motion'));

			[true, false].forEach((reduceMotion) => {
				it(`should run transform transition when opening/closing offcanvas (force-reduced-motion = ${reduceMotion})`, async () => {
					if (reduceMotion) {
						document.body.classList.add('ngb-reduce-motion');
					}
					const component = TestBed.createComponent(TestAnimationComponent);
					await component.whenStable();

					const offcanvasRef = component.componentInstance.open();
					const shownPromise = firstValueFrom(offcanvasRef.shown);
					await component.whenStable();

					// Ensure that everything works fine after a reflow
					document.body.getBoundingClientRect();

					let offcanvasEl: HTMLElement | null = null;

					offcanvasEl = document.querySelector('ngb-offcanvas-panel') as HTMLElement;
					const closeButton = document.querySelector('button#close') as HTMLButtonElement;

					expect(offcanvasEl.classList.contains('show')).toBe(true);
					expect(offcanvasEl.classList.contains('showing')).toBe(!reduceMotion);

					await shownPromise;

					await component.whenStable();

					expect(offcanvasEl.classList.contains('showing')).toBe(false);
					expect(offcanvasEl.classList.contains('show')).toBe(true);

					const hiddenPromise = firstValueFrom(offcanvasRef.hidden);
					closeButton.click();
					if (!reduceMotion) {
						expect(offcanvasEl.classList.contains('hiding')).toBe(true);
					}
					expect(offcanvasEl.classList.contains('show')).toBe(!reduceMotion);
					await hiddenPromise;

					expect(document.querySelector('ngb-offcanvas-panel')).toBeNull();
				});
			});

			it(`should start hiding even if the show animation isn't finished yet`, async () => {
				const component = TestBed.createComponent(TestAnimationComponent);
				await component.whenStable();

				const offcanvasRef = component.componentInstance.open();

				// Ensure that everything works fine after a reflow
				document.body.getBoundingClientRect();

				let offcanvasEl: HTMLElement | null = null;

				offcanvasRef.hidden.subscribe(() => {
					offcanvasEl = document.querySelector('ngb-offcanvas-panel');
					expect(offcanvasEl).toBeNull();
				});

				await component.whenStable();
				offcanvasEl = document.querySelector('ngb-offcanvas-panel')!;
				expect(offcanvasEl.classList.contains('show')).toBe(true);
				expect(offcanvasEl.classList.contains('showing')).toBe(true);

				await firstValueFrom(offcanvasRef.shown);
				await component.whenStable();

				expect(offcanvasEl.classList.contains('show')).toBe(true);
				expect(offcanvasEl.classList.contains('showing')).toBe(false);

				const closeButton = document.querySelector('button#close') as HTMLButtonElement;
				closeButton.click();

				expect(offcanvasEl.classList.contains('show')).toBe(true);
				expect(offcanvasEl.classList.contains('showing')).toBe(false);
				expect(offcanvasEl.classList.contains('hiding')).toBe(true);

				await firstValueFrom(offcanvasRef.hidden);

				expect(document.querySelector('ngb-offcanvas-panel')).toBeNull();
			});
		});
	}

	describe('lazy loading', () => {
		@Component({
			template: '<router-outlet />',
			imports: [RouterOutlet],
		})
		class AppComponent {}

		beforeEach(() => {
			TestBed.configureTestingModule({
				imports: [
					AppComponent,
					RouterModule.forRoot([
						{
							path: 'lazy',
							loadComponent: () => import('../test/offcanvas-lazy-component'),
						},
					]),
				],
			});
		});

		it('should use correct injectors', async () => {
			const router = TestBed.inject(Router);

			const fixture = TestBed.createComponent(AppComponent);
			await fixture.whenStable();

			// opening by navigating
			router.navigate(['lazy']);
			await fixture.whenStable();
			expect(fixture.nativeElement).toHaveOffcanvas('lazy offcanvas');

			// closing by navigating away
			router.navigate(['']);
			await fixture.whenStable();
		});
	});
});

@Component({
	selector: 'custom-injector-cmpt',
	template: 'Some content',
})
export class CustomInjectorCmpt implements OnDestroy {
	private readonly _spyService = inject(CustomSpyService);

	ngOnDestroy(): void {
		this._spyService.called = true;
	}
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
	selector: 'offcanvas-content-cmpt',
	template: '<button class="closeFromInside" (click)="close()">Close</button>',
})
export class WithActiveOffcanvasCmpt {
	readonly activeModal = inject(NgbActiveOffcanvas);

	close() {
		this.activeModal.close('from inside');
	}
}

@Component({
	selector: 'offcanvas-autofocus-cmpt',
	template: `<button class="withNgbAutofocus" ngbAutofocus>Click Me</button>`,
})
export class WithAutofocusOffcanvasCmpt {}

@Component({
	selector: 'offcanvas-firstfocusable-cmpt',
	template: `
		<button class="firstFocusable close">Close</button>
		<button class="other">Other button</button>
	`,
})
export class WithFirstFocusableOffcanvasCmpt {}

@Component({
	selector: 'offcanvas-skip-tabindex-firstfocusable-cmpt',
	template: `
		<button tabindex="-1" class="firstFocusable close">Close</button>
		<button class="other">Other button</button>
	`,
})
export class WithSkipTabindexFirstFocusableOffcanvasCmpt {}

@Component({
	selector: 'test-cmpt',
	imports: [DestroyableCmpt],
	template: `
		<div id="testContainer"></div>
		<ng-template #content>Hello, {{ name() }}!</ng-template>
		<ng-template #destroyableContent><destroyable-cmpt /></ng-template>
		<ng-template #contentWithClose let-close="close">
			<button id="close" (click)="close('myResult')">Close me</button>
		</ng-template>
		<ng-template #contentWithDismiss let-dismiss="dismiss">
			<button id="dismiss" (click)="dismiss('myReason')">Dismiss me</button>
		</ng-template>
		<ng-template #contentWithImplicitContext let-offcanvas>
			<button id="close" (click)="offcanvas.close('myResult')">Close me</button>
			<button id="dismiss" (click)="offcanvas.dismiss('myReason')">Dismiss me</button>
		</ng-template>
		<ng-template #contentWithIf>
			@if (show()) {
				<button id="if" (click)="show.set(false)">Click me</button>
			}
		</ng-template>
		<button id="open" (click)="open('from button')">Open</button>
		<div id="open-no-focus" (click)="open('from non focusable element')">Open</div>
	`,
})
class TestComponent {
	readonly name = signal('World');
	openedOffcanvas?: NgbOffcanvasRef;
	readonly show = signal(true);
	@ViewChild('content', { static: true })
	tplContent;
	@ViewChild('destroyableContent', { static: true })
	tplDestroyableContent;
	@ViewChild('contentWithClose', { static: true })
	tplContentWithClose;
	@ViewChild('contentWithDismiss', { static: true })
	tplContentWithDismiss;
	@ViewChild('contentWithImplicitContext', { static: true })
	tplContentWithImplicitContext;
	@ViewChild('contentWithIf', { static: true })
	tplContentWithIf;

	readonly offcanvasService = inject(NgbOffcanvas);

	open(content: string, options?: NgbOffcanvasOptions) {
		this.openedOffcanvas = this.offcanvasService.open(content, options);
		return this.openedOffcanvas;
	}
	close() {
		if (this.openedOffcanvas) {
			this.openedOffcanvas.close('ok');
		}
	}
	dismiss(reason?: any) {
		this.offcanvasService.dismiss(reason);
	}
	openTpl(options?: NgbOffcanvasOptions) {
		return this.offcanvasService.open(this.tplContent, options);
	}
	openCmpt(cmptType: any, options?: NgbOffcanvasOptions) {
		return this.offcanvasService.open(cmptType, options);
	}
	openDestroyableTpl(options?: NgbOffcanvasOptions) {
		return this.offcanvasService.open(this.tplDestroyableContent, options);
	}
	openTplClose(options?: NgbOffcanvasOptions) {
		return this.offcanvasService.open(this.tplContentWithClose, options);
	}
	openTplDismiss(options?: NgbOffcanvasOptions) {
		return this.offcanvasService.open(this.tplContentWithDismiss, options);
	}
	openTplImplicitContext(options?: NgbOffcanvasOptions) {
		return this.offcanvasService.open(this.tplContentWithImplicitContext, options);
	}
	openTplIf(options?: NgbOffcanvasOptions) {
		return this.offcanvasService.open(this.tplContentWithIf, options);
	}
	get activeInstance() {
		return this.offcanvasService.activeInstance;
	}
}

@Component({
	selector: 'test-a11y-cmpt',
	template: `
		<div class="to-hide to-restore-true" aria-hidden="true">
			<div class="not-to-hide"></div>
		</div>
		<div class="not-to-hide">
			<div class="to-hide">
				<div class="not-to-hide"></div>
			</div>

			<div class="not-to-hide" id="container"></div>

			<div class="to-hide">
				<div class="not-to-hide"></div>
			</div>
		</div>
		<div class="to-hide to-restore-false" aria-hidden="false">
			<div class="not-to-hide"></div>
		</div>
	`,
})
class TestA11yComponent {
	private readonly offcanvasService = inject(NgbOffcanvas);

	open(options?: NgbOffcanvasOptions) {
		return this.offcanvasService.open('foo', options);
	}
}
