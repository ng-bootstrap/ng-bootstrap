import { Component, Service, Injector, OnDestroy, ViewChild } from '@angular/core';
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
			it('should open and close offcanvas with default options', () => {
				const offcanvasInstance = fixture.componentInstance.open('foo');
				fixture.detectChanges();
				expect(fixture.nativeElement).toHaveOffcanvas('foo');

				const offcanvasEl = document.querySelector('ngb-offcanvas-panel') as HTMLElement;
				expect(offcanvasEl.classList.contains('fade')).toBe(false);
				expect(offcanvasEl.classList.contains('show')).toBe(true);

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
				const closedSpy = vi.fn();
				fixture.componentInstance.openTplClose().closed.subscribe(closedSpy);
				fixture.detectChanges();
				expect(fixture.nativeElement).toHaveOffcanvas();

				(<HTMLElement>document.querySelector('button#close')).click();
				fixture.detectChanges();
				expect(fixture.nativeElement).not.toHaveOffcanvas();

				expect(closedSpy).toHaveBeenCalledWith('myResult');
			});

			it(`should emit 'dismissed' on dismissal`, () => {
				const dismissSpy = vi.fn();
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
				const shownSpy = vi.fn();
				const hiddenSpy = vi.fn();
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

			it('should remove / restore scroll bar when offcanvas is open and closed', async () => {
				expect(window.getComputedStyle(document.body).overflow).not.toBe('hidden');
				const offcanvasRef = fixture.componentInstance.open('bar');
				fixture.detectChanges();
				expect(window.getComputedStyle(document.body).overflow).toBe('hidden');

				offcanvasRef.close('bar result');
				fixture.detectChanges();
				await fixture.whenStable();

				expect(window.getComputedStyle(document.body).overflow).not.toBe('hidden');
			});

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

			it('should indicate if there is an open offcanvas', async () => {
				fixture.componentInstance.open('foo');
				fixture.detectChanges();
				expect(fixture.nativeElement).toHaveOffcanvas('foo');
				expect(fixture.componentInstance.offcanvasService.hasOpenOffcanvas()).toBe(true);

				fixture.componentInstance.dismiss();
				fixture.detectChanges();
				await fixture.whenStable();
				expect(fixture.nativeElement).not.toHaveOffcanvas();
				expect(fixture.componentInstance.offcanvasService.hasOpenOffcanvas()).toBe(false);
			});
		});

		describe('stacked offcanvas', () => {
			it('should not leak scroll locks when content creation fails', () => {
				@Component({ template: '' })
				class ThrowingContent {
					constructor() {
						throw new Error('cannot create content');
					}
				}
				const service = fixture.componentInstance.offcanvasService;
				const initialOverflow = document.body.style.overflow;
				expect(() => service.open(ThrowingContent)).toThrow('cannot create content');
				const ref = service.open('content');
				fixture.detectChanges();
				ref.close();
				expect(document.body.style.overflow).toBe(initialOverflow);
			});

			it('should restore focus to a surviving panel when the previous opener was removed', async () => {
				const first = fixture.componentInstance.openTplImplicitContext();
				fixture.detectChanges();
				const buttons = document.querySelector('ngb-offcanvas-panel')!.querySelectorAll('button');
				const middle = fixture.componentInstance.open('middle');
				fixture.detectChanges();
				const last = fixture.componentInstance.open('last');
				fixture.detectChanges();
				try {
					middle.close();
					last.close();
					await new Promise((resolve) => setTimeout(resolve));
					expect(document.activeElement).toBe(buttons[0]);
					const tab = new KeyboardEvent('keydown', {
						key: 'Tab',
						shiftKey: true,
						bubbles: true,
						cancelable: true,
					});
					buttons[0].dispatchEvent(tab);
					expect(tab.defaultPrevented).toBe(true);
					expect(document.activeElement).toBe(buttons[1]);
				} finally {
					last.close();
					middle.close();
					first.close();
				}
			});

			(['close', 'dismiss'] as const).forEach((action) => {
				it(`should restore the previous active instance on ${action}`, async () => {
					const service = fixture.componentInstance.offcanvasService;
					const active = vi.fn();
					service.activeInstance.subscribe(active);
					const first = service.open('first');
					const second = service.open('second');
					fixture.detectChanges();
					try {
						expect(active.mock.calls.map(([ref]) => ref)).toEqual([first, second]);
						second[action]();
						await fixture.whenStable();
						expect(active).toHaveBeenLastCalledWith(first);
						expect(service.hasOpenOffcanvas()).toBe(true);
						expect(fixture.nativeElement).toHaveOffcanvas('first');

						service.dismiss('last');
						await fixture.whenStable();
						expect(active).toHaveBeenLastCalledWith(undefined);
						expect(service.hasOpenOffcanvas()).toBe(false);
						expect(fixture.nativeElement).not.toHaveOffcanvas();
					} finally {
						second.close();
						first.close();
					}
				});
			});

			it('should retain the active instance when an earlier offcanvas closes', async () => {
				const service = fixture.componentInstance.offcanvasService;
				const active = vi.fn();
				service.activeInstance.subscribe(active);
				const first = service.open('first');
				const middle = service.open('middle');
				const last = service.open('last');
				fixture.detectChanges();
				try {
					middle.close();
					await fixture.whenStable();
					expect(active).toHaveBeenLastCalledWith(last);
					expect(service.hasOpenOffcanvas()).toBe(true);
					last.close();
					await fixture.whenStable();
					expect(active).toHaveBeenLastCalledWith(first);
				} finally {
					last.close();
					middle.close();
					first.close();
				}
			});

			[false, true].forEach((firstScroll) => {
				[false, true].forEach((secondScroll) => {
					[0, 1].forEach((closedIndex) => {
						it(`should retain only remaining scroll locks (scroll: ${firstScroll}, ${secondScroll}; close: ${closedIndex})`, () => {
							const service = fixture.componentInstance.offcanvasService;
							const initialOverflow = document.body.style.overflow;
							const scroll = [firstScroll, secondScroll];
							const refs = scroll.map((scroll) => service.open('content', { scroll }));
							fixture.detectChanges();
							try {
								refs[closedIndex].close();
								expect(document.body.style.overflow).toBe(scroll[1 - closedIndex] ? initialOverflow : 'hidden');
							} finally {
								refs.forEach((ref) => ref.close());
							}
							expect(document.body.style.overflow).toBe(initialOverflow);
						});
					});
				});
			});

			it('should trap focus in the remaining panel after the active panel closes', () => {
				const first = fixture.componentInstance.openTplImplicitContext();
				fixture.detectChanges();
				const panel = document.querySelector('ngb-offcanvas-panel')!;
				const buttons = panel.querySelectorAll('button');
				const second = fixture.componentInstance.open('second');
				fixture.detectChanges();
				try {
					second.close();
					buttons[1].focus();
					const tab = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
					buttons[1].dispatchEvent(tab);
					expect(tab.defaultPrevented).toBe(true);
					expect(document.activeElement).toBe(buttons[0]);
				} finally {
					second.close();
					first.close();
				}
			});

			it('should keep focus in the active panel when an earlier panel closes', async () => {
				fixture.detectChanges();
				const opener = fixture.nativeElement.querySelector('#open') as HTMLButtonElement;
				opener.focus();
				const first = fixture.componentInstance.open('first');
				fixture.detectChanges();
				const second = fixture.componentInstance.openTplImplicitContext();
				fixture.detectChanges();
				const focused = document.activeElement;
				try {
					first.close();
					await new Promise((resolve) => setTimeout(resolve));
					expect(document.activeElement).toBe(focused);
					const tab = new KeyboardEvent('keydown', {
						key: 'Tab',
						shiftKey: true,
						bubbles: true,
						cancelable: true,
					});
					focused!.dispatchEvent(tab);
					expect(tab.defaultPrevented).toBe(true);
					expect(document.activeElement).toBe(document.querySelector('ngb-offcanvas-panel button#dismiss'));
				} finally {
					second.close();
					first.close();
				}
			});
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

			it('should not dismiss when the returned promise is resolved with false', async () => {
				const offcanvasInstance = fixture.componentInstance.openTplDismiss({
					beforeDismiss: () => Promise.resolve(false),
				});
				fixture.detectChanges();
				expect(fixture.nativeElement).toHaveOffcanvas();

				(<HTMLElement>document.querySelector('button#dismiss')).click();
				fixture.detectChanges();
				await fixture.whenStable();
				expect(fixture.nativeElement).toHaveOffcanvas();

				offcanvasInstance.close();
				fixture.detectChanges();
				await fixture.whenStable();
				expect(fixture.nativeElement).not.toHaveOffcanvas();
			});

			it('should not dismiss when the returned promise is rejected', async () => {
				const offcanvasInstance = fixture.componentInstance.openTplDismiss({
					beforeDismiss: () => Promise.reject('error'),
				});
				fixture.detectChanges();
				expect(fixture.nativeElement).toHaveOffcanvas();

				(<HTMLElement>document.querySelector('button#dismiss')).click();
				fixture.detectChanges();
				await fixture.whenStable();
				expect(fixture.nativeElement).toHaveOffcanvas();

				offcanvasInstance.close();
				fixture.detectChanges();
				await fixture.whenStable();
				expect(fixture.nativeElement).not.toHaveOffcanvas();
			});

			it('should dismiss when the returned promise is not resolved with false', async () => {
				fixture.componentInstance.openTplDismiss(<any>{ beforeDismiss: () => Promise.resolve() });
				fixture.detectChanges();
				expect(fixture.nativeElement).toHaveOffcanvas();

				(<HTMLElement>document.querySelector('button#dismiss')).click();
				fixture.detectChanges();
				await fixture.whenStable();
				expect(fixture.nativeElement).not.toHaveOffcanvas();
			});

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
				}).toThrow(`The specified offcanvas container "${brokenSelector}" was not found in the DOM.`);
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

			it('should retain scroll locks until every closing offcanvas is hidden', async () => {
				const service = TestBed.inject(NgbOffcanvas);
				const component = TestBed.createComponent(TestAnimationComponent);
				const first = service.open('first');
				const second = service.open('second', { animation: false });
				const shown = firstValueFrom(first.shown);
				component.detectChanges();
				await shown;
				const hidden = firstValueFrom(first.hidden);
				first.close();
				second.close();
				try {
					expect(document.body.style.overflow).toBe('hidden');
				} finally {
					await hidden;
				}
				expect(document.body.style.overflow).not.toBe('hidden');
			});

			it('should restore focus and its trap after the active offcanvas finishes hiding', async () => {
				const component = TestBed.createComponent(TestComponent);
				component.detectChanges();
				const first = component.componentInstance.openTplImplicitContext();
				let shown = firstValueFrom(first.shown);
				component.detectChanges();
				await shown;
				const buttons = document.querySelector('ngb-offcanvas-panel')!.querySelectorAll('button');
				const second = component.componentInstance.open('second');
				shown = firstValueFrom(second.shown);
				component.detectChanges();
				await shown;
				try {
					const hidden = firstValueFrom(second.hidden);
					second.close();
					await hidden;
					await new Promise((resolve) => setTimeout(resolve));
					expect(document.activeElement).toBe(buttons[0]);
					const tab = new KeyboardEvent('keydown', {
						key: 'Tab',
						shiftKey: true,
						bubbles: true,
						cancelable: true,
					});
					buttons[0].dispatchEvent(tab);
					expect(tab.defaultPrevented).toBe(true);
					expect(document.activeElement).toBe(buttons[1]);
				} finally {
					const hidden = firstValueFrom(first.hidden);
					first.close();
					await hidden;
				}
			});

			[true, false].forEach((reduceMotion) => {
				it(`should run transform transition when opening/closing offcanvas (force-reduced-motion = ${reduceMotion})`, async () => {
					if (reduceMotion) {
						document.body.classList.add('ngb-reduce-motion');
					}
					const component = TestBed.createComponent(TestAnimationComponent);
					component.detectChanges();

					const offcanvasRef = component.componentInstance.open();
					const shownPromise = firstValueFrom(offcanvasRef.shown);
					component.detectChanges();

					// Ensure that everything works fine after a reflow
					document.body.getBoundingClientRect();

					let offcanvasEl: HTMLElement | null = null;

					offcanvasEl = document.querySelector('ngb-offcanvas-panel') as HTMLElement;
					const closeButton = document.querySelector('button#close') as HTMLButtonElement;

					expect(offcanvasEl.classList.contains('show')).toBe(true);
					expect(offcanvasEl.classList.contains('showing')).toBe(!reduceMotion);

					await shownPromise;

					component.detectChanges();
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
				component.detectChanges();

				const offcanvasRef = component.componentInstance.open();

				// Ensure that everything works fine after a reflow
				document.body.getBoundingClientRect();

				let offcanvasEl: HTMLElement | null = null;

				offcanvasRef.hidden.subscribe(() => {
					offcanvasEl = document.querySelector('ngb-offcanvas-panel');
					expect(offcanvasEl).toBeNull();
				});

				component.detectChanges();
				offcanvasEl = document.querySelector('ngb-offcanvas-panel')!;
				expect(offcanvasEl.classList.contains('show')).toBe(true);
				expect(offcanvasEl.classList.contains('showing')).toBe(true);

				await firstValueFrom(offcanvasRef.shown);
				component.detectChanges();
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
			fixture.detectChanges();

			// opening by navigating
			router.navigate(['lazy']);
			await fixture.whenStable();
			fixture.detectChanges();
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
	constructor(private _spyService: CustomSpyService) {}

	ngOnDestroy(): void {
		this._spyService.called = true;
	}
}

@Component({ selector: 'destroyable-cmpt', template: 'Some content' })
export class DestroyableCmpt implements OnDestroy {
	constructor(private _spyService: SpyService) {}

	ngOnDestroy(): void {
		this._spyService.called = true;
	}
}

@Component({
	selector: 'offcanvas-content-cmpt',
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
		<ng-template #content>Hello, {{ name }}!</ng-template>
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
			@if (show) {
				<button id="if" (click)="show = false">Click me</button>
			}
		</ng-template>
		<button id="open" (click)="open('from button')">Open</button>
		<div id="open-no-focus" (click)="open('from non focusable element')">Open</div>
	`,
})
class TestComponent {
	name = 'World';
	openedModal: NgbOffcanvasRef;
	show = true;
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
