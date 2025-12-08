import { NgbScrollSpyService } from './scrollspy.service';
import { NgbScrollSpyConfig } from './scrollspy-config';
import { firstValueFrom } from 'rxjs';
import { isBrowserVisible } from '../test/common';
import { afterEach, beforeEach, describe, expect, it, type Mock, vi } from 'vitest';
import { ChangeDetectorRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

const appendFragmentToDOM = (id = 'test') => {
	const el = document.createElement('div');
	el.setAttribute('id', id);
	document.body.appendChild(el);
	return el;
};

const removeFragmentFromDOM = (id = 'test') => document.getElementById(id)?.remove();

describe('ScrollSpy service (mocked)', () => {
	let observe: Mock<any>;
	let unobserve: Mock<any>;
	let disconnect: Mock<any>;
	let callSpy: Mock<{
		new (callback: IntersectionObserverCallback, options?: IntersectionObserverInit): IntersectionObserver;
		prototype: IntersectionObserver;
	}>;
	let scrollSpy: NgbScrollSpyService;
	let fragment: HTMLElement;
	let config: NgbScrollSpyConfig;

	beforeEach(() => {
		observe = vi.fn();
		unobserve = vi.fn();
		disconnect = vi.fn();
		callSpy = vi.spyOn(window, 'IntersectionObserver').mockImplementation(
			class MockIntersectionObserver {
				constructor(
					private callback: IntersectionObserverCallback,
					options?: IntersectionObserverInit,
				) {}
				observe = observe;
				unobserve = unobserve;
				disconnect = disconnect;
			} as any,
		);
		TestBed.configureTestingModule({
			providers: [NgbScrollSpyConfig],
		});
		config = TestBed.inject(NgbScrollSpyConfig);
		scrollSpy = TestBed.inject(NgbScrollSpyService);
		fragment = appendFragmentToDOM();
	});

	afterEach(() => {
		scrollSpy.stop();
		removeFragmentFromDOM();
		vi.restoreAllMocks();
	});

	it('should start the scrollspy', () => {
		scrollSpy.start();
		expect(callSpy).toHaveBeenCalledTimes(1);
		expect(vi.mocked(callSpy).mock.lastCall![1]).toEqual({ root: document });
	});

	it('should update not active when starting the scrollspy, if no fragments visible', () => {
		let calls: string[] = [];
		scrollSpy.active$.subscribe((active) => calls.push(active));
		expect(calls).toEqual([]);
		expect(scrollSpy.active).toBe('');

		scrollSpy.start();
		expect(scrollSpy.active).toBe('');
		expect(calls).toEqual([]);
	});

	it('should pass arguments to the intersection observer', () => {
		scrollSpy.start({ root: fragment, rootMargin: '1px', threshold: [0.5] });
		expect(callSpy).toHaveBeenCalledTimes(1);
		expect(vi.mocked(callSpy).mock.lastCall![1]).toEqual({ root: fragment, rootMargin: '1px', threshold: [0.5] });
	});

	it('should disconnect from the intersection observer', () => {
		scrollSpy.start();
		scrollSpy.stop();
		expect(disconnect).toHaveBeenCalledTimes(1);
	});

	it('should observe fragments registered before starting', () => {
		const one = appendFragmentToDOM('one');
		const two = appendFragmentToDOM('two');
		scrollSpy.observe(one);
		scrollSpy.observe('two');
		scrollSpy.observe(fragment);
		scrollSpy.start();

		expect(observe).toHaveBeenCalledTimes(3);
		expect(observe).toHaveBeenCalledWith(one);
		expect(observe).toHaveBeenCalledWith(two);
		expect(observe).toHaveBeenCalledWith(fragment);

		removeFragmentFromDOM('one');
		removeFragmentFromDOM('two');
	});

	it('should observe fragments passed as options', () => {
		const one = appendFragmentToDOM('one');
		const two = appendFragmentToDOM('two');
		scrollSpy.observe(fragment);
		scrollSpy.start({
			fragments: [one, 'two'],
		});
		expect(observe).toHaveBeenCalledTimes(3);
		expect(observe).toHaveBeenCalledWith(one);
		expect(observe).toHaveBeenCalledWith(two);
		expect(observe).toHaveBeenCalledWith(fragment);

		removeFragmentFromDOM('one');
		removeFragmentFromDOM('two');
	});

	it('should register new fragments', () => {
		scrollSpy.start();
		scrollSpy.observe(fragment);
		expect(observe).toHaveBeenCalledWith(fragment);
	});

	it('should register new fragments by id', () => {
		scrollSpy.start();
		scrollSpy.observe(fragment.id);
		expect(observe).toHaveBeenCalledWith(fragment);
	});

	it('should not register same fragments twice', () => {
		scrollSpy.start();
		scrollSpy.observe(fragment);
		scrollSpy.observe(fragment);
		expect(observe).toHaveBeenCalledTimes(1);
		expect(observe).toHaveBeenCalledWith(fragment);
	});

	it('should not register non-existing fragments', () => {
		scrollSpy.start();
		scrollSpy.observe('blah');
		expect(observe).not.toHaveBeenCalled();
	});

	it('should unregister existing fragments', () => {
		scrollSpy.start();
		scrollSpy.observe(fragment);
		scrollSpy.unobserve(fragment);
		expect(disconnect).toHaveBeenCalled();
	});

	it('should unregister existing fragments by id', () => {
		scrollSpy.start();
		scrollSpy.observe(fragment);
		scrollSpy.unobserve(fragment.id);
		expect(disconnect).toHaveBeenCalled();
	});

	it('should not unregister non-existing fragments', () => {
		scrollSpy.start();
		scrollSpy.unobserve('blah');
		expect(disconnect).not.toHaveBeenCalled();
	});

	it('should re-register remaining fragments when unregistering one', () => {
		const one = appendFragmentToDOM('one');
		const two = appendFragmentToDOM('two');
		scrollSpy.start({ fragments: [one, two] });
		expect(observe).toHaveBeenCalledTimes(2);

		scrollSpy.unobserve(two);
		expect(disconnect).toHaveBeenCalled();
		expect(observe).toHaveBeenCalledTimes(3);
		expect(vi.mocked(observe).mock.lastCall![0]).toBe(one);

		removeFragmentFromDOM('one');
		removeFragmentFromDOM('two');
	});

	it('should scroll to a fragment by id', () => {
		const spy = vi.spyOn(document.documentElement, 'scrollTo') as any;

		scrollSpy.start();
		scrollSpy.scrollTo(fragment.id);
		expect(spy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
	});

	it('should scroll only to an exising fragment', () => {
		const spy = vi.spyOn(document.documentElement, 'scrollTo') as any;

		scrollSpy.start();
		scrollSpy.scrollTo('blah');
		expect(spy).not.toHaveBeenCalled();
	});

	it('should allow to scroll to a fragment with options provided at creation time', () => {
		const spy = vi.spyOn(document.documentElement, 'scrollTo') as any;

		scrollSpy.start({ scrollBehavior: 'auto' });
		scrollSpy.scrollTo(fragment.id);
		expect(spy).toHaveBeenCalledWith({ top: 0, behavior: 'auto' });
	});

	it('should allow to scroll to a fragment with options', () => {
		const spy = vi.spyOn(document.documentElement, 'scrollTo') as any;

		scrollSpy.start();
		scrollSpy.scrollTo(fragment.id, { behavior: 'auto' });
		expect(spy).toHaveBeenCalledWith({ top: 0, behavior: 'auto' });
	});

	it('should allow changing scrolling options from the configuration', () => {
		const spy = vi.spyOn(document.documentElement, 'scrollTo') as any;

		expect(config.scrollBehavior).toBe('smooth');
		config.scrollBehavior = 'auto';

		scrollSpy.start();
		scrollSpy.scrollTo(fragment.id);
		expect(spy).toHaveBeenCalledWith({ top: 0, behavior: 'auto' });
	});
});

if (isBrowserVisible('scrollspy-service')) {
	describe('ScrollSpy service', () => {
		it('should allow overriding scrollspy logic via configuration', async () => {
			TestBed.configureTestingModule({
				providers: [NgbScrollSpyConfig],
			});
			const scrollSpy = TestBed.inject(NgbScrollSpyService);
			const config = TestBed.inject(NgbScrollSpyConfig);
			appendFragmentToDOM('one');

			config.processChanges = (_, changeActive) => changeActive('two');

			scrollSpy.start({
				fragments: ['one'],
			});

			expect(await firstValueFrom(scrollSpy.active$)).toBe('two');

			removeFragmentFromDOM('one');
		});

		it('should allow overriding scrollspy logic', async () => {
			const scrollSpy = TestBed.inject(NgbScrollSpyService);
			const one = appendFragmentToDOM('one');

			scrollSpy.observe(one);

			const entry = new Promise<IntersectionObserverEntry>((resolve) => {
				scrollSpy.start({
					processChanges: (state: { entries: IntersectionObserverEntry[] }) => resolve(state.entries[0]),
				});
			});

			expect(await entry).toBeTruthy();
			expect((await entry).target).toBe(one);

			removeFragmentFromDOM('one');
		});

		it('should reset active fragment after stopping service explicitly', async () => {
			const scrollSpy = TestBed.inject(NgbScrollSpyService);
			appendFragmentToDOM('one');

			scrollSpy.start({ fragments: ['one'] });
			expect(await firstValueFrom(scrollSpy.active$)).toBe('one');

			scrollSpy.stop();
			expect(scrollSpy.active).toBe('');

			removeFragmentFromDOM('one');
		});

		it(`should not reset active fragment when destroying via 'ngOnDestroy' `, async () => {
			const scrollSpy = TestBed.inject(NgbScrollSpyService);
			appendFragmentToDOM('one');

			scrollSpy.start({ fragments: ['one'] });
			expect(await firstValueFrom(scrollSpy.active$)).toBe('one');

			scrollSpy.ngOnDestroy();
			expect(scrollSpy.active).toBe('one');

			removeFragmentFromDOM('one');
		});

		it('should recompute active fragment after removing currently active one', async () => {
			const scrollSpy = TestBed.inject(NgbScrollSpyService);
			appendFragmentToDOM('one');
			appendFragmentToDOM('two');

			scrollSpy.start({ fragments: ['one', 'two'] });
			expect(scrollSpy.active).toBe('');

			expect(await firstValueFrom(scrollSpy.active$)).toBe('one');

			scrollSpy.unobserve('one');
			expect(await firstValueFrom(scrollSpy.active$)).toBe('two');

			scrollSpy.stop();
			removeFragmentFromDOM('one');
			removeFragmentFromDOM('two');
		});

		it('should update currently active fragment', async () => {
			const scrollSpy = TestBed.inject(NgbScrollSpyService);
			const fragment1 = appendFragmentToDOM('one');
			const fragment2 = appendFragmentToDOM('two');

			scrollSpy.start();
			expect(scrollSpy.active).toBe('');

			scrollSpy.observe(fragment1);
			scrollSpy.observe(fragment2);

			expect(await firstValueFrom(scrollSpy.active$)).toBe('one');

			scrollSpy.scrollTo('two');
			expect(await firstValueFrom(scrollSpy.active$)).toBe('two');

			scrollSpy.stop();
			removeFragmentFromDOM('one');
			removeFragmentFromDOM('two');
		});

		it('should use provided change detector and initial fragment options', async () => {
			const scrollSpy = TestBed.inject(NgbScrollSpyService);
			const fragment1 = appendFragmentToDOM('one');
			const fragment2 = appendFragmentToDOM('two');

			const cdSpy = {
				markForCheck: vi.fn(),
			};

			scrollSpy.start({ changeDetectorRef: cdSpy as unknown as ChangeDetectorRef, initialFragment: 'two' });

			scrollSpy.observe(fragment1);
			scrollSpy.observe(fragment2);

			expect(await firstValueFrom(scrollSpy.active$)).toBe('two');
			expect(cdSpy.markForCheck).toHaveBeenCalledTimes(1);

			scrollSpy.scrollTo('one');
			expect(await firstValueFrom(scrollSpy.active$)).toBe('one');
			expect(cdSpy.markForCheck).toHaveBeenCalledTimes(2);

			scrollSpy.stop();
			removeFragmentFromDOM('one');
			removeFragmentFromDOM('two');
		});
	});
}
