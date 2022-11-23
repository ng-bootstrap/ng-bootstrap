import { Component, Injectable, Injector, OnDestroy, ViewChild } from '@angular/core';
import { NgIf } from '@angular/common';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NgbOffcanvasConfig, NgbOffcanvasOptions } from './offcanvas-config';
import { NgbActiveOffcanvas, NgbOffcanvas, NgbOffcanvasRef, OffcanvasDismissReasons } from './offcanvas.module';
import { isBrowserVisible } from '../test/common';
import { NgbConfig } from '..';
import { NgbConfigAnimation } from '../test/ngb-config-animation';
import createSpy = jasmine.createSpy;

const NOOP = () => {};

@Injectable()
class SpyService {
	called = false;
}

@Injectable()
class CustomSpyService {
	called = false;
}

describe('ngb-offcanvas', () => {
	let fixture: ComponentFixture<TestComponent>;

	beforeEach(() => {
		jasmine.addMatchers({
			toHaveOffcanvas: function () {
				return {
					compare: function (actual, content?, selector?) {
						const offcanvasContent = document.querySelector(selector || 'body').querySelector('.offcanvas');
						let pass = true;
						let errMsg;

						if (!content) {
							pass = !!offcanvasContent;
							errMsg = 'offcanvas open but found none';
						} else {
							pass = !!offcanvasContent && offcanvasContent.textContent.trim() === content;
							errMsg = `offcanvas open with content ${content} but found none`;
						}

						return { pass: pass, message: `Expected ${actual.outerHTML} to have ${errMsg}` };
					},
					negativeCompare: function (actual, selector?) {
						const openOffcanvas = document.querySelector(selector || 'body').querySelector('ngb-offcanvas-panel');

						return {
							pass: !openOffcanvas,
							message: `Expected ${actual.outerHTML} not to have an offcanvas open but found one`,
						};
					},
				};
			},
		});

		jasmine.addMatchers({
			toHaveOffcanvasBackdrop: function () {
				return {
					compare: function (actual, selector?) {
						const backdrop = document.querySelector(selector || 'body').querySelector('ngb-offcanvas-backdrop');
						return { pass: !!backdrop, message: `Expected ${actual.outerHTML} to have one backdrop element` };
					},
					negativeCompare: function (actual, selector?) {
						const backdrop = document.querySelector(selector || 'body').querySelector('ngb-offcanvas-backdrop');
						return { pass: !backdrop, message: `Expected ${actual.outerHTML} not to have a backdrop element` };
					},
				};
			},
		});
	});

	afterEach(() => {
		// detect left-over modals and report errors when found

		const remainingOffcanvasPanels = document.querySelectorAll('ngb-offcanvas-panel');
		if (remainingOffcanvasPanels.length) {
			fail(`${remainingOffcanvasPanels.length} offcanvas panels were left in the DOM.`);
		}

		const remainingOffcanvasBackdrops = document.querySelectorAll('ngb-offcanvas-backdrop');
		if (remainingOffcanvasBackdrops.length) {
			fail(`${remainingOffcanvasBackdrops.length} offcanvas backdrops were left in the DOM.`);
		}
	});

	describe('default configuration', () => {
		beforeEach(() => {
			TestBed.configureTestingModule({ providers: [SpyService] });
			fixture = TestBed.createComponent(TestComponent);
		});

		describe('basic functionality', () => {
			it('should open and close offcanvas with default options', () => {
				const offcanvasInstance = fixture.componentInstance.open('foo');
				fixture.detectChanges();
				expect(fixture.nativeElement).toHaveOffcanvas('foo');

				const offcanvasEl = document.querySelector('ngb-offcanvas-panel') as HTMLElement;
				expect(offcanvasEl).not.toHaveClass('fade');
				expect(offcanvasEl).toHaveClass('show');

				offcanvasInstance.close('some result');
				fixture.detectChanges();
				expect(fixture.nativeElement).not.toHaveOffcanvas();
			});

			it('should open and close offcanvas from a TemplateRef content', () => {
				const offcanvasInstance = fixture.componentInstance.openTpl();
				fixture.detectChanges();
				expect(fixture.nativeElement).toHaveOffcanvas('Hello, World!');

				offcanvasInstance.close('some result');
				fixture.detectChanges();
				expect(fixture.nativeElement).not.toHaveOffcanvas();
			});

			it('should properly destroy TemplateRef content', () => {
				const spyService = fixture.debugElement.injector.get(SpyService);
				const offcanvasInstance = fixture.componentInstance.openDestroyableTpl();
				fixture.detectChanges();
				expect(fixture.nativeElement).toHaveOffcanvas('Some content');
				expect(spyService.called).toBeFalsy();

				offcanvasInstance.close('some result');
				fixture.detectChanges();
				expect(fixture.nativeElement).not.toHaveOffcanvas();
				expect(spyService.called).toBeTruthy();
			});

			it('should open and close offcanvas from a component type', () => {
				const spyService = fixture.debugElement.injector.get(SpyService);
				const offcanvasInstance = fixture.componentInstance.openCmpt(DestroyableCmpt);
				fixture.detectChanges();
				expect(fixture.nativeElement).toHaveOffcanvas('Some content');
				expect(spyService.called).toBeFalsy();

				offcanvasInstance.close('some result');
				fixture.detectChanges();
				expect(fixture.nativeElement).not.toHaveOffcanvas();
				expect(spyService.called).toBeTruthy();
			});

			it('should inject active offcanvas ref when component is used as content', () => {
				fixture.componentInstance.openCmpt(WithActiveOffcanvasCmpt);
				fixture.detectChanges();
				expect(fixture.nativeElement).toHaveOffcanvas('Close');

				(<HTMLElement>document.querySelector('button.closeFromInside')).click();
				fixture.detectChanges();
				expect(fixture.nativeElement).not.toHaveOffcanvas();
			});

			it('should expose component used as offcanvas content', () => {
				const offcanvasInstance = fixture.componentInstance.openCmpt(WithActiveOffcanvasCmpt);
				fixture.detectChanges();
				expect(fixture.nativeElement).toHaveOffcanvas('Close');
				expect(offcanvasInstance.componentInstance instanceof WithActiveOffcanvasCmpt).toBeTruthy();

				offcanvasInstance.close();
				fixture.detectChanges();
				expect(fixture.nativeElement).not.toHaveOffcanvas();
				expect(offcanvasInstance.componentInstance).toBe(undefined);
			});

			it('should open and close offcanvas from inside', () => {
				fixture.componentInstance.openTplClose();
				fixture.detectChanges();
				expect(fixture.nativeElement).toHaveOffcanvas();

				(<HTMLElement>document.querySelector('button#close')).click();
				fixture.detectChanges();
				expect(fixture.nativeElement).not.toHaveOffcanvas();
			});

			it('should open and dismiss offcanvas from inside', () => {
				fixture.componentInstance.openTplDismiss().result.catch(NOOP);
				fixture.detectChanges();
				expect(fixture.nativeElement).toHaveOffcanvas();

				(<HTMLElement>document.querySelector('button#dismiss')).click();
				fixture.detectChanges();
				expect(fixture.nativeElement).not.toHaveOffcanvas();
			});

			it('should open and close offcanvas from template implicit context', () => {
				fixture.componentInstance.openTplImplicitContext();
				fixture.detectChanges();
				expect(fixture.nativeElement).toHaveOffcanvas();

				(<HTMLElement>document.querySelector('button#close')).click();
				fixture.detectChanges();
				expect(fixture.nativeElement).not.toHaveOffcanvas();
			});

			it('should open and dismiss offcanvas from template implicit context', () => {
				fixture.componentInstance.openTplImplicitContext().result.catch(NOOP);
				fixture.detectChanges();
				expect(fixture.nativeElement).toHaveOffcanvas();

				(<HTMLElement>document.querySelector('button#dismiss')).click();
				fixture.detectChanges();
				expect(fixture.nativeElement).not.toHaveOffcanvas();
			});

			it(`should emit 'closed' on close`, () => {
				const closedSpy = createSpy();
				fixture.componentInstance.openTplClose().closed.subscribe(closedSpy);
				fixture.detectChanges();
				expect(fixture.nativeElement).toHaveOffcanvas();

				(<HTMLElement>document.querySelector('button#close')).click();
				fixture.detectChanges();
				expect(fixture.nativeElement).not.toHaveOffcanvas();

				expect(closedSpy).toHaveBeenCalledWith('myResult');
			});

			it(`should emit 'dismissed' on dismissal`, () => {
				const dismissSpy = createSpy();
				fixture.componentInstance.openTplDismiss().dismissed.subscribe(dismissSpy);
				fixture.detectChanges();
				expect(fixture.nativeElement).toHaveOffcanvas();

				(<HTMLElement>document.querySelector('button#dismiss')).click();
				fixture.detectChanges();
				expect(fixture.nativeElement).not.toHaveOffcanvas();

				expect(dismissSpy).toHaveBeenCalledWith('myReason');
			});

			it('should resolve result promise on close', async () => {
				let resolvedResult;
				fixture.componentInstance.openTplClose().result.then((result) => (resolvedResult = result));
				fixture.detectChanges();
				expect(fixture.nativeElement).toHaveOffcanvas();

				(<HTMLElement>document.querySelector('button#close')).click();
				fixture.detectChanges();
				expect(fixture.nativeElement).not.toHaveOffcanvas();

				await fixture.whenStable();
				expect(resolvedResult).toBe('myResult');
			});

			it('should reject result promise on dismiss', async () => {
				let rejectReason;
				fixture.componentInstance.openTplDismiss().result.catch((reason) => (rejectReason = reason));
				fixture.detectChanges();
				expect(fixture.nativeElement).toHaveOffcanvas();

				(<HTMLElement>document.querySelector('button#dismiss')).click();
				fixture.detectChanges();
				expect(fixture.nativeElement).not.toHaveOffcanvas();

				await fixture.whenStable();
				expect(rejectReason).toBe('myReason');
			});

			it(`should emit 'shown' and 'hidden' events`, () => {
				const shownSpy = createSpy();
				const hiddenSpy = createSpy();
				const modalRef = fixture.componentInstance.openTplClose();
				modalRef.shown.subscribe(shownSpy);
				modalRef.hidden.subscribe(hiddenSpy);
				fixture.detectChanges();
				expect(fixture.nativeElement).toHaveOffcanvas();
				expect(shownSpy).toHaveBeenCalledWith(undefined);

				(<HTMLElement>document.querySelector('button#close')).click();
				fixture.detectChanges();
				expect(fixture.nativeElement).not.toHaveOffcanvas();
				expect(hiddenSpy).toHaveBeenCalledWith(undefined);
			});

			it('should remove / restore scroll bar when offcanvas is open and closed', fakeAsync(() => {
				expect(window.getComputedStyle(document.body).overflow).not.toBe('hidden');
				const offcanvasRef = fixture.componentInstance.open('bar');
				fixture.detectChanges();
				expect(window.getComputedStyle(document.body).overflow).toBe('hidden');

				offcanvasRef.close('bar result');
				fixture.detectChanges();
				tick();

				expect(window.getComputedStyle(document.body).overflow).not.toBe('hidden');
			}));

			it('should not throw when close called multiple times', () => {
				const offcanvasInstance = fixture.componentInstance.open('foo');
				fixture.detectChanges();
				expect(fixture.nativeElement).toHaveOffcanvas('foo');

				offcanvasInstance.close('some result');
				fixture.detectChanges();
				expect(fixture.nativeElement).not.toHaveOffcanvas();

				offcanvasInstance.close('some result');
				fixture.detectChanges();
				expect(fixture.nativeElement).not.toHaveOffcanvas();
			});

			it('should dismiss with service dismiss', () => {
				fixture.componentInstance.open('foo');
				fixture.detectChanges();
				expect(fixture.nativeElement).toHaveOffcanvas('foo');

				fixture.componentInstance.dismiss('dismissArg');
				fixture.detectChanges();
				expect(fixture.nativeElement).not.toHaveOffcanvas();
			});

			it('should dismiss with backdrop mousedown', async () => {
				let rejectReason: any;
				fixture.componentInstance.open('foo').result.catch((reason) => (rejectReason = reason));
				fixture.detectChanges();
				expect(fixture.nativeElement).toHaveOffcanvas('foo');

				document.querySelector('ngb-offcanvas-backdrop')?.dispatchEvent(new Event('mousedown'));
				fixture.detectChanges();

				expect(fixture.nativeElement).not.toHaveOffcanvas();
				await fixture.whenStable();
				expect(rejectReason).toBe(OffcanvasDismissReasons.BACKDROP_CLICK);
			});

			it('should not throw when service dismiss called with no active offcanvas', () => {
				expect(fixture.nativeElement).not.toHaveOffcanvas();

				fixture.componentInstance.dismiss();
				fixture.detectChanges();
				expect(fixture.nativeElement).not.toHaveOffcanvas();
			});

			it('should not throw when dismiss called multiple times', () => {
				const modalRef = fixture.componentInstance.open('foo');
				modalRef.result.catch(NOOP);

				fixture.detectChanges();
				expect(fixture.nativeElement).toHaveOffcanvas('foo');

				modalRef.dismiss('some reason');
				fixture.detectChanges();
				expect(fixture.nativeElement).not.toHaveOffcanvas();

				modalRef.dismiss('some reason');
				fixture.detectChanges();
				expect(fixture.nativeElement).not.toHaveOffcanvas();
			});

			it('should indicate if there is an open offcanvas', fakeAsync(() => {
				fixture.componentInstance.open('foo');
				fixture.detectChanges();
				expect(fixture.nativeElement).toHaveOffcanvas('foo');
				expect(fixture.componentInstance.offcanvasService.hasOpenOffcanvas()).toBeTrue();

				fixture.componentInstance.dismiss();
				fixture.detectChanges();
				tick();
				expect(fixture.nativeElement).not.toHaveOffcanvas();
				expect(fixture.componentInstance.offcanvasService.hasOpenOffcanvas()).toBeFalse();
			}));
		});

		describe('backdrop options', () => {
			it('should have backdrop by default', () => {
				const offcanvasInstance = fixture.componentInstance.open('foo');
				fixture.detectChanges();

				expect(fixture.nativeElement).toHaveOffcanvas('foo');
				expect(fixture.nativeElement).toHaveOffcanvasBackdrop();

				offcanvasInstance.close('some reason');
				fixture.detectChanges();

				expect(fixture.nativeElement).not.toHaveOffcanvas();
				expect(fixture.nativeElement).not.toHaveOffcanvasBackdrop();
			});

			it('should open and close offcanvas without backdrop', () => {
				const offcanvasInstance = fixture.componentInstance.open('foo', { backdrop: false });
				fixture.detectChanges();

				expect(fixture.nativeElement).toHaveOffcanvas('foo');
				expect(fixture.nativeElement).not.toHaveOffcanvasBackdrop();

				offcanvasInstance.close('some reason');
				fixture.detectChanges();

				expect(fixture.nativeElement).not.toHaveOffcanvas();
				expect(fixture.nativeElement).not.toHaveOffcanvasBackdrop();
			});

			it('should open and close offcanvas with static backdrop', () => {
				const offcanvasInstance = fixture.componentInstance.open('foo', { backdrop: 'static' });
				fixture.detectChanges();

				expect(fixture.nativeElement).toHaveOffcanvas('foo');
				expect(fixture.nativeElement).toHaveOffcanvasBackdrop();

				offcanvasInstance.close('some reason');
				fixture.detectChanges();

				expect(fixture.nativeElement).not.toHaveOffcanvas();
				expect(fixture.nativeElement).not.toHaveOffcanvasBackdrop();
			});

			it('should not close with backdrop mousedown if backdrop is static', async () => {
				let rejectReason: any;
				const offcanvasInstance = fixture.componentInstance.open('foo', { backdrop: 'static' });
				offcanvasInstance.result.catch((reason) => (rejectReason = reason));
				fixture.detectChanges();
				expect(fixture.nativeElement).toHaveOffcanvas('foo');

				document.querySelector('ngb-offcanvas-backdrop')?.dispatchEvent(new Event('mousedown'));
				fixture.detectChanges();

				expect(fixture.nativeElement).toHaveOffcanvas();
				expect(fixture.nativeElement).toHaveOffcanvasBackdrop();

				await fixture.whenStable();
				expect(rejectReason).toBeUndefined();

				offcanvasInstance.close('some reason');
				fixture.detectChanges();

				expect(fixture.nativeElement).not.toHaveOffcanvas();
				expect(fixture.nativeElement).not.toHaveOffcanvasBackdrop();
			});

			it('should open and close offcanvas without backdrop from template content', () => {
				const offcanvasInstance = fixture.componentInstance.openTpl({ backdrop: false });
				fixture.detectChanges();

				expect(fixture.nativeElement).toHaveOffcanvas('Hello, World!');
				expect(fixture.nativeElement).not.toHaveOffcanvasBackdrop();

				offcanvasInstance.close('some reason');
				fixture.detectChanges();

				expect(fixture.nativeElement).not.toHaveOffcanvas();
				expect(fixture.nativeElement).not.toHaveOffcanvasBackdrop();
			});

			it('should not dismiss on clicks that result in detached elements', () => {
				const offcanvasInstance = fixture.componentInstance.openTplIf({});
				fixture.detectChanges();
				expect(fixture.nativeElement).toHaveOffcanvas();

				(<HTMLElement>document.querySelector('button#if')).click();
				fixture.detectChanges();
				expect(fixture.nativeElement).toHaveOffcanvas();

				offcanvasInstance.close();
				fixture.detectChanges();
				expect(fixture.nativeElement).not.toHaveOffcanvas();
			});
		});

		describe('beforeDismiss options', () => {
			it('should not dismiss when the callback returns false', () => {
				const offcanvasInstance = fixture.componentInstance.openTplDismiss({
					beforeDismiss: () => {
						return false;
					},
				});
				fixture.detectChanges();
				expect(fixture.nativeElement).toHaveOffcanvas();

				(<HTMLElement>document.querySelector('button#dismiss')).click();
				fixture.detectChanges();
				expect(fixture.nativeElement).toHaveOffcanvas();

				offcanvasInstance.close();
				fixture.detectChanges();
				expect(fixture.nativeElement).not.toHaveOffcanvas();
			});

			it('should dismiss when the callback does not return false', () => {
				fixture.componentInstance.openTplDismiss(<any>{ beforeDismiss: () => {} });
				fixture.detectChanges();
				expect(fixture.nativeElement).toHaveOffcanvas();

				(<HTMLElement>document.querySelector('button#dismiss')).click();
				fixture.detectChanges();
				expect(fixture.nativeElement).not.toHaveOffcanvas();
			});

			it('should not dismiss when the returned promise is resolved with false', fakeAsync(() => {
				const offcanvasInstance = fixture.componentInstance.openTplDismiss({
					beforeDismiss: () => Promise.resolve(false),
				});
				fixture.detectChanges();
				expect(fixture.nativeElement).toHaveOffcanvas();

				(<HTMLElement>document.querySelector('button#dismiss')).click();
				fixture.detectChanges();
				tick();
				expect(fixture.nativeElement).toHaveOffcanvas();

				offcanvasInstance.close();
				fixture.detectChanges();
				tick();
				expect(fixture.nativeElement).not.toHaveOffcanvas();
			}));

			it('should not dismiss when the returned promise is rejected', fakeAsync(() => {
				const offcanvasInstance = fixture.componentInstance.openTplDismiss({
					beforeDismiss: () => Promise.reject('error'),
				});
				fixture.detectChanges();
				expect(fixture.nativeElement).toHaveOffcanvas();

				(<HTMLElement>document.querySelector('button#dismiss')).click();
				fixture.detectChanges();
				tick();
				expect(fixture.nativeElement).toHaveOffcanvas();

				offcanvasInstance.close();
				fixture.detectChanges();
				tick();
				expect(fixture.nativeElement).not.toHaveOffcanvas();
			}));

			it('should dismiss when the returned promise is not resolved with false', fakeAsync(() => {
				fixture.componentInstance.openTplDismiss(<any>{ beforeDismiss: () => Promise.resolve() });
				fixture.detectChanges();
				expect(fixture.nativeElement).toHaveOffcanvas();

				(<HTMLElement>document.querySelector('button#dismiss')).click();
				fixture.detectChanges();
				tick();
				expect(fixture.nativeElement).not.toHaveOffcanvas();
			}));

			it('should dismiss when the callback is not defined', () => {
				fixture.componentInstance.openTplDismiss({});
				fixture.detectChanges();
				expect(fixture.nativeElement).toHaveOffcanvas();

				(<HTMLElement>document.querySelector('button#dismiss')).click();
				fixture.detectChanges();
				expect(fixture.nativeElement).not.toHaveOffcanvas();
			});
		});

		describe('container options', () => {
			it('should attach offcanvas and backdrop elements to the specified container', () => {
				const offcanvasInstance = fixture.componentInstance.open('foo', { container: '#testContainer' });
				fixture.detectChanges();
				expect(fixture.nativeElement).toHaveOffcanvas('foo', '#testContainer');
				expect(fixture.nativeElement).toHaveOffcanvasBackdrop('#testContainer');

				offcanvasInstance.close();
				fixture.detectChanges();
				expect(fixture.nativeElement).not.toHaveOffcanvas();
				expect(fixture.nativeElement).not.toHaveOffcanvasBackdrop();
			});

			it('should attach offcanvas and backdrop elements to the specified container DOM element', () => {
				const containerDomEl = document.querySelector('div#testContainer');
				const offcanvasInstance = fixture.componentInstance.open('foo', { container: containerDomEl as HTMLElement });
				fixture.detectChanges();
				expect(fixture.nativeElement).toHaveOffcanvas('foo', '#testContainer');
				expect(fixture.nativeElement).toHaveOffcanvasBackdrop('#testContainer');

				offcanvasInstance.close();
				fixture.detectChanges();
				expect(fixture.nativeElement).not.toHaveOffcanvas();
				expect(fixture.nativeElement).not.toHaveOffcanvasBackdrop();
			});

			it("should throw when the specified container element doesn't exist", () => {
				const brokenSelector = '#notInTheDOM';
				expect(() => {
					fixture.componentInstance.open('foo', { container: brokenSelector });
				}).toThrowError(`The specified offcanvas container "${brokenSelector}" was not found in the DOM.`);
			});
		});

		describe('position options', () => {
			it('should render offcanvas with specified position', () => {
				const offcanvasInstance = fixture.componentInstance.open('foo', { position: 'end' });
				fixture.detectChanges();
				expect(fixture.nativeElement).toHaveOffcanvas('foo');
				expect(document.querySelector('ngb-offcanvas-panel')).toHaveCssClass('offcanvas-end');

				offcanvasInstance.close();
				fixture.detectChanges();
				expect(fixture.nativeElement).not.toHaveOffcanvas();
			});
		});

		describe('panel custom class options', () => {
			it('should render offcanvas with the correct panel custom classes', () => {
				const offcanvasInstance = fixture.componentInstance.open('foo', { panelClass: 'bar' });
				fixture.detectChanges();
				expect(fixture.nativeElement).toHaveOffcanvas('foo');
				expect(document.querySelector('ngb-offcanvas-panel')).toHaveCssClass('bar');

				offcanvasInstance.close();
				fixture.detectChanges();
				expect(fixture.nativeElement).not.toHaveOffcanvas();
			});
		});

		describe('backdrop custom class options', () => {
			it('should render offcanvas with the correct backdrop custom classes', () => {
				const offcanvasInstance = fixture.componentInstance.open('foo', { backdropClass: 'my-fancy-backdrop' });
				fixture.detectChanges();
				expect(fixture.nativeElement).toHaveOffcanvas('foo');
				expect(document.querySelector('ngb-offcanvas-backdrop')).toHaveCssClass('my-fancy-backdrop');

				offcanvasInstance.close();
				fixture.detectChanges();
				expect(fixture.nativeElement).not.toHaveOffcanvas();
			});
		});

		describe('custom injector option', () => {
			it('should render offcanvas with a custom injector', () => {
				const customInjector = Injector.create({
					providers: [{ provide: CustomSpyService, useClass: CustomSpyService, deps: [] }],
				});
				const offcanvasInstance = fixture.componentInstance.openCmpt(CustomInjectorCmpt, { injector: customInjector });
				fixture.detectChanges();
				expect(fixture.nativeElement).toHaveOffcanvas('Some content');

				offcanvasInstance.close();
				fixture.detectChanges();
				expect(fixture.nativeElement).not.toHaveOffcanvas();
			});
		});

		describe('focus management', () => {
			describe('initial focus', () => {
				it('should focus the proper specified element when [ngbAutofocus] is used', () => {
					fixture.detectChanges();
					const offcanvasInstance = fixture.componentInstance.openCmpt(WithAutofocusOffcanvasCmpt);
					fixture.detectChanges();

					expect(document.activeElement).toBe(document.querySelector('button.withNgbAutofocus'));
					offcanvasInstance.close();
				});

				it('should focus the first focusable element when [ngbAutofocus] is not used', () => {
					fixture.detectChanges();
					const offcanvasInstance = fixture.componentInstance.openCmpt(WithFirstFocusableOffcanvasCmpt);
					fixture.detectChanges();

					expect(document.activeElement).toBe(document.querySelector('button.firstFocusable'));
					offcanvasInstance.close();
					fixture.detectChanges();
				});

				it('should skip element with tabindex=-1 when finding the first focusable element', () => {
					fixture.detectChanges();
					const offcanvasInstance = fixture.componentInstance.openCmpt(WithSkipTabindexFirstFocusableOffcanvasCmpt);
					fixture.detectChanges();

					expect(document.activeElement).toBe(document.querySelector('button.other'));
					offcanvasInstance.close();
					fixture.detectChanges();
				});

				it('should focus offcanvas panel as a default fallback option', () => {
					fixture.detectChanges();
					const offcanvasInstance = fixture.componentInstance.open('content');
					fixture.detectChanges();

					expect(document.activeElement).toBe(document.querySelector('ngb-offcanvas-panel'));
					offcanvasInstance.close();
					fixture.detectChanges();
				});
			});
		});

		describe('scrollable document', () => {
			it('should keep the document scrollable', () => {
				const offcanvasInstance = fixture.componentInstance.open('foo', { scroll: true });
				fixture.detectChanges();
				expect(fixture.nativeElement).toHaveOffcanvas('foo');
				expect(window.getComputedStyle(document.body).overflow).not.toBe('hidden');

				offcanvasInstance.close();
				fixture.detectChanges();
				expect(fixture.nativeElement).not.toHaveOffcanvas();
			});
		});

		describe('accessibility', () => {
			it('should support aria-labelledby', () => {
				const id = 'aria-labelledby-id';

				const offcanvasInstance = fixture.componentInstance.open('foo', { ariaLabelledBy: id });
				fixture.detectChanges();

				const modalElement = <HTMLElement>document.querySelector('ngb-offcanvas-panel');
				expect(modalElement.getAttribute('aria-labelledby')).toBe(id);

				offcanvasInstance.close('some result');
				fixture.detectChanges();
				expect(fixture.nativeElement).not.toHaveOffcanvas();
			});

			it('should support aria-describedby', () => {
				const id = 'aria-describedby-id';

				const offcanvasInstance = fixture.componentInstance.open('foo', { ariaDescribedBy: id });
				fixture.detectChanges();

				const modalElement = <HTMLElement>document.querySelector('ngb-offcanvas-panel');
				expect(modalElement.getAttribute('aria-describedby')).toBe(id);

				offcanvasInstance.close('some result');
				fixture.detectChanges();
				expect(fixture.nativeElement).not.toHaveOffcanvas();
			});

			it('should have aria-modal attribute', () => {
				const a11yFixture = TestBed.createComponent(TestA11yComponent);
				const offcanvasInstance = a11yFixture.componentInstance.open();
				a11yFixture.detectChanges();

				const modalElement = <HTMLElement>document.querySelector('ngb-offcanvas-panel');
				expect(modalElement.getAttribute('aria-modal')).toBe('true');

				offcanvasInstance.close();
				fixture.detectChanges();
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

		it('should accept global configuration under the NgbOffcanvasConfig token', () => {
			const offcanvasInstance = fixture.componentInstance.open('foo');
			fixture.detectChanges();

			expect(fixture.nativeElement).toHaveOffcanvas('foo');
			expect(document.querySelector('ngb-offcanvas-panel')).toHaveCssClass('offcanvas-end');
			expect(document.querySelector('ngb-offcanvas-panel')).not.toHaveCssClass('offcanvas-start');

			offcanvasInstance.close('some reason');
			fixture.detectChanges();
		});

		it('should override global configuration with local options', () => {
			const offcanvasInstance = fixture.componentInstance.open('foo', { position: 'top' });
			fixture.detectChanges();

			expect(fixture.nativeElement).toHaveOffcanvas('foo');
			expect(document.querySelector('ngb-offcanvas-panel')).toHaveCssClass('offcanvas-top');
			expect(document.querySelector('ngb-offcanvas-panel')).not.toHaveCssClass('offcanvas-end');
			expect(document.querySelector('ngb-offcanvas-panel')).not.toHaveCssClass('offcanvas-start');

			offcanvasInstance.close('some reason');
			fixture.detectChanges();
		});
	});

	if (isBrowserVisible('ngb-offcanvas animations')) {
		describe('ngb-offcanvas animations', () => {
			@Component({
				standalone: true,
				template: `
					<ng-template #content let-close="close" let-dismiss="dismiss">
						<div id="inside-div">Bla bla</div>
						<button class="btn btn-primary" id="close" (click)="close('myResult')">Close me</button>
					</ng-template>
				`,
			})
			class TestAnimationComponent {
				@ViewChild('content', { static: true }) content;

				constructor(private offcanvasService: NgbOffcanvas) {}

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
				it(`should run transform transition when opening/closing offcanvas (force-reduced-motion = ${reduceMotion})`, (done) => {
					if (reduceMotion) {
						document.body.classList.add('ngb-reduce-motion');
					}
					const component = TestBed.createComponent(TestAnimationComponent);
					component.detectChanges();

					const offcanvasRef = component.componentInstance.open();

					// Ensure that everything works fine after a reflow
					document.body.getBoundingClientRect();

					let offcanvasEl: HTMLElement | null = null;

					offcanvasRef.shown.subscribe(() => {
						offcanvasEl = document.querySelector('ngb-offcanvas-panel') as HTMLElement;
						const closeButton = document.querySelector('button#close') as HTMLButtonElement;

						expect(window.getComputedStyle(offcanvasEl).transform).toBe('none');
						expect(offcanvasEl).toHaveClass('show');
						expect(offcanvasEl).not.toHaveClass('showing');

						closeButton.click();
						component.detectChanges();

						expect(offcanvasEl).toHaveClass('show');
						expect(offcanvasEl).not.toHaveClass('showing');
						expect(offcanvasEl).toHaveClass('hiding');
					});

					offcanvasRef.hidden.subscribe(() => {
						offcanvasEl = document.querySelector('ngb-offcanvas-panel');
						expect(offcanvasEl).toBeNull();
						done();
					});

					component.detectChanges();
					offcanvasEl = document.querySelector('ngb-offcanvas-panel');

					// if reducedMotion is true, modal would be opened and closed already at this point
					if (offcanvasEl) {
						expect(offcanvasEl).toHaveClass('show');
						expect(offcanvasEl).toHaveClass('showing');
						expect(window.getComputedStyle(offcanvasEl).transform).toMatch(/matrix.*/);
					}
				});
			});

			it(`should start hiding even if the show animation isn't finished yet`, (done) => {
				const component = TestBed.createComponent(TestAnimationComponent);
				component.detectChanges();

				const offcanvasRef = component.componentInstance.open();

				// Ensure that everything works fine after a reflow
				document.body.getBoundingClientRect();

				let offcanvasEl: HTMLElement | null = null;

				offcanvasRef.hidden.subscribe(() => {
					offcanvasEl = document.querySelector('ngb-offcanvas-panel');
					expect(offcanvasEl).toBeNull();
					done();
				});

				component.detectChanges();
				offcanvasEl = document.querySelector('ngb-offcanvas-panel');

				expect(offcanvasEl).toHaveClass('show');
				expect(offcanvasEl).toHaveClass('showing');

				const closeButton = document.querySelector('button#close') as HTMLButtonElement;
				closeButton.click();
				component.detectChanges();

				expect(offcanvasEl).toHaveClass('show');
				expect(offcanvasEl).not.toHaveClass('showing');
				expect(offcanvasEl).toHaveClass('hiding');
			});
		});
	}
});

@Component({ selector: 'custom-injector-cmpt', standalone: true, template: 'Some content' })
export class CustomInjectorCmpt implements OnDestroy {
	constructor(private _spyService: CustomSpyService) {}

	ngOnDestroy(): void {
		this._spyService.called = true;
	}
}

@Component({ selector: 'destroyable-cmpt', standalone: true, template: 'Some content' })
export class DestroyableCmpt implements OnDestroy {
	constructor(private _spyService: SpyService) {}

	ngOnDestroy(): void {
		this._spyService.called = true;
	}
}

@Component({
	selector: 'offcanvas-content-cmpt',
	standalone: true,
	template: '<button class="closeFromInside" (click)="close()">Close</button>',
})
export class WithActiveOffcanvasCmpt {
	constructor(public activeModal: NgbActiveOffcanvas) {}

	close() {
		this.activeModal.close('from inside');
	}
}

@Component({
	selector: 'offcanvas-autofocus-cmpt',
	standalone: true,
	template: `<button class="withNgbAutofocus" ngbAutofocus>Click Me</button>`,
})
export class WithAutofocusOffcanvasCmpt {}

@Component({
	selector: 'offcanvas-firstfocusable-cmpt',
	standalone: true,
	template: `
		<button class="firstFocusable close">Close</button>
		<button class="other">Other button</button>
	`,
})
export class WithFirstFocusableOffcanvasCmpt {}

@Component({
	selector: 'offcanvas-skip-tabindex-firstfocusable-cmpt',
	standalone: true,
	template: `
		<button tabindex="-1" class="firstFocusable close">Close</button>
		<button class="other">Other button</button>
	`,
})
export class WithSkipTabindexFirstFocusableOffcanvasCmpt {}

@Component({
	selector: 'test-cmpt',
	standalone: true,
	imports: [NgIf, DestroyableCmpt],
	template: `
		<div id="testContainer"></div>
		<ng-template #content>Hello, {{ name }}!</ng-template>
		<ng-template #destroyableContent><destroyable-cmpt></destroyable-cmpt></ng-template>
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
			<ng-template [ngIf]="show">
				<button id="if" (click)="show = false">Click me</button>
			</ng-template>
		</ng-template>
		<button id="open" (click)="open('from button')">Open</button>
		<div id="open-no-focus" (click)="open('from non focusable element')">Open</div>
	`,
})
class TestComponent {
	name = 'World';
	openedModal: NgbOffcanvasRef;
	show = true;
	@ViewChild('content', { static: true }) tplContent;
	@ViewChild('destroyableContent', { static: true }) tplDestroyableContent;
	@ViewChild('contentWithClose', { static: true }) tplContentWithClose;
	@ViewChild('contentWithDismiss', { static: true }) tplContentWithDismiss;
	@ViewChild('contentWithImplicitContext', { static: true }) tplContentWithImplicitContext;
	@ViewChild('contentWithIf', { static: true }) tplContentWithIf;

	constructor(public offcanvasService: NgbOffcanvas) {}

	open(content: string, options?: NgbOffcanvasOptions) {
		this.openedModal = this.offcanvasService.open(content, options);
		return this.openedModal;
	}
	close() {
		if (this.openedModal) {
			this.openedModal.close('ok');
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
	standalone: true,
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
	constructor(private offcanvasService: NgbOffcanvas) {}

	open(options?: any) {
		return this.offcanvasService.open('foo', options);
	}
}
