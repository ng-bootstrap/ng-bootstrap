import { environment, ngbCompleteTransition, ngbRunTransition, NgbTransitionStartFn } from './ngbTransition';
import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { isBrowserVisible } from '../../test/common';
import { reflow } from '../util';
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';

function fadeFn({ classList }: HTMLElement) {
	classList.remove('ngb-test-show');
}

if (isBrowserVisible('ngbRunTransition')) {
	describe('ngbRunTransition', () => {
		let component: ComponentFixture<TestComponent>;
		let element: HTMLElement;
		let zone: NgZone;
		let getTransitionTimerDelayMsMock: Mock;

		beforeEach(() => {
			getTransitionTimerDelayMsMock = vi.spyOn(environment, 'getTransitionTimerDelayMs').mockReturnValue(500);
			TestBed.configureTestingModule({ imports: [TestComponent] });

			component = TestBed.createComponent(TestComponent);
			component.detectChanges();
			element = component.componentInstance.element.nativeElement;
			reflow(element);
			vi.spyOn(component.componentInstance, 'onTransitionEnd');

			zone = TestBed.inject(NgZone);
		});

		afterEach(() => {
			getTransitionTimerDelayMsMock.mockRestore();
		});

		it(`should run specified transition on an element`, async () => {
			element.classList.add('ngb-test-fade');

			const next = vi.fn();
			const error = vi.fn();

			expect(window.getComputedStyle(element).opacity).toBe('1');

			await new Promise<void>((done) => {
				ngbRunTransition(zone, element, fadeFn, { animation: true, runningTransition: 'continue' }).subscribe({
					next,
					error,
					complete: () => {
						expect(component.componentInstance.onTransitionEnd).toHaveBeenCalledTimes(1);
						expect(next).toHaveBeenCalledWith(undefined);
						expect(element.classList.contains('ngb-test-show')).toBe(false);
						expect(error).not.toHaveBeenCalled();
						expect(window.getComputedStyle(element).opacity).toBe('0');
						done();
					},
				});
			});
		});

		it(`should execute callbacks in provided zone with 'animations: false'`, () => {
			element.classList.add('ngb-test-fade');

			const next = vi.fn((_: any) => expect(NgZone.isInAngularZone()).toBe(true));
			const error = vi.fn();
			const complete = vi.fn(() => expect(NgZone.isInAngularZone()).toBe(true));

			ngbRunTransition(zone, element, fadeFn, { animation: false, runningTransition: 'continue' }).subscribe({
				next,
				error,
				complete,
			});

			expect(next).toHaveBeenCalledWith(undefined);
			expect(error).toHaveBeenCalledTimes(0);
			expect(complete).toHaveBeenCalledTimes(1);
			expect(component.componentInstance.onTransitionEnd).not.toHaveBeenCalled();
		});

		it(`should execute callbacks in provided zone with 'animations: true'`, async () => {
			element.classList.add('ngb-test-fade');

			const next = vi.fn((_: any) => expect(NgZone.isInAngularZone()).toBe(true));
			const error = vi.fn();

			await new Promise<void>((done) => {
				ngbRunTransition(zone, element, fadeFn, { animation: true, runningTransition: 'continue' }).subscribe({
					next,
					error,
					complete: () => {
						expect(NgZone.isInAngularZone()).toBe(true);
						expect(next).toHaveBeenCalledWith(undefined);
						expect(error).toHaveBeenCalledTimes(0);
						expect(component.componentInstance.onTransitionEnd).toHaveBeenCalled();
						done();
					},
				});
			});
		});

		it(`should execute callbacks in provided zone when stopping currently running transition'`, () => {
			const startFn = ({ classList }: HTMLElement) => {
				classList.add('ngb-test-during');
				return () => {
					classList.remove('ngb-test-during');
					classList.add('ngb-test-after');
				};
			};

			// starting first
			const next = vi.fn();
			const error = vi.fn();
			const complete = vi.fn(() => expect(NgZone.isInAngularZone()).toBe(true));
			ngbRunTransition(zone, element, startFn, { animation: true, runningTransition: 'stop' }).subscribe({
				next,
				error,
				complete,
			});

			// starting second
			ngbRunTransition(zone, element, startFn, { animation: true, runningTransition: 'stop' }).subscribe();

			// first transition was completed and no value was emitted
			expect(next).not.toHaveBeenCalled();
			expect(error).not.toHaveBeenCalled();
			expect(complete).toHaveBeenCalled();
		});

		it(`should emit 'undefined' and complete synchronously with 'animation: false'`, () => {
			element.classList.add('ngb-test-fade');
			expect(window.getComputedStyle(element).opacity).toBe('1');

			const next = vi.fn();
			const error = vi.fn();
			const complete = vi.fn();

			ngbRunTransition(zone, element, fadeFn, { animation: false, runningTransition: 'continue' }).subscribe({
				next,
				error,
				complete,
			});

			expect(element.classList.contains('ngb-test-show')).toBe(false);
			expect(window.getComputedStyle(element).opacity).toBe('1');
			expect(component.componentInstance.onTransitionEnd).not.toHaveBeenCalled();
			expect(next).toHaveBeenCalledWith(undefined);
			expect(error).not.toHaveBeenCalled();
			expect(complete).toHaveBeenCalled();
		});

		it(`should emit 'undefined' and complete synchronously if transition is 'none'`, () => {
			element.classList.add('ngb-test-none');
			expect(window.getComputedStyle(element).opacity).toBe('1');

			const next = vi.fn();
			const error = vi.fn();
			const complete = vi.fn();

			ngbRunTransition(zone, element, fadeFn, { animation: true, runningTransition: 'continue' }).subscribe({
				next,
				error,
				complete,
			});

			expect(element.classList.contains('ngb-test-show')).toBe(false);
			expect(window.getComputedStyle(element).opacity).toBe('1');
			expect(component.componentInstance.onTransitionEnd).not.toHaveBeenCalled();
			expect(next).toHaveBeenCalledWith(undefined);
			expect(error).not.toHaveBeenCalled();
			expect(complete).toHaveBeenCalled();
		});

		it(`should complete new transition and continue one already running with 'runningTransition: continue'`, async () => {
			let startCalls = 0;
			let endCalls = 0;
			const startFn = ({ classList }: HTMLElement) => {
				startCalls++;
				classList.add('ngb-test-during');
				return () => {
					endCalls++;
					classList.remove('ngb-test-during');
					classList.add('ngb-test-after');
				};
			};

			// starting first
			const nextSpy1 = vi.fn();
			const errorSpy1 = vi.fn();

			await new Promise<void>((done) => {
				ngbRunTransition(zone, element, startFn, { animation: true, runningTransition: 'continue' }).subscribe({
					next: nextSpy1,
					error: errorSpy1,
					complete: () => {
						expect(startCalls).toBe(1);
						expect(endCalls).toBe(1);
						expect(component.componentInstance.onTransitionEnd).toHaveBeenCalledTimes(1);
						expect(nextSpy1).toHaveBeenCalledWith(undefined);
						expect(errorSpy1).not.toHaveBeenCalled();
						expect(element.classList.contains('ngb-test-during')).toBe(false);
						expect(element.classList.contains('ngb-test-after')).toBe(true);
						expect(window.getComputedStyle(element).opacity).toBe('0');
						done();
					},
				});

				// first transition is on-going, start function was called
				expect(nextSpy1).not.toHaveBeenCalled();
				expect(element.classList.contains('ngb-test-during')).toBe(true);
				expect(element.classList.contains('ngb-test-after')).toBe(false);
				expect(window.getComputedStyle(element).opacity).toBe('1');

				// starting second
				const nextSpy2 = vi.fn();
				const errorSpy2 = vi.fn();
				const completeSpy2 = vi.fn();

				ngbRunTransition(zone, element, startFn, { animation: true, runningTransition: 'continue' }).subscribe({
					next: nextSpy2,
					error: errorSpy2,
					complete: completeSpy2,
				});

				// first transition is still on-going
				expect(nextSpy1).not.toHaveBeenCalled();
				expect(element.classList.contains('ngb-test-during')).toBe(true);
				expect(element.classList.contains('ngb-test-after')).toBe(false);
				expect(window.getComputedStyle(element).opacity).toBe('1');

				// second transition was completed and no value was emitted
				expect(nextSpy2).not.toHaveBeenCalled();
				expect(errorSpy2).not.toHaveBeenCalled();
				expect(completeSpy2).toHaveBeenCalled();
			});
		});

		it(`should run new transition and stop one already running with 'runningTransition: stop'`, async () => {
			let startCalls = 0;
			let endCalls = 0;
			const startFn = ({ classList }: HTMLElement) => {
				startCalls++;
				classList.add('ngb-test-during');
				return () => {
					endCalls++;
					classList.remove('ngb-test-during');
					classList.add('ngb-test-after');
				};
			};

			// starting first
			const nextSpy1 = vi.fn();
			const errorSpy1 = vi.fn();
			const completeSpy1 = vi.fn();

			ngbRunTransition(zone, element, startFn, { animation: true, runningTransition: 'stop' }).subscribe({
				next: nextSpy1,
				error: errorSpy1,
				complete: completeSpy1,
			});

			// first transition is on-going, start function was called
			expect(nextSpy1).not.toHaveBeenCalled();
			expect(completeSpy1).not.toHaveBeenCalled();
			expect(element.classList.contains('ngb-test-during')).toBe(true);
			expect(element.classList.contains('ngb-test-after')).toBe(false);
			expect(window.getComputedStyle(element).opacity).toBe('1');

			// starting second
			const nextSpy2 = vi.fn();
			const errorSpy2 = vi.fn();

			await new Promise<void>((done) => {
				ngbRunTransition(zone, element, startFn, { animation: true, runningTransition: 'stop' }).subscribe({
					next: nextSpy2,
					error: errorSpy2,
					complete: () => {
						expect(startCalls).toBe(2);
						expect(endCalls).toBe(1);
						expect(component.componentInstance.onTransitionEnd).toHaveBeenCalledTimes(1);
						expect(nextSpy2).toHaveBeenCalledWith(undefined);
						expect(errorSpy2).not.toHaveBeenCalled();
						expect(element.classList.contains('ngb-test-during')).toBe(false);
						expect(element.classList.contains('ngb-test-after')).toBe(true);
						expect(window.getComputedStyle(element).opacity).toBe('0');
						done();
					},
				});

				// second transition should have started
				expect(nextSpy2).not.toHaveBeenCalled();
				expect(element.classList.contains('ngb-test-during')).toBe(true);
				expect(element.classList.contains('ngb-test-after')).toBe(false);
				expect(window.getComputedStyle(element).opacity).toBe('1');

				// first transition was completed and no value was emitted
				expect(nextSpy1).not.toHaveBeenCalled();
				expect(errorSpy1).not.toHaveBeenCalled();
				expect(completeSpy1).toHaveBeenCalled();
			});
		});

		it(`should complete a transition with ngbCompleteTransition'`, () => {
			const startFn = ({ classList }: HTMLElement) => {
				classList.add('ngb-test-during');
				return () => {
					classList.remove('ngb-test-during');
					classList.add('ngb-test-after');
				};
			};

			// starting first
			const next = vi.fn();
			const error = vi.fn();
			const complete = vi.fn();

			ngbRunTransition(zone, element, startFn, { animation: true, runningTransition: 'stop' }).subscribe({
				next,
				error,
				complete,
			});

			// first transition is on-going, start function was called
			expect(next).not.toHaveBeenCalled();
			expect(complete).not.toHaveBeenCalled();
			expect(element.classList.contains('ngb-test-during')).toBe(true);
			expect(element.classList.contains('ngb-test-after')).toBe(false);
			expect(window.getComputedStyle(element).opacity).toBe('1');

			ngbCompleteTransition(element);

			expect(next).toHaveBeenCalled();
			expect(complete).toHaveBeenCalled();
			expect(element.classList.contains('ngb-test-during')).toBe(false);
			expect(element.classList.contains('ngb-test-after')).toBe(true);
			expect(window.getComputedStyle(element).opacity).toBe('0');
		});

		it(`should create and allow modifying context when running a new transition`, async () => {
			const startFn: NgbTransitionStartFn<{
				number;
			}> = (
				{ classList }: HTMLElement,
				animation: boolean,
				context: {
					number;
				},
			) => {
				classList.remove('ngb-test-show');
				expect(context.number).toBe(123);
				context.number = 456;
			};

			element.classList.add('ngb-test-fade');

			const ctx = { number: 123 };

			expect(window.getComputedStyle(element).opacity).toBe('1');

			await new Promise<void>((done) => {
				ngbRunTransition(zone, element, startFn, {
					animation: true,
					runningTransition: 'continue',
					context: ctx,
				}).subscribe(() => {
					expect(window.getComputedStyle(element).opacity).toBe('0');
					expect(ctx.number).toBe(456);
					done();
				});
			});
		});

		it(`should create and allow modifying context when running multiple transitions`, async () => {
			const contextSpy = vi.fn();
			const startFn: NgbTransitionStartFn<{
				counter?;
				text?;
			}> = (
				{ classList }: HTMLElement,
				animation: boolean,
				context: {
					counter?;
					text?;
				},
			) => {
				classList.add('ngb-test-during');
				if (!context.counter) {
					context.counter = 0;
				}
				context.counter++;
				contextSpy({ ...context });

				return () => {
					classList.remove('ngb-test-during');
					classList.add('ngb-test-after');
					context.counter = 999;
					contextSpy({ ...context });
				};
			};

			element.classList.add('ngb-test-before');

			// first transition
			ngbRunTransition(zone, element, startFn, {
				animation: true,
				runningTransition: 'stop',
				context: { text: 'one' },
			}).subscribe({ next: () => {}, error: () => {}, complete: () => {} });
			expect(contextSpy).toHaveBeenCalledWith({ text: 'one', counter: 1 });

			expect(window.getComputedStyle(element).opacity).toBe('1');

			await new Promise<void>((done) => {
				// second transiiton
				ngbRunTransition(zone, element, startFn, {
					animation: true,
					runningTransition: 'stop',
					context: { text: 'two' },
				}).subscribe(() => {
					expect(window.getComputedStyle(element).opacity).toBe('0');
					expect(contextSpy).toHaveBeenCalledTimes(3);
					expect(contextSpy).toHaveBeenCalledWith({ text: 'two', counter: 999 });
					done();
				});
				expect(contextSpy).toHaveBeenCalledWith({ text: 'two', counter: 2 });
			});
		});

		it(`should pass context with 'animation: false'`, () => {
			const next = vi.fn();
			const error = vi.fn();
			const complete = vi.fn();
			const startFnSpy = vi.fn((_, __, context) => {
				expect(context.flag).toBe(42);
			});

			ngbRunTransition(zone, element, startFnSpy, {
				animation: false,
				runningTransition: 'continue',
				context: { flag: 42 },
			}).subscribe({ next, error, complete });

			expect(next).toHaveBeenCalledWith(undefined);
			expect(error).not.toHaveBeenCalled();
			expect(complete).toHaveBeenCalled();
			expect(startFnSpy).toHaveBeenCalled();
		});

		it(`should complete and release the DOM element even if transition end is not fired`, async () => {
			element.classList.add('ngb-test-fade');

			const next = vi.fn();
			const error = vi.fn();

			// detaching transitioning element from DOM
			expect(window.getComputedStyle(element).opacity).toBe('1');
			element.parentElement!.removeChild(element);

			await new Promise<void>((done) => {
				ngbRunTransition(zone, element, fadeFn, { animation: true, runningTransition: 'continue' }).subscribe({
					next,
					error,
					complete: () => {
						expect(component.componentInstance.onTransitionEnd).not.toHaveBeenCalled(); // <-- finished with timer
						expect(next).toHaveBeenCalledWith(undefined);
						expect(error).not.toHaveBeenCalled();
						expect(element.classList.contains('ngb-test-show')).toBe(false);
						expect(window.getComputedStyle(element).opacity).toBe(''); // <-- detached from DOM
						done();
					},
				});
			});
		});

		it(`should read duration after the start function was executed`, async () => {
			const startFn = ({ classList }: HTMLElement) => classList.add('ngb-test-long-duration');

			const next = vi.fn();
			const error = vi.fn();

			await new Promise<void>((done) => {
				ngbRunTransition(zone, element, startFn, { animation: true, runningTransition: 'continue' }).subscribe({
					next,
					error,
					complete: () => {
						// if duration is read before the 'startFn' is executed, it will be read as 0
						expect(component.componentInstance.onTransitionEnd).toHaveBeenCalledTimes(1);
						expect(next).toHaveBeenCalledWith(undefined);
						expect(element.classList.contains('ngb-test-long-duration')).toBe(true);
						expect(error).not.toHaveBeenCalled();
						expect(window.getComputedStyle(element).opacity).toBe('0');
						done();
					},
				});
				expect(window.getComputedStyle(element).opacity).toBe('1');
				expect(element.classList.contains('ngb-test-long-duration')).toBe(true);
			});
		});

		it(`should execute the end function if provided`, async () => {
			const startFn = ({ classList }: HTMLElement) => {
				classList.add('ngb-test-during');
				return () => {
					classList.remove('ngb-test-before');
					classList.remove('ngb-test-during');
					classList.add('ngb-test-after');
				};
			};

			element.classList.add('ngb-test-before');

			const next = vi.fn();
			const error = vi.fn();

			await new Promise<void>((done) => {
				ngbRunTransition(zone, element, startFn, { animation: true, runningTransition: 'continue' }).subscribe({
					next,
					error,
					complete: () => {
						expect(component.componentInstance.onTransitionEnd).toHaveBeenCalledTimes(1);
						expect(next).toHaveBeenCalledWith(undefined);
						expect(element.classList.contains('ngb-test-before')).toBe(false);
						expect(element.classList.contains('ngb-test-during')).toBe(false);
						expect(element.classList.contains('ngb-test-after')).toBe(true);
						expect(error).not.toHaveBeenCalled();
						expect(window.getComputedStyle(element).opacity).toBe('0');
						done();
					},
				});

				expect(window.getComputedStyle(element).opacity).toBe('1');
				expect(element.classList.contains('ngb-test-before')).toBe(true);
				expect(element.classList.contains('ngb-test-during')).toBe(true);
				expect(element.classList.contains('ngb-test-after')).toBe(false);
			});
		});
	});

	describe('ngbRunTransition nesting', () => {
		@Component({
			template: ` <div #outer class="ngb-test-outer" (transitionend)="onTransitionOuterEnd()">
				<div #inner class="ngb-test-inner" (transitionend)="onTransitionInnerEnd()"></div>
			</div>`,
			styles: [
				`
					.ngb-test-outer {
						width: 100px;
						height: 100px;
						padding: 10px;
						background-color: red;
						opacity: 1;
					}
					.ngb-test-inner {
						width: 100%;
						height: 100%;
						background-color: blue;
						opacity: 1;
					}
				`,
			],
		})
		class TestComponentNested {
			@ViewChild('outer')
			outer: ElementRef<HTMLDivElement>;
			@ViewChild('inner')
			inner: ElementRef<HTMLDivElement>;

			onTransitionOuterEnd = () => {};
			onTransitionInnerEnd = () => {};
		}
		let getTransitionTimerDelayMsMock: Mock;

		beforeEach(() => {
			getTransitionTimerDelayMsMock = vi.spyOn(environment, 'getTransitionTimerDelayMs').mockReturnValue(50);
			TestBed.configureTestingModule({ imports: [TestComponentNested] });
		});

		afterEach(() => {
			getTransitionTimerDelayMsMock.mockRestore();
		});

		it(`should ignore all inner element transitions`, async () => {
			const zone = TestBed.inject(NgZone);

			const fixture = TestBed.createComponent(TestComponentNested);
			fixture.detectChanges();

			reflow(fixture.nativeElement);

			const outerEl = fixture.componentInstance.outer.nativeElement;
			const innerEl = fixture.componentInstance.inner.nativeElement;

			const next = vi.fn();
			const error = vi.fn();

			vi.spyOn(fixture.componentInstance, 'onTransitionInnerEnd');
			vi.spyOn(fixture.componentInstance, 'onTransitionOuterEnd');

			await new Promise<void>((done) => {
				ngbRunTransition(
					zone,
					outerEl,
					() => {
						outerEl.classList.add('ngb-test-hide-outer');
						innerEl.classList.add('ngb-test-hide-inner');
					},
					{ animation: true, runningTransition: 'continue' },
				).subscribe({
					next,
					error,
					complete: () => {
						expect(fixture.componentInstance.onTransitionOuterEnd).toHaveBeenCalledTimes(2);
						expect(fixture.componentInstance.onTransitionInnerEnd).toHaveBeenCalledTimes(1);
						expect(window.getComputedStyle(outerEl).opacity).toBe('0');
						expect(window.getComputedStyle(innerEl).opacity).toBe('0');
						expect(next).toHaveBeenCalledWith(undefined);
						expect(error).not.toHaveBeenCalled();
						done();
					},
				});
			});
		});
	});
}

@Component({
	template: ` <div #element class="ngb-test-transition ngb-test-show" (transitionend)="onTransitionEnd()"></div>`,
})
class TestComponent {
	@ViewChild('element')
	element: ElementRef<HTMLDivElement>;

	onTransitionEnd = () => {};
}
