import { Component, inject } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { NgbScrollSpy, NgbScrollSpyItem, NgbScrollSpyModule, NgbScrollSpyService } from './scrollspy.module';
import { By } from '@angular/platform-browser';
import { createGenericTestComponent, isBrowserVisible } from '../test/common';
import { firstValueFrom } from 'rxjs';
import { AsyncPipe } from '@angular/common';

const createTestComponent = (html: string) =>
	createGenericTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;

describe('ScrollSpy Directives (mocked service integration)', () => {
	let mockObserver;
	let callSpy: jasmine.Spy;

	beforeEach(() => {
		mockObserver = jasmine.createSpyObj('observer', ['observe', 'unobserve', 'disconnect']) as any;
		callSpy = spyOn(window, 'IntersectionObserver').and.returnValue(mockObserver);
	});

	it('should start scrollspy with no fragments', () => {
		createTestComponent(`<div class="container" ngbScrollSpy></div>`);

		expect(callSpy).toHaveBeenCalledTimes(1);
		expect(mockObserver.observe).not.toHaveBeenCalled();
	});

	it('should start simple scrollspy', () => {
		let { debugElement } = createTestComponent(`
			<div class="container" ngbScrollSpy>
				<div ngbScrollSpyFragment="one">one</div>
				<div ngbScrollSpyFragment="two">two</div>
			</div>
		`);

		let scrollSpy = debugElement.query(By.directive(NgbScrollSpy)).injector.get(NgbScrollSpy);

		// initial values
		expect(scrollSpy.scrollBehavior).toBeUndefined(); // config used in service
		expect(scrollSpy.rootMargin).toBeUndefined();
		expect(scrollSpy.active).toBe('');

		// creating service and adding 2 fragments
		expect(callSpy).toHaveBeenCalledTimes(1);
		expect(mockObserver.observe).toHaveBeenCalledTimes(2);
	});

	it('should allow using items with global service', () => {
		let fixture = createTestComponent(`
			<button ngbScrollSpyItem="one"></button>
			<div id="one">fragment</div>
		`);

		let { rootScrollSpyService } = fixture.componentInstance;
		rootScrollSpyService.observe('one');
		rootScrollSpyService.start();

		let item = fixture.nativeElement.querySelector('button');
		let fragment = fixture.nativeElement.querySelector('#one');

		let spy = spyOn(document.documentElement, 'scrollTo') as any;

		// creating service and adding a fragment
		expect(callSpy).toHaveBeenCalledTimes(1);
		expect(mockObserver.observe).toHaveBeenCalledTimes(1);

		item.click();
		expect(spy).toHaveBeenCalledWith({ top: fragment.offsetTop, behavior: 'smooth' });
	});

	it('should scroll to fragments when clicking on items', () => {
		let fixture = createTestComponent(`
			<button class="item" [ngbScrollSpyItem]="[s, 'one']"></button>
			<div class="container" ngbScrollSpy #s="ngbScrollSpy">
				<div>spacer</div>
				<div class="fragment" ngbScrollSpyFragment="one">one</div>
			</div>
		`);

		let item = fixture.nativeElement.querySelector('.item');
		let fragment = fixture.nativeElement.querySelector('.fragment');
		let container = fixture.nativeElement.querySelector('.container');

		let spy = spyOn(container, 'scrollTo') as any;

		item.click();
		expect(spy).toHaveBeenCalledWith({ top: fragment.offsetTop - container.offsetTop, behavior: 'smooth' });
	});

	it('should scroll to fragments when clicking on items with different arguments', () => {
		let { debugElement, nativeElement } = createTestComponent(`
			<button [ngbScrollSpyItem]="[s, 'one']"></button>
			<div class="container" ngbScrollSpy #s="ngbScrollSpy">
				<div>spacer</div>
				<div class="fragment" ngbScrollSpyFragment="one">one</div>
			</div>
		`);

		let fragment = nativeElement.querySelector('.fragment');
		let container = nativeElement.querySelector('.container');

		let scrollSpy = debugElement.query(By.directive(NgbScrollSpy)).injector.get(NgbScrollSpy);
		let scrollSpyItem = debugElement.query(By.directive(NgbScrollSpyItem)).injector.get(NgbScrollSpyItem);

		let spy = spyOn(container, 'scrollTo') as any;

		scrollSpyItem.scrollTo({ behavior: 'auto' });
		expect(spy).toHaveBeenCalledWith({ top: fragment.offsetTop - container.offsetTop, behavior: 'auto' });

		scrollSpyItem.scrollTo({ behavior: 'auto' });
		expect(spy).toHaveBeenCalledWith({ top: fragment.offsetTop - container.offsetTop, behavior: 'auto' });

		scrollSpy.scrollTo('one', { behavior: 'auto' });
		expect(spy).toHaveBeenCalledWith({ top: fragment.offsetTop - container.offsetTop, behavior: 'auto' });
	});

	it('should scroll to fragments when clicking on items (fragment input)', () => {
		let { nativeElement } = createTestComponent(`
			<button class="item" [ngbScrollSpyItem]="s" fragment="one"></button>
			<div class="container" ngbScrollSpy #s="ngbScrollSpy">
				<div>spacer</div>
				<div class="fragment" ngbScrollSpyFragment="one">one</div>
			</div>
		`);

		let item = nativeElement.querySelector('.item');
		let fragment = nativeElement.querySelector('.fragment');
		let container = nativeElement.querySelector('.container');

		let spy = spyOn(container, 'scrollTo') as any;

		item.click();
		expect(spy).toHaveBeenCalledWith({ top: fragment.offsetTop - container.offsetTop, behavior: 'smooth' });
	});

	it('should pass scrollspy inputs to the service', async () => {
		let { debugElement, nativeElement } = createTestComponent(`
			<div class="container" ngbScrollSpy rootMargin='16px' scrollBehavior='auto' [threshold]='[2]'>
				<div class="fragment one" ngbScrollSpyFragment="one">one</div>
				<div class="fragment two" ngbScrollSpyFragment="two">two</div>
			</div>
		`);

		let scrollSpy = debugElement.query(By.directive(NgbScrollSpy)).injector.get(NgbScrollSpy);
		let fragmentOne = nativeElement.querySelector('.fragment.one');
		let container = nativeElement.querySelector('.container');

		let spy = spyOn(container, 'scrollTo') as any;

		// rootMargin and scrollBehavior are passed to the service
		expect(callSpy).toHaveBeenCalledTimes(1);
		expect(callSpy.calls.mostRecent().args[1].rootMargin).toBe('16px');
		expect(callSpy.calls.mostRecent().args[1].threshold).toEqual([2]);

		scrollSpy.scrollTo('one');

		expect(spy).toHaveBeenCalledWith({ top: fragmentOne.offsetTop - container.offsetTop, behavior: 'auto' });
	});
});

