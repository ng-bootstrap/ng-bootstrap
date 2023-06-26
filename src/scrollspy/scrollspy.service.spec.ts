import { NgbScrollSpyService } from './scrollspy.service';
import { inject } from '@angular/core/testing';
import { NgbScrollSpyConfig } from './scrollspy-config';
import { firstValueFrom } from 'rxjs';
import { isBrowserVisible } from '../test/common';

const appendFragmentToDOM = (id = 'test') => {
	const el = document.createElement('div');
	el.setAttribute('id', id);
	document.body.appendChild(el);
	return el;
};

const removeFragmentFromDOM = (id = 'test') => document.getElementById(id)?.remove();

describe('ScrollSpy service (mocked)', () => {
	let mockObserver;
	let callSpy: jasmine.Spy;
	let scrollSpy: NgbScrollSpyService;
	let fragment: HTMLElement;

	beforeEach(inject([NgbScrollSpyService], (s: NgbScrollSpyService) => {
		mockObserver = jasmine.createSpyObj('observer', ['observe', 'unobserve', 'disconnect']) as any;
		callSpy = spyOn(window, 'IntersectionObserver').and.returnValue(mockObserver);
		scrollSpy = s;
		fragment = appendFragmentToDOM();
	}));

	afterEach(() => {
		scrollSpy.stop();
		removeFragmentFromDOM();
	});

	it('should start the scrollspy', () => {
		scrollSpy.start();
		expect(callSpy).toHaveBeenCalledTimes(1);
		expect(callSpy.calls.mostRecent().args[1]).toEqual({ root: document });
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
		expect(callSpy.calls.mostRecent().args[1]).toEqual({ root: fragment, rootMargin: '1px', threshold: [0.5] });
	});

	it('should disconnect from the intersection observer', () => {
		scrollSpy.start();
		scrollSpy.stop();
		expect(mockObserver.disconnect).toHaveBeenCalledTimes(1);
	});

	it('should observe fragments registered before starting', () => {
		const one = appendFragmentToDOM('one');
		const two = appendFragmentToDOM('two');
		scrollSpy.observe(one);
		scrollSpy.observe('two');
		scrollSpy.observe(fragment);
		scrollSpy.start();

		expect(mockObserver.observe).toHaveBeenCalledTimes(3);
		expect(mockObserver.observe).toHaveBeenCalledWith(one);
		expect(mockObserver.observe).toHaveBeenCalledWith(two);
		expect(mockObserver.observe).toHaveBeenCalledWith(fragment);

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
		expect(mockObserver.observe).toHaveBeenCalledTimes(3);
		expect(mockObserver.observe).toHaveBeenCalledWith(one);
		expect(mockObserver.observe).toHaveBeenCalledWith(two);
		expect(mockObserver.observe).toHaveBeenCalledWith(fragment);

		removeFragmentFromDOM('one');
		removeFragmentFromDOM('two');
	});

	it('should register new fragments', () => {
		scrollSpy.start();
		scrollSpy.observe(fragment);
		expect(mockObserver.observe).toHaveBeenCalledWith(fragment);
	});

	it('should register new fragments by id', () => {
		scrollSpy.start();
		scrollSpy.observe(fragment.id);
		expect(mockObserver.observe).toHaveBeenCalledWith(fragment);
	});

	it('should not register same fragments twice', () => {
		scrollSpy.start();
		scrollSpy.observe(fragment);
		scrollSpy.observe(fragment);
		expect(mockObserver.observe).toHaveBeenCalledTimes(1);
		expect(mockObserver.observe).toHaveBeenCalledWith(fragment);
	});

	it('should not register non-existing fragments', () => {
		scrollSpy.start();
		scrollSpy.observe('blah');
		expect(mockObserver.observe).not.toHaveBeenCalled();
	});

	it('should unregister existing fragments', () => {
		scrollSpy.start();
		scrollSpy.observe(fragment);
		scrollSpy.unobserve(fragment);
		expect(mockObserver.unobserve).toHaveBeenCalledWith(fragment);
	});

	it('should unregister existing fragments by id', () => {
		scrollSpy.start();
		scrollSpy.observe(fragment);
		scrollSpy.unobserve(fragment.id);
		expect(mockObserver.unobserve).toHaveBeenCalledWith(fragment);
	});

	it('should not unregister non-existing fragments', () => {
		scrollSpy.start();
		scrollSpy.unobserve('blah');
		expect(mockObserver.unobserve).not.toHaveBeenCalled();
	});

	it('should scroll to a fragment by id', () => {
		const spy = spyOn(document.documentElement, 'scrollTo') as any;

		scrollSpy.start();
		scrollSpy.scrollTo(fragment.id);
		expect(spy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
	});

	it('should scroll only to an exising fragment', () => {
		const spy = spyOn(document.documentElement, 'scrollTo') as any;

		scrollSpy.start();
		scrollSpy.scrollTo('blah');
		expect(spy).not.toHaveBeenCalled();
	});

	it('should allow to scroll to a fragment with options provided at creation time', () => {
		const spy = spyOn(document.documentElement, 'scrollTo') as any;

		scrollSpy.start({ scrollBehavior: 'auto' });
		scrollSpy.scrollTo(fragment.id);
		expect(spy).toHaveBeenCalledWith({ top: 0, behavior: 'auto' });
	});

	it('should allow to scroll to a fragment with options', () => {
		const spy = spyOn(document.documentElement, 'scrollTo') as any;

		scrollSpy.start();
		scrollSpy.scrollTo(fragment.id, { behavior: 'auto' });
		expect(spy).toHaveBeenCalledWith({ top: 0, behavior: 'auto' });
	});

	it('should allow changeing scrolling options from the configuration', inject(
		[NgbScrollSpyConfig],
		(config: NgbScrollSpyConfig) => {
			const spy = spyOn(document.documentElement, 'scrollTo') as any;

			expect(config.scrollBehavior).toBe('smooth');
			config.scrollBehavior = 'auto';

			scrollSpy.start();
			scrollSpy.scrollTo(fragment.id);
			expect(spy).toHaveBeenCalledWith({ top: 0, behavior: 'auto' });
		},
	));
});

if (isBrowserVisible('scrollspy-service')) {
	describe('ScrollSpy service', () => {
		it('should allow overriding scrollspy logic via configuration', inject(
			[NgbScrollSpyService, NgbScrollSpyConfig],
			async (scrollSpy: NgbScrollSpyService, config: NgbScrollSpyConfig) => {
				appendFragmentToDOM('one');

				config.processChanges = (_, changeActive) => changeActive('two');

				scrollSpy.start({
					fragments: ['one'],
				});

				expect(await firstValueFrom(scrollSpy.active$)).toBe('two');

				removeFragmentFromDOM('one');
			},
		));

		it('should allow overriding scrollspy logic', inject(
			[NgbScrollSpyService],
			async (scrollSpy: NgbScrollSpyService) => {
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
			},
		));

		it('should update currently active fragment', inject(
			[NgbScrollSpyService],
			async (scrollSpy: NgbScrollSpyService) => {
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
			},
		));

		it('should use provided change detector and initial fragment options', inject(
			[NgbScrollSpyService],
			async (scrollSpy: NgbScrollSpyService) => {
				const fragment1 = appendFragmentToDOM('one');
				const fragment2 = appendFragmentToDOM('two');

				const cdSpy = jasmine.createSpyObj('ChangeDetectorRef', ['markForCheck']);

				scrollSpy.start({ changeDetectorRef: cdSpy, initialFragment: 'two' });

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
			},
		));
	});
}