if (isBrowserVisible('ScrollSpy directives')) {
	describe('ScrollSpy Directives', () => {
		it('should start an empty scrollspy', () => {
			let { debugElement } = createTestComponent(`<div ngbScrollSpy></div>`);
			let scrollSpy = debugElement.query(By.directive(NgbScrollSpy)).injector.get(NgbScrollSpy);
			expect(scrollSpy.active).toBe('');
		});

		it('should start a scrollspy with one element', async () => {
			let { debugElement } = createTestComponent(`
				<div ngbScrollSpy>
					<div ngbScrollSpyFragment="one">one</div>
				</div>
			`);
			let scrollSpy = debugElement.query(By.directive(NgbScrollSpy)).injector.get(NgbScrollSpy);

			expect(scrollSpy.active).toBe('');
			expect(await firstValueFrom(scrollSpy.active$)).toBe('one');
		});

		it('should handle the case where first fragment might have something before it', async () => {
			let { debugElement, nativeElement } = createTestComponent(`
			<div class="container" ngbScrollSpy style='height: 200px;'>
				<div style='height: 500px;'>spacer</div>
				<div ngbScrollSpyFragment="one">fragment</div>
			</div>
		`);

			let scrollSpy = debugElement.query(By.directive(NgbScrollSpy)).injector.get(NgbScrollSpy);
			let container = nativeElement.querySelector('.container');

			// initially
			expect(scrollSpy.active).toBe('');

			// showing one
			scrollSpy.scrollTo('one');
			expect(await firstValueFrom(scrollSpy.active$)).toBe('one');

			// showing none
			container.scrollTop = 0;
			expect(await firstValueFrom(scrollSpy.active$)).toBe('');
		});

		it('should handle the case when scrolling in-between fragments', async () => {
			let { debugElement, nativeElement } = createTestComponent(`
			<style>
				.fragment {
					height: 20px;
					margin-bottom: 1000px;
				}
			</style>
			<div class="container" ngbScrollSpy style='height: 100px;'>
				<div class='fragment' ngbScrollSpyFragment="one">fragment</div>
				<div class='fragment' ngbScrollSpyFragment="two">fragment</div>
				<div class='fragment' ngbScrollSpyFragment="three">fragment</div>
			</div>
		`);

			let scrollSpy = debugElement.query(By.directive(NgbScrollSpy)).injector.get(NgbScrollSpy);
			let container = nativeElement.querySelector('.container');

			// initially
			expect(scrollSpy.active).toBe('');
			expect(await firstValueFrom(scrollSpy.active$)).toBe('one');

			// scrolling to two
			container.scrollTop = 1000;
			expect(await firstValueFrom(scrollSpy.active$)).toBe('two');

			// back to one
			container.scrollTop = 500;
			expect(await firstValueFrom(scrollSpy.active$)).toBe('one');

			// scrolling to two
			container.scrollTop = 1000;
			expect(await firstValueFrom(scrollSpy.active$)).toBe('two');

			// still two
			container.scrollTop = 1500;
			expect(await firstValueFrom(scrollSpy.active$)).toBe('two');
		});

		it('should change active value via imperative APIs', async () => {
			let fixture = createTestComponent(`
			<span class="item one" [ngbScrollSpyItem]="s" fragment="one"></span>
			<span class="item two" [ngbScrollSpyItem]="[s, 'two']"></span>
			<span class="item three" [ngbScrollSpyItem]="[s, 'three']" #i="ngbScrollSpyItem"></span>
			<div class="container" ngbScrollSpy #s="ngbScrollSpy">
				<div>spacer</div>
				<div class="fragment one" ngbScrollSpyFragment="one">one</div>
				<div class="fragment two" ngbScrollSpyFragment="two">two</div>
				<div class="fragment three" ngbScrollSpyFragment="three">three</div>
			</div>
			<button	class='to-two' (click)="s.scrollTo('two')"></button>
			<button	class='to-three' (click)="i.scrollTo()"></button>

			<span class='three-is-active'>{{ i.isActive() }}</span>
			<span class='scrollspy-active'>{{ s.active }}</span>
		`);

			let { debugElement, nativeElement } = fixture;
			let scrollSpy = debugElement.query(By.directive(NgbScrollSpy)).injector.get(NgbScrollSpy);

			let itemOne = nativeElement.querySelector('.item.one');
			let scrollToTwo = nativeElement.querySelector('.to-two');
			let scrollToThree = nativeElement.querySelector('.to-three');
			let threeIsActive = nativeElement.querySelector('.three-is-active');
			let scrollSpyActive = nativeElement.querySelector('.scrollspy-active');

			expect(itemOne).not.toHaveClass('active');

			// one is active by default
			expect(await firstValueFrom(scrollSpy.active$)).toBe('one');
			expect(scrollSpy.active).toBe('one');
			fixture.detectChanges();
			expect(itemOne).toHaveClass('active');

			// scroll to two
			scrollToTwo.click();
			expect(await firstValueFrom(scrollSpy.active$)).toBe('two');
			expect(scrollSpy.active).toBe('two');
			fixture.detectChanges();
			expect(scrollSpyActive.textContent).toBe('two');
			expect(threeIsActive.textContent).toBe('false');

			// scroll to three
			scrollToThree.click();
			expect(await firstValueFrom(scrollSpy.active$)).toBe('three');
			expect(scrollSpy.active).toBe('three');
			fixture.detectChanges();
			expect(scrollSpyActive.textContent).toBe('three');
			expect(threeIsActive.textContent).toBe('true');
		});

		it('should change active value via [active] binding', async () => {
			let fixture = createTestComponent(`
			<div class="container" ngbScrollSpy active='two'>
				<div class="fragment one" ngbScrollSpyFragment="one">one</div>
				<div class="fragment two" ngbScrollSpyFragment="two">two</div>
			</div>
		`);

			let { debugElement } = fixture;
			let scrollSpy = debugElement.query(By.directive(NgbScrollSpy)).injector.get(NgbScrollSpy);

			expect(await firstValueFrom(scrollSpy.active$)).toBe('two');

			scrollSpy.active = 'one';
			expect(await firstValueFrom(scrollSpy.active$)).toBe('one');
		});

		it('should update active when scroll position changes', async () => {
			let fixture = createTestComponent(`
			<style>
			  .container {
					height: 100px;
			  }
				.container > div {
					height: 30px;
					margin-bottom: 100px;
				}
			</style>
			<div class="container" ngbScrollSpy>
				<div ngbScrollSpyFragment="one">one</div>
				<div ngbScrollSpyFragment="two">two</div>
				<div ngbScrollSpyFragment="three">three</div>
			</div>
		`);

			let { debugElement, nativeElement } = fixture;
			let scrollSpy = debugElement.query(By.directive(NgbScrollSpy)).injector.get(NgbScrollSpy);
			let container = nativeElement.querySelector('.container') as HTMLElement;

			expect(await firstValueFrom(scrollSpy.active$)).toBe('one');
			expect(scrollSpy.active).toBe('one');

			container.scrollTop = 100;
			expect(await firstValueFrom(scrollSpy.active$)).toBe('two');
			expect(scrollSpy.active).toBe('two');

			container.scrollTop = 200;
			expect(await firstValueFrom(scrollSpy.active$)).toBe('three');
			expect(scrollSpy.active).toBe('three');
		});

		it('should change active fragment/active class when clicking on items', async () => {
			let fixture = createTestComponent(`
			<style>
			  .container {
					height: 100px;
					padding: 0;
			  }
				.container > div {
					height: 30px;
					margin-bottom: 100px;
				}
			</style>
			<span [ngbScrollSpyItem]="[s, 'one']">one</span>
			<span [ngbScrollSpyItem]="[s, 'two']">two</span>
			<span [ngbScrollSpyItem]="[s, 'three']">three</span>
			<div class="container" ngbScrollSpy #s="ngbScrollSpy">
				<div ngbScrollSpyFragment="one">one</div>
				<div ngbScrollSpyFragment="two">two</div>
				<div ngbScrollSpyFragment="three">three</div>
			</div>
		`);

			let { debugElement, nativeElement } = fixture;

			let scrollSpy = debugElement.query(By.directive(NgbScrollSpy)).injector.get(NgbScrollSpy);
			let [one, two, three] = nativeElement.querySelectorAll('span') as HTMLElement[];

			scrollSpy.scrollBehavior = 'auto';
			fixture.detectChanges();

			expect(scrollSpy.active).toBe('');
			expect(await firstValueFrom(scrollSpy.active$)).toBe('one');

			two.click();
			expect(scrollSpy.active).toBe('one');
			expect(await firstValueFrom(scrollSpy.active$)).toBe('two');
			fixture.detectChanges();
			expect(two).toHaveClass('active');

			three.click();
			expect(scrollSpy.active).toBe('two');
			expect(await firstValueFrom(scrollSpy.active$)).toBe('three');
			fixture.detectChanges();
			expect(three).toHaveClass('active');

			// back to one
			one.click();
			expect(scrollSpy.active).toBe('three');
			expect(await firstValueFrom(scrollSpy.active$)).toBe('one');
			fixture.detectChanges();
			expect(one).toHaveClass('active');
		});

		it('should change active value hierarchically', async () => {
			let fixture = createTestComponent(`
			<div class="menu" [ngbScrollSpyMenu]="s">
				<span class="one" ngbScrollSpyItem fragment="one"></span>
				<span class="two" [ngbScrollSpyItem]="[s, 'two']"></span>
				<div class='children'>
					<span class="three" [ngbScrollSpyItem]="[s, 'three', 'two']"></span>
					<span class="four" [ngbScrollSpyItem]="[s, 'four']" parent="two"></span>
					<span class="five" ngbScrollSpyItem fragment="five" parent="two"></span>
				</div>
			</div>
			<div class="container" ngbScrollSpy #s="ngbScrollSpy">
				<div>spacer</div>
				<div ngbScrollSpyFragment="one">one</div>
				<div ngbScrollSpyFragment="two">two</div>
				<div ngbScrollSpyFragment="three">three</div>
				<div ngbScrollSpyFragment="four">four</div>
				<div ngbScrollSpyFragment="five">five</div>
			</div>
		`);

			let { debugElement, nativeElement } = fixture;

			let scrollSpy = debugElement.query(By.directive(NgbScrollSpy)).injector.get(NgbScrollSpy);
			let [one, two, three, four, five] = nativeElement.querySelectorAll('span') as HTMLElement[];

			expect(one).not.toHaveClass('active');

			// one is active by default
			expect(await firstValueFrom(scrollSpy.active$)).toBe('one');
			fixture.detectChanges();
			expect(one).toHaveClass('active');

			// scroll to two
			scrollSpy.scrollTo('two');
			expect(await firstValueFrom(scrollSpy.active$)).toBe('two');
			fixture.detectChanges();
			expect(two).toHaveClass('active');
			expect(three).not.toHaveClass('active');
			expect(four).not.toHaveClass('active');
			expect(five).not.toHaveClass('active');

			// scroll to three
			scrollSpy.scrollTo('three');
			expect(await firstValueFrom(scrollSpy.active$)).toBe('three');
			fixture.detectChanges();
			expect(two).toHaveClass('active');
			expect(three).toHaveClass('active');
			expect(four).not.toHaveClass('active');
			expect(five).not.toHaveClass('active');

			// scroll to four
			scrollSpy.scrollTo('four');
			expect(await firstValueFrom(scrollSpy.active$)).toBe('four');
			fixture.detectChanges();
			expect(two).toHaveClass('active');
			expect(three).not.toHaveClass('active');
			expect(four).toHaveClass('active');
			expect(five).not.toHaveClass('active');

			// scroll to five
			scrollSpy.scrollTo('five');
			expect(await firstValueFrom(scrollSpy.active$)).toBe('five');
			fixture.detectChanges();
			expect(two).toHaveClass('active');
			expect(three).not.toHaveClass('active');
			expect(four).not.toHaveClass('active');
			expect(five).toHaveClass('active');
		});

		it('should allow overriding scrollspy logic', async () => {
			let { debugElement } = createTestComponent(`
				<div class="container" ngbScrollSpy [processChanges]='processChanges'>
					<div ngbScrollSpyFragment="one">fragment</div>
				</div>
			`);
			let scrollSpy = debugElement.query(By.directive(NgbScrollSpy)).injector.get(NgbScrollSpy);
			expect(scrollSpy.active).toBe('');

			expect(await firstValueFrom(scrollSpy.active$)).toBe('overridden!');
		});
	});
}

@Component({
	standalone: true,
	imports: [NgbScrollSpyModule, AsyncPipe],
	template: ``,
})
class TestComponent {
	rootScrollSpyService = inject(NgbScrollSpyService);
	active = 'two';
	visible = true;
	processChanges = (_: any, changeActive: (active: string) => void) => {
		changeActive('overridden!');
	};
}
