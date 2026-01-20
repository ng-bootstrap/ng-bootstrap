import { TestBed, ComponentFixture } from '@angular/core/testing';
import { createGenericTestComponent, isBrowserVisible } from '../test/common';

import { By } from '@angular/platform-browser';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NgbCarousel, NgbSlideEvent, NgbSlideEventSource, NgbSingleSlideEvent, NgbSlide } from './carousel';
import { NgbCarouselConfig } from './carousel-config';
import { NgbConfig } from '@ng-bootstrap/ng-bootstrap/config';
import { NgbConfigAnimation } from '../test/ngb-config-animation';
import { NgbSlideEventDirection } from './carousel-transition';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const createTestComponent = (html: string, detectChanges = true) =>
	createGenericTestComponent(html, TestComponent, detectChanges) as ComponentFixture<TestComponent>;

const getSlideElements = (el: HTMLElement) => Array.from(el.querySelectorAll<HTMLButtonElement>('.carousel-item'));
const getIndicatorElements = (el: HTMLElement) =>
	Array.from(el.querySelectorAll<HTMLButtonElement>('.carousel-indicators > button[data-bs-target]'));
const getArrowElements = (el: HTMLElement) =>
	Array.from(el.querySelectorAll<HTMLButtonElement>('.carousel-inner ~ button'));

function expectActiveSlides(nativeEl: HTMLDivElement, active: boolean[]) {
	const slideElms = getSlideElements(nativeEl);
	const indicatorElms = getIndicatorElements(nativeEl);

	expect(slideElms.length).toBe(active.length);
	expect(indicatorElms.length).toBe(active.length);

	for (let i = 0; i < active.length; i++) {
		if (active[i]) {
			expect(slideElms[i]).toHaveCssClass('active');
			expect(indicatorElms[i]).toHaveCssClass('active');
			expect(indicatorElms[i].getAttribute('aria-selected')).toBe('true');
		} else {
			expect(slideElms[i]).not.toHaveCssClass('active');
			expect(indicatorElms[i]).not.toHaveCssClass('active');
			expect(indicatorElms[i].getAttribute('aria-selected')).toBe('false');
		}
	}
}

describe.only('ngb-carousel', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('should initialize inputs with default values', () => {
		const defaultConfig = TestBed.inject(NgbCarouselConfig);
		const carousel = TestBed.createComponent(NgbCarousel).componentInstance;

		expect(carousel.interval).toBe(defaultConfig.interval);
		expect(carousel.wrap).toBe(defaultConfig.wrap);
		expect(carousel.keyboard).toBe(defaultConfig.keyboard);
		expect(carousel.pauseOnHover).toBe(defaultConfig.pauseOnHover);
		expect(carousel.pauseOnFocus).toBe(defaultConfig.pauseOnFocus);
		expect(carousel.showNavigationIndicators).toBe(defaultConfig.showNavigationIndicators);
		expect(carousel.showNavigationArrows).toBe(defaultConfig.showNavigationArrows);
	});

	it('should render slides and navigation indicators', () => {
		const html = `
      <ngb-carousel>
        <ng-template ngbSlide>foo</ng-template>
        <ng-template ngbSlide>bar</ng-template>
      </ngb-carousel>
    `;
		const fixture = createTestComponent(html);

		const slideElms = getSlideElements(fixture.nativeElement);
		expect(slideElms.length).toBe(2);
		expect(slideElms[0].textContent).toMatch(/foo/);
		expect(slideElms[1].textContent).toMatch(/bar/);

		expect(getIndicatorElements(fixture.nativeElement).length).toBe(2);
		expect(getArrowElements(fixture.nativeElement).length).toBe(2);
	});

	it('should mark the first slide as active by default', () => {
		const html = `
      <ngb-carousel>
        <ng-template ngbSlide>foo</ng-template>
        <ng-template ngbSlide>bar</ng-template>
      </ngb-carousel>
    `;

		const fixture = createTestComponent(html);
		expectActiveSlides(fixture.nativeElement, [true, false]);
	});

	it('should work without any slides', async () => {
		const fixture = createTestComponent(`<ngb-carousel [interval]="1000"></ngb-carousel>`);

		vi.advanceTimersByTime(1001);
		await fixture.whenStable();

		expect(fixture.nativeElement.querySelector('ngb-carousel')).toBeTruthy();
		expect(getSlideElements(fixture.nativeElement).length).toBe(0);
	});

	it('should mark the requested slide as active', async () => {
		const html = `
       <ngb-carousel [activeId]="activeSlideId()">
         <ng-template ngbSlide id="1">foo</ng-template>
         <ng-template ngbSlide id="2">bar</ng-template>
       </ngb-carousel>
     `;

		// set the second slide active (instead of the first one by default), before the first change detection
		const fixture = createTestComponent(html, false);

		fixture.componentInstance.activeSlideId.set('2');
		await fixture.whenStable();
		expectActiveSlides(fixture.nativeElement, [false, true]);
	});

	it('should auto-correct when slide index is undefined', () => {
		const html = `
            <ngb-carousel [activeId]="doesntExist">
              <ng-template ngbSlide>foo</ng-template>
              <ng-template ngbSlide>bar</ng-template>
            </ngb-carousel>
          `;

		const fixture = createTestComponent(html);
		expectActiveSlides(fixture.nativeElement, [true, false]);
	});

	it('should change slide on prev/next API calls', async () => {
		const html = `
      <ngb-carousel #c [interval]="0">
        <ng-template ngbSlide>foo</ng-template>
        <ng-template ngbSlide>bar</ng-template>
        <ng-template ngbSlide id="s3">baz</ng-template>
      </ngb-carousel>
      <button id="next" (click)="c.next()">Next</button>
      <button id="prev" (click)="c.prev()">Prev</button>
      <button id="select" (click)="c.select('s3')">Select 3</button>
    `;

		const fixture = createTestComponent(html);
		const next = fixture.nativeElement.querySelector('#next');
		const prev = fixture.nativeElement.querySelector('#prev');
		const select = fixture.nativeElement.querySelector('#select');

		expectActiveSlides(fixture.nativeElement, [true, false, false]);

		next.click();
		await fixture.whenStable();
		expectActiveSlides(fixture.nativeElement, [false, true, false]);

		prev.click();
		await fixture.whenStable();
		expectActiveSlides(fixture.nativeElement, [true, false, false]);

		select.click();
		await fixture.whenStable();
		expectActiveSlides(fixture.nativeElement, [false, false, true]);
	});

	it('should pause/resume slide change on API calls', async () => {
		const html = `
     <ngb-carousel #c [interval]="1000">
       <ng-template ngbSlide>foo</ng-template>
       <ng-template ngbSlide>bar</ng-template>
     </ngb-carousel>
     <button id="pause" (click)="c.pause()">Next</button>
     <button id="cycle" (click)="c.cycle()">Prev</button>
   `;

		const fixture = createTestComponent(html);
		const pause = fixture.nativeElement.querySelector('#pause');
		const cycle = fixture.nativeElement.querySelector('#cycle');

		expectActiveSlides(fixture.nativeElement, [true, false]);

		vi.advanceTimersByTime(1000);
		await fixture.whenStable();
		expectActiveSlides(fixture.nativeElement, [false, true]);

		pause.click();
		vi.advanceTimersByTime(1000);
		await fixture.whenStable();
		expectActiveSlides(fixture.nativeElement, [false, true]);

		cycle.click();
		vi.advanceTimersByTime(1000);
		await fixture.whenStable();
		expectActiveSlides(fixture.nativeElement, [true, false]);
	});

	it('should not resume without call to cycle()', async () => {
		const html = `
    <ngb-carousel #c [interval]="1000" [pauseOnFocus]="false" (slide)="carouselSlideCallBack($event)">
      <ng-template ngbSlide>foo</ng-template>
      <ng-template ngbSlide>bar</ng-template>
      <ng-template ngbSlide>third</ng-template>
    </ngb-carousel>
    <button id="next" (click)="c.next()">Next</button>
    <button id="pause" (click)="c.pause()">Pause</button>
    <button id="cycle" (click)="c.cycle()">Cycle</button>
  `;

		const fixture = createTestComponent(html);
		const spyCallBack = vi.spyOn(fixture.componentInstance, 'carouselSlideCallBack');
		const carouselDebugEl = fixture.debugElement.query(By.directive(NgbCarousel));
		const indicatorElms = getIndicatorElements(fixture.nativeElement);
		const [prevControlElm, nextControlElm] = getArrowElements(fixture.nativeElement);
		const next = fixture.nativeElement.querySelector('#next');
		const pause = fixture.nativeElement.querySelector('#pause');
		const cycle = fixture.nativeElement.querySelector('#cycle');

		expectActiveSlides(fixture.nativeElement, [true, false, false]);

		vi.advanceTimersByTime(1000);
		await fixture.whenStable();
		expect(spyCallBack).toHaveBeenCalledWith(
			expect.objectContaining({ paused: false, source: NgbSlideEventSource.TIMER }),
		);
		spyCallBack.mockClear();
		expectActiveSlides(fixture.nativeElement, [false, true, false]);

		pause.click();
		vi.advanceTimersByTime(1000);
		await fixture.whenStable();
		expect(spyCallBack).not.toHaveBeenCalled();
		expectActiveSlides(fixture.nativeElement, [false, true, false]);

		indicatorElms[0].click();
		await fixture.whenStable();
		expect(spyCallBack).toHaveBeenCalledWith(
			expect.objectContaining({ paused: true, source: NgbSlideEventSource.INDICATOR }),
		);
		spyCallBack.mockClear();
		expectActiveSlides(fixture.nativeElement, [true, false, false]);
		vi.advanceTimersByTime(1000);
		await fixture.whenStable();
		expect(spyCallBack).not.toHaveBeenCalled();
		expectActiveSlides(fixture.nativeElement, [true, false, false]);

		nextControlElm.click();
		await fixture.whenStable();
		expect(spyCallBack).toHaveBeenCalledWith(
			expect.objectContaining({ paused: true, source: NgbSlideEventSource.ARROW_RIGHT }),
		);
		spyCallBack.mockClear();
		expectActiveSlides(fixture.nativeElement, [false, true, false]);
		vi.advanceTimersByTime(1000);
		await fixture.whenStable();
		expect(spyCallBack).not.toHaveBeenCalled();
		expectActiveSlides(fixture.nativeElement, [false, true, false]);

		prevControlElm.click();
		await fixture.whenStable();
		expect(spyCallBack).toHaveBeenCalledWith(
			expect.objectContaining({ paused: true, source: NgbSlideEventSource.ARROW_LEFT }),
		);
		spyCallBack.mockClear();
		expectActiveSlides(fixture.nativeElement, [true, false, false]);
		vi.advanceTimersByTime(1000);
		await fixture.whenStable();
		expect(spyCallBack).not.toHaveBeenCalled();
		expectActiveSlides(fixture.nativeElement, [true, false, false]);

		next.click();
		await fixture.whenStable();
		expect(spyCallBack).toHaveBeenCalledWith(expect.objectContaining({ paused: true }));
		spyCallBack.mockClear();
		expectActiveSlides(fixture.nativeElement, [false, true, false]);
		vi.advanceTimersByTime(1000);
		await fixture.whenStable();
		expect(spyCallBack).not.toHaveBeenCalled();
		expectActiveSlides(fixture.nativeElement, [false, true, false]);

		carouselDebugEl.triggerEventHandler('mouseenter', {});
		await fixture.whenStable();
		carouselDebugEl.triggerEventHandler('mouseleave', {});
		await fixture.whenStable();
		vi.advanceTimersByTime(1000);
		await fixture.whenStable();
		expect(spyCallBack).not.toHaveBeenCalled();
		expectActiveSlides(fixture.nativeElement, [false, true, false]);

		cycle.click();
		vi.advanceTimersByTime(1000);
		await fixture.whenStable();
		expect(spyCallBack).toHaveBeenCalledWith(
			expect.objectContaining({ paused: false, source: NgbSlideEventSource.TIMER }),
		);
		expectActiveSlides(fixture.nativeElement, [false, false, true]);
	});

	it('should mark component for check for API calls', async () => {
		const html = `
      <ngb-carousel #c [interval]="0">
        <ng-template ngbSlide>foo</ng-template>
        <ng-template ngbSlide>bar</ng-template>
        @if (addNewSlide) {
        	<ng-template ngbSlide>baz</ng-template>
        }
      </ngb-carousel>
      <button id="next" (click)="c.next(); addNewSlide = true">Next</button>
    `;

		const fixture = createTestComponent(html);
		const next = fixture.nativeElement.querySelector('#next');

		expectActiveSlides(fixture.nativeElement, [true, false]);

		next.click();
		await fixture.whenStable();
		expectActiveSlides(fixture.nativeElement, [false, true, false]);
	});

	it('should mark component for check when slides change', async () => {
		const html = `
      <ngb-carousel #c [interval]="0">
      	@for (s of slides(); track $index) {
					<ng-template ngbSlide>
						<div class="slide">{{ s }}</div>
					</ng-template>
        }
      </ngb-carousel>
    `;

		function getSlidesText(element: HTMLElement): string[] {
			return Array.from(element.querySelectorAll('.carousel-item .slide')).map((el: HTMLElement) => el.innerHTML);
		}

		const fixture = createTestComponent(html);
		expect(getSlidesText(fixture.nativeElement)).toEqual(['a', 'b']);

		fixture.componentInstance.slides.set(['c', 'd']);
		await fixture.whenStable();
		await fixture.whenStable();
		expect(getSlidesText(fixture.nativeElement)).toEqual(['c', 'd']);
		expectActiveSlides(fixture.nativeElement, [true, false]);
	});

	it('should change slide on indicator click', async () => {
		const html = `
     <ngb-carousel>
       <ng-template ngbSlide>foo</ng-template>
       <ng-template ngbSlide>bar</ng-template>
     </ngb-carousel>
   `;

		const fixture = createTestComponent(html);
		const indicatorElms = getIndicatorElements(fixture.nativeElement);

		expectActiveSlides(fixture.nativeElement, [true, false]);

		indicatorElms[1].click();
		await fixture.whenStable();
		expectActiveSlides(fixture.nativeElement, [false, true]);
	});

	it('should fire a slide event with correct direction and source on indicator click', async () => {
		const html = `
      <ngb-carousel (slide)="carouselSlideCallBack($event)">
        <ng-template ngbSlide>foo</ng-template>
        <ng-template ngbSlide>bar</ng-template>
        <ng-template ngbSlide>pluto</ng-template>
      </ngb-carousel>
    `;

		const fixture = createTestComponent(html);
		const indicatorElms = getIndicatorElements(fixture.nativeElement);
		const spyCallBack = vi.spyOn(fixture.componentInstance, 'carouselSlideCallBack');

		indicatorElms[1].click();
		await fixture.whenStable();
		expect(fixture.componentInstance.carouselSlideCallBack).toHaveBeenCalledWith(
			expect.objectContaining({
				direction: NgbSlideEventDirection.START,
				source: NgbSlideEventSource.INDICATOR,
			}),
		);

		spyCallBack.mockClear();
		indicatorElms[0].click();
		await fixture.whenStable();
		expect(fixture.componentInstance.carouselSlideCallBack).toHaveBeenCalledWith(
			expect.objectContaining({
				direction: NgbSlideEventDirection.END,
				source: NgbSlideEventSource.INDICATOR,
			}),
		);

		spyCallBack.mockClear();
		indicatorElms[2].click();
		await fixture.whenStable();
		expect(fixture.componentInstance.carouselSlideCallBack).toHaveBeenCalledWith(
			expect.objectContaining({
				direction: NgbSlideEventDirection.START,
				source: NgbSlideEventSource.INDICATOR,
			}),
		);
	});

	it('should change slide on carousel control click', async () => {
		const html = `
      <ngb-carousel>
        <ng-template ngbSlide>foo</ng-template>
        <ng-template ngbSlide>bar</ng-template>
      </ngb-carousel>
    `;

		const fixture = createTestComponent(html);
		const [prevControlElm, nextControlElm] = getArrowElements(fixture.nativeElement);

		expectActiveSlides(fixture.nativeElement, [true, false]);

		nextControlElm.click(); // next
		await fixture.whenStable();
		expectActiveSlides(fixture.nativeElement, [false, true]);

		prevControlElm.click(); // prev
		await fixture.whenStable();
		expectActiveSlides(fixture.nativeElement, [true, false]);
	});

	it('should fire a slide event with correct direction and source on carousel control click', async () => {
		const html = `
      <ngb-carousel (slide)="carouselSlideCallBack($event)">
        <ng-template ngbSlide (slid)="carouselSingleSlideCallBack($event, 'foo')">foo</ng-template>
        <ng-template ngbSlide (slid)="carouselSingleSlideCallBack($event, 'bar')">bar</ng-template>
      </ngb-carousel>
    `;

		const fixture = createTestComponent(html);
		const [prevControlElm, nextControlElm] = getArrowElements(fixture.nativeElement);
		const spyCallBack = vi.spyOn(fixture.componentInstance, 'carouselSlideCallBack');
		const spySingleCallBack = vi.spyOn(fixture.componentInstance, 'carouselSingleSlideCallBack');

		prevControlElm.click();
		await fixture.whenStable();
		expect(fixture.componentInstance.carouselSlideCallBack).toHaveBeenCalledWith(
			expect.objectContaining({
				direction: NgbSlideEventDirection.END,
				source: NgbSlideEventSource.ARROW_LEFT,
			}),
		);
		expect(vi.mocked(spySingleCallBack).mock.calls).toEqual([
			[{ isShown: false, direction: NgbSlideEventDirection.END, source: NgbSlideEventSource.ARROW_LEFT }, 'foo'],
			[{ isShown: true, direction: NgbSlideEventDirection.END, source: NgbSlideEventSource.ARROW_LEFT }, 'bar'],
		]);

		spyCallBack.mockClear();
		spySingleCallBack.mockClear();
		nextControlElm.click();
		await fixture.whenStable();
		expect(fixture.componentInstance.carouselSlideCallBack).toHaveBeenCalledWith(
			expect.objectContaining({
				direction: NgbSlideEventDirection.START,
				source: NgbSlideEventSource.ARROW_RIGHT,
			}),
		);
		expect(vi.mocked(spySingleCallBack).mock.calls).toEqual([
			[{ isShown: false, direction: NgbSlideEventDirection.START, source: NgbSlideEventSource.ARROW_RIGHT }, 'bar'],
			[{ isShown: true, direction: NgbSlideEventDirection.START, source: NgbSlideEventSource.ARROW_RIGHT }, 'foo'],
		]);

		spyCallBack.mockClear();
		spySingleCallBack.mockClear();
		prevControlElm.click();
		await fixture.whenStable();
		expect(fixture.componentInstance.carouselSlideCallBack).toHaveBeenCalledWith(
			expect.objectContaining({
				direction: NgbSlideEventDirection.END,
				source: NgbSlideEventSource.ARROW_LEFT,
			}),
		);
		expect(vi.mocked(spySingleCallBack).mock.calls).toEqual([
			[{ isShown: false, direction: NgbSlideEventDirection.END, source: NgbSlideEventSource.ARROW_LEFT }, 'foo'],
			[{ isShown: true, direction: NgbSlideEventDirection.END, source: NgbSlideEventSource.ARROW_LEFT }, 'bar'],
		]);
	});

	it('should change slide on time passage (default interval value)', async () => {
		const html = `
      <ngb-carousel>
        <ng-template ngbSlide>foo</ng-template>
        <ng-template ngbSlide>bar</ng-template>
      </ngb-carousel>
    `;

		const fixture = createTestComponent(html);

		expectActiveSlides(fixture.nativeElement, [true, false]);

		vi.advanceTimersByTime(6000);
		await fixture.whenStable();
		expectActiveSlides(fixture.nativeElement, [false, true]);
	});

	it('should fire a slide event with correct direction and source on time passage', async () => {
		const html = `
     <ngb-carousel [interval]="2000" (slide)="carouselSlideCallBack($event)">
       <ng-template ngbSlide>foo</ng-template>
       <ng-template ngbSlide>bar</ng-template>
     </ngb-carousel>
   `;

		const fixture = createTestComponent(html);
		const spyCallBack = vi.spyOn(fixture.componentInstance, 'carouselSlideCallBack');

		vi.advanceTimersByTime(1999);
		await fixture.whenStable();
		expectActiveSlides(fixture.nativeElement, [true, false]);
		expect(spyCallBack).not.toHaveBeenCalled();

		vi.advanceTimersByTime(1);
		await fixture.whenStable();
		expectActiveSlides(fixture.nativeElement, [false, true]);
		expect(spyCallBack).toHaveBeenCalledWith(
			expect.objectContaining({
				direction: NgbSlideEventDirection.START,
				source: NgbSlideEventSource.TIMER,
			}),
		);
	});

	it('should change slide on time passage in OnPush component (default interval value)', async () => {
		const fixture = createTestComponent('<test-cmp-on-push></test-cmp-on-push>');

		expectActiveSlides(fixture.nativeElement, [true, false]);

		vi.advanceTimersByTime(6000);
		await fixture.whenStable();
		expectActiveSlides(fixture.nativeElement, [false, true]);
	});

	it('should change slide on time passage (custom interval value)', async () => {
		const html = `
      <ngb-carousel [interval]="2000">
        <ng-template ngbSlide>foo</ng-template>
        <ng-template ngbSlide>bar</ng-template>
      </ngb-carousel>
    `;

		const fixture = createTestComponent(html);

		expectActiveSlides(fixture.nativeElement, [true, false]);

		vi.advanceTimersByTime(1000);
		await fixture.whenStable();
		expectActiveSlides(fixture.nativeElement, [true, false]);

		vi.advanceTimersByTime(1200);
		await fixture.whenStable();
		expectActiveSlides(fixture.nativeElement, [false, true]);
	});

	it('should not change slide on time passage (custom interval value is zero)', async () => {
		const html = `
      <ngb-carousel [interval]="0">
        <ng-template ngbSlide>foo</ng-template>
        <ng-template ngbSlide>bar</ng-template>
      </ngb-carousel>
    `;

		const fixture = createTestComponent(html);

		expectActiveSlides(fixture.nativeElement, [true, false]);

		vi.advanceTimersByTime(1000);
		await fixture.whenStable();
		expectActiveSlides(fixture.nativeElement, [true, false]);

		vi.advanceTimersByTime(1200);
		await fixture.whenStable();
		expectActiveSlides(fixture.nativeElement, [true, false]);
	});

	it('should change slide with different rate when interval value changed', async () => {
		const html = `
      <ngb-carousel [interval]="interval()">
        <ng-template ngbSlide>foo</ng-template>
        <ng-template ngbSlide>bar</ng-template>
        <ng-template ngbSlide>zoo</ng-template>
      </ngb-carousel>
    `;

		const fixture = createTestComponent(html);
		fixture.componentInstance.interval.set(5000);
		await fixture.whenStable();
		expectActiveSlides(fixture.nativeElement, [true, false, false]);

		vi.advanceTimersByTime(5001);
		await fixture.whenStable();
		expectActiveSlides(fixture.nativeElement, [false, true, false]);

		fixture.componentInstance.interval.set(1000);
		await fixture.whenStable();

		vi.advanceTimersByTime(1001);
		await fixture.whenStable();
		expectActiveSlides(fixture.nativeElement, [false, false, true]);
	});

	it('should listen to mouse events based on pauseOnHover attribute', async () => {
		const html = `
    <ngb-carousel [pauseOnHover]="pauseOnHover()">
      <ng-template ngbSlide>foo</ng-template>
      <ng-template ngbSlide>bar</ng-template>
    </ngb-carousel>
  `;

		const fixture = createTestComponent(html);

		const carouselDebugEl = fixture.debugElement.query(By.directive(NgbCarousel));

		expectActiveSlides(fixture.nativeElement, [true, false]);

		carouselDebugEl.triggerEventHandler('mouseenter', {});
		await fixture.whenStable();
		expectActiveSlides(fixture.nativeElement, [true, false]);

		vi.advanceTimersByTime(6000);
		await fixture.whenStable();
		expectActiveSlides(fixture.nativeElement, [true, false]);

		carouselDebugEl.triggerEventHandler('mouseleave', {});
		await fixture.whenStable();
		expectActiveSlides(fixture.nativeElement, [true, false]);

		vi.advanceTimersByTime(6000);
		await fixture.whenStable();
		expectActiveSlides(fixture.nativeElement, [false, true]);

		fixture.componentInstance.pauseOnHover.set(false);
		await fixture.whenStable();
		expectActiveSlides(fixture.nativeElement, [false, true]);

		carouselDebugEl.triggerEventHandler('mouseenter', {});
		await fixture.whenStable();

		vi.advanceTimersByTime(6000);
		await fixture.whenStable();
		expectActiveSlides(fixture.nativeElement, [true, false]);
	});

	it('should pause / resume slide change with time passage on mouse enter / leave', async () => {
		const html = `
      <ngb-carousel>
        <ng-template ngbSlide>foo</ng-template>
        <ng-template ngbSlide>bar</ng-template>
      </ngb-carousel>
    `;

		const fixture = createTestComponent(html);

		const carouselDebugEl = fixture.debugElement.query(By.directive(NgbCarousel));

		expectActiveSlides(fixture.nativeElement, [true, false]);

		carouselDebugEl.triggerEventHandler('mouseenter', {});
		await fixture.whenStable();
		expectActiveSlides(fixture.nativeElement, [true, false]);

		vi.advanceTimersByTime(6000);
		await fixture.whenStable();
		expectActiveSlides(fixture.nativeElement, [true, false]);

		carouselDebugEl.triggerEventHandler('mouseleave', {});
		await fixture.whenStable();
		expectActiveSlides(fixture.nativeElement, [true, false]);

		vi.advanceTimersByTime(6000);
		await fixture.whenStable();
		expectActiveSlides(fixture.nativeElement, [false, true]);
	});

	it('should pause / resume slide change with time passage on focusin / focusout', async () => {
		const html = `
      <ngb-carousel>
        <ng-template ngbSlide>foo</ng-template>
        <ng-template ngbSlide>bar</ng-template>
      </ngb-carousel>
    `;

		const fixture = createTestComponent(html);

		const carouselDebugEl = fixture.debugElement.query(By.directive(NgbCarousel));

		expectActiveSlides(fixture.nativeElement, [true, false]);

		carouselDebugEl.triggerEventHandler('focusin', {});
		await fixture.whenStable();
		expectActiveSlides(fixture.nativeElement, [true, false]);

		vi.advanceTimersByTime(6000);
		await fixture.whenStable();
		expectActiveSlides(fixture.nativeElement, [true, false]);

		carouselDebugEl.triggerEventHandler('focusout', {});
		await fixture.whenStable();
		expectActiveSlides(fixture.nativeElement, [true, false]);

		vi.advanceTimersByTime(6000);
		await fixture.whenStable();
		expectActiveSlides(fixture.nativeElement, [false, true]);
	});

	it('should wrap slide changes by default', async () => {
		const html = `
      <ngb-carousel>
        <ng-template ngbSlide>foo</ng-template>
        <ng-template ngbSlide>bar</ng-template>
      </ngb-carousel>
    `;

		const fixture = createTestComponent(html);
		const [prevControlElm, nextControlElm] = getArrowElements(fixture.nativeElement);

		expectActiveSlides(fixture.nativeElement, [true, false]);

		nextControlElm.click(); // next
		await fixture.whenStable();
		expectActiveSlides(fixture.nativeElement, [false, true]);

		nextControlElm.click(); // next
		await fixture.whenStable();
		expectActiveSlides(fixture.nativeElement, [true, false]);

		prevControlElm.click(); // prev
		await fixture.whenStable();
		expectActiveSlides(fixture.nativeElement, [false, true]);
	});

	it('should not wrap slide changes by when requested', async () => {
		const html = `
      <ngb-carousel [wrap]="false">
        <ng-template ngbSlide>foo</ng-template>
        <ng-template ngbSlide>bar</ng-template>
      </ngb-carousel>
    `;

		const fixture = createTestComponent(html);
		const [prevControlElm, nextControlElm] = getArrowElements(fixture.nativeElement);

		expectActiveSlides(fixture.nativeElement, [true, false]);

		prevControlElm.click(); // prev
		await fixture.whenStable();
		expectActiveSlides(fixture.nativeElement, [true, false]);

		nextControlElm.click(); // next
		await fixture.whenStable();
		expectActiveSlides(fixture.nativeElement, [false, true]);

		nextControlElm.click(); // next
		await fixture.whenStable();
		expectActiveSlides(fixture.nativeElement, [false, true]);
	});

	it('should change on key arrowRight and arrowstart', async () => {
		const html = `
            <ngb-carousel [keyboard]="keyboard()" [wrap]="false">
              <ng-template ngbSlide>foo</ng-template>
              <ng-template ngbSlide>bar</ng-template>
            </ngb-carousel>
          `;

		const fixture = createTestComponent(html);
		expectActiveSlides(fixture.nativeElement, [true, false]);

		fixture.debugElement.query(By.directive(NgbCarousel)).triggerEventHandler('keydown.arrowRight', {}); // next()
		await fixture.whenStable();
		expectActiveSlides(fixture.nativeElement, [false, true]);

		fixture.debugElement.query(By.directive(NgbCarousel)).triggerEventHandler('keydown.arrowLeft', {}); // prev()
		await fixture.whenStable();
		expectActiveSlides(fixture.nativeElement, [true, false]);

		fixture.componentInstance.keyboard.set(false);
		await fixture.whenStable();
		await fixture.whenStable();
		fixture.debugElement.query(By.directive(NgbCarousel)).triggerEventHandler('keydown.arrowRight', {}); // prev()
		await fixture.whenStable();
		expectActiveSlides(fixture.nativeElement, [true, false]);
	});

	it('should listen to keyevents based on keyboard attribute', async () => {
		const html = `
               <ngb-carousel [keyboard]="keyboard()" >
                 <ng-template ngbSlide>foo</ng-template>
                 <ng-template ngbSlide>bar</ng-template>
               </ngb-carousel>
             `;

		const fixture = createTestComponent(html);
		expectActiveSlides(fixture.nativeElement, [true, false]);

		fixture.componentInstance.keyboard.set(false);
		await fixture.whenStable();
		fixture.debugElement.query(By.directive(NgbCarousel)).triggerEventHandler('keydown.arrowRight', {}); // prev()
		await fixture.whenStable();
		expectActiveSlides(fixture.nativeElement, [true, false]);

		fixture.componentInstance.keyboard.set(true);
		await fixture.whenStable();
		fixture.debugElement.query(By.directive(NgbCarousel)).triggerEventHandler('keydown.arrowRight', {}); // next()
		await fixture.whenStable();
		expectActiveSlides(fixture.nativeElement, [false, true]);
	});

	it('should render navigation indicators according to the flags', async () => {
		const html = `
    <ngb-carousel [showNavigationIndicators]="showNavigationIndicators()">
      <ng-template ngbSlide>foo</ng-template>
    </ngb-carousel>
  `;
		const fixture = createTestComponent(html);

		const slideElms = getSlideElements(fixture.nativeElement);
		expect(slideElms.length).toBe(1);
		expect(slideElms[0].textContent).toMatch(/foo/);
		expect(fixture.nativeElement.querySelectorAll('.carousel-indicators.visually-hidden > button').length).toBe(0);
		expect(getIndicatorElements(fixture.nativeElement).length).toBe(1);

		fixture.componentInstance.showNavigationIndicators.set(false);
		await fixture.whenStable();
		expect(fixture.nativeElement.querySelectorAll('.carousel-indicators.visually-hidden > button').length).toBe(1);
		expect(getIndicatorElements(fixture.nativeElement).length).toBe(1);
	});

	it('should render navigation buttons according to the flags', async () => {
		const html = `
    <ngb-carousel [showNavigationArrows]="showNavigationArrows()">
      <ng-template ngbSlide>foo</ng-template>
    </ngb-carousel>
  `;
		const fixture = createTestComponent(html);

		expect(getSlideElements(fixture.nativeElement).length).toBe(1);
		expect(getArrowElements(fixture.nativeElement).length).toBe(2);

		fixture.componentInstance.showNavigationArrows.set(false);
		await fixture.whenStable();
		expect(getArrowElements(fixture.nativeElement).length).toBe(0);
	});

	describe('Custom config', async () => {
		let config: NgbCarouselConfig;

		beforeEach(() => {
			config = TestBed.inject(NgbCarouselConfig);
			config.interval = 1000;
			config.wrap = false;
			config.keyboard = false;
			config.pauseOnHover = false;
			config.pauseOnFocus = false;
			config.showNavigationIndicators = true;
			config.showNavigationArrows = true;
		});

		it('should initialize inputs with provided config', async () => {
			const fixture = TestBed.createComponent(NgbCarousel);
			await fixture.whenStable();

			const carousel = fixture.componentInstance;
			expect(carousel.interval).toBe(config.interval);
			expect(carousel.wrap).toBe(config.wrap);
			expect(carousel.keyboard).toBe(config.keyboard);
			expect(carousel.pauseOnHover).toBe(config.pauseOnHover);
			expect(carousel.pauseOnFocus).toBe(config.pauseOnFocus);
			expect(carousel.showNavigationIndicators).toBe(config.showNavigationIndicators);
			expect(carousel.showNavigationArrows).toBe(config.showNavigationArrows);
		});
	});

	it('should initialize inputs with provided config as provider', () => {
		const config = TestBed.inject(NgbCarouselConfig);
		config.interval = 1000;
		config.wrap = false;
		config.keyboard = false;
		config.pauseOnHover = false;
		config.pauseOnFocus = false;
		config.showNavigationIndicators = true;
		config.showNavigationArrows = true;

		const carousel = TestBed.createComponent(NgbCarousel).componentInstance;
		expect(carousel.interval).toBe(config.interval);
		expect(carousel.wrap).toBe(config.wrap);
		expect(carousel.keyboard).toBe(config.keyboard);
		expect(carousel.pauseOnHover).toBe(config.pauseOnHover);
		expect(carousel.pauseOnFocus).toBe(config.pauseOnFocus);
		expect(carousel.showNavigationIndicators).toBe(config.showNavigationIndicators);
		expect(carousel.showNavigationArrows).toBe(config.showNavigationArrows);
	});
});

if (isBrowserVisible('ngb-carousel animations')) {
	describe('ngb-carousel animations', () => {
		@Component({
			imports: [NgbCarousel, NgbSlide],
			template: `
				<ngb-carousel (slid)="onSlid($event)" [interval]="-1">
					<ng-template ngbSlide id="one">One</ng-template>
					<ng-template ngbSlide id="two">Two</ng-template>
					<ng-template ngbSlide id="three">Three</ng-template>
				</ngb-carousel>
			`,
			host: { '[class.ngb-reduce-motion]': 'reduceMotion' },
		})
		class TestAnimationComponent {
			reduceMotion = true;
			onSlid = (payload) => payload;
		}

		beforeEach(() => {
			TestBed.configureTestingModule({
				providers: [{ provide: NgbConfig, useClass: NgbConfigAnimation }],
			});
		});

		it(`should run slide transition (force-reduced-motion = false)`, async () => {
			const fixture = TestBed.createComponent(TestAnimationComponent);
			fixture.componentInstance.reduceMotion = false;
			await fixture.whenStable();

			const nativeEl = fixture.nativeElement;

			const onSlidSpy = vi.spyOn(fixture.componentInstance, 'onSlid');

			const [slideOne, slideTwo] = getSlideElements(nativeEl);
			const indicators = getIndicatorElements(nativeEl);

			const slidPromise = new Promise<void>((resolve) =>
				onSlidSpy.mockImplementation((payload) => {
					expect(slideOne.className).toBe('carousel-item');
					expect(slideTwo.className).toBe('carousel-item active');

					expect(payload).toEqual({
						prev: 'one',
						current: 'two',
						direction: 'start',
						paused: false,
						source: 'indicator',
					});
					expect(onSlidSpy).toHaveBeenCalledTimes(1);
					resolve();
				}),
			);

			expect(slideOne.className).toBe('carousel-item active');
			expect(slideTwo.className).toBe('carousel-item');

			indicators[1].click();
			await fixture.whenStable();

			expect(slideOne.className).toBe('carousel-item active carousel-item-start');
			expect(slideTwo.className).toBe('carousel-item carousel-item-next carousel-item-start');

			await slidPromise;
		});

		it(`should run slide transition (force-reduced-motion = true)`, async () => {
			const fixture = TestBed.createComponent(TestAnimationComponent);
			fixture.componentInstance.reduceMotion = true;
			await fixture.whenStable();

			const nativeEl = fixture.nativeElement;

			const onSlidSpy = vi.spyOn(fixture.componentInstance, 'onSlid');

			const [slideOne, slideTwo] = getSlideElements(nativeEl);
			const indicators = getIndicatorElements(nativeEl);

			expect(slideOne.className).toBe('carousel-item active');
			expect(slideTwo.className).toBe('carousel-item');

			indicators[1].click();
			await fixture.whenStable();

			expect(slideOne.className).toBe('carousel-item');
			expect(slideTwo.className).toBe('carousel-item active');

			expect(onSlidSpy).toHaveBeenCalledWith({
				prev: 'one',
				current: 'two',
				direction: 'start',
				paused: false,
				source: 'indicator',
			});
			expect(onSlidSpy).toHaveBeenCalledTimes(1);
		});

		it(`should revert slide transition (force-reduced-motion = false)`, async () => {
			const fixture = TestBed.createComponent(TestAnimationComponent);
			fixture.componentInstance.reduceMotion = false;
			await fixture.whenStable();

			const nativeEl = fixture.nativeElement;
			const [slideOne, slideTwo, slideThree] = getSlideElements(nativeEl);
			const indicators = getIndicatorElements(nativeEl);

			const onSlidSpy = vi.spyOn(fixture.componentInstance, 'onSlid');
			const slidPromise = new Promise<void>((resolve) =>
				onSlidSpy.mockImplementation((payload) => {
					expect(slideOne.className).toBe('carousel-item active');
					expect(slideTwo.className).toBe('carousel-item');
					expect(slideThree.className).toBe('carousel-item');

					expect(payload).toEqual({
						prev: 'two',
						current: 'one',
						direction: 'end',
						paused: false,
						source: 'indicator',
					});
					expect(onSlidSpy).toHaveBeenCalledTimes(1);
					resolve();
				}),
			);

			expect(slideOne.className).toBe('carousel-item active');
			expect(slideTwo.className).toBe('carousel-item');

			indicators[1].click();
			await fixture.whenStable();

			expect(slideOne.className).toBe('carousel-item active carousel-item-start');
			expect(slideTwo.className).toBe('carousel-item carousel-item-next carousel-item-start');
			expect(slideThree.className).toBe('carousel-item');

			// Reverse only possible when clicking on previous one
			indicators[2].click();
			await fixture.whenStable();

			expect(slideOne.className).toBe('carousel-item active carousel-item-start');
			expect(slideTwo.className).toBe('carousel-item carousel-item-next carousel-item-start');
			expect(slideThree.className).toBe('carousel-item');

			// Reverse
			indicators[0].click();
			await fixture.whenStable();

			expect(slideOne.className).toBe('carousel-item active');
			expect(slideTwo.className).toBe('carousel-item carousel-item-next');
			expect(slideThree.className).toBe('carousel-item');

			await slidPromise;
		});

		it(`should revert slide transition (force-reduced-motion = true)`, async () => {
			const fixture = TestBed.createComponent(TestAnimationComponent);
			fixture.componentInstance.reduceMotion = true;
			await fixture.whenStable();

			const nativeEl = fixture.nativeElement;

			const onSlidSpy = vi.spyOn(fixture.componentInstance, 'onSlid');

			const [slideOne, slideTwo, slideThree] = getSlideElements(nativeEl);
			const indicators = getIndicatorElements(nativeEl);

			expect(slideOne.className).toBe('carousel-item active');
			expect(slideTwo.className).toBe('carousel-item');
			expect(slideThree.className).toBe('carousel-item');

			indicators[1].click();
			await fixture.whenStable();

			expect(slideOne.className).toBe('carousel-item');
			expect(slideTwo.className).toBe('carousel-item active');
			expect(slideThree.className).toBe('carousel-item');

			indicators[2].click();
			await fixture.whenStable();

			expect(slideOne.className).toBe('carousel-item');
			expect(slideTwo.className).toBe('carousel-item');
			expect(slideThree.className).toBe('carousel-item active');

			indicators[0].click();
			await fixture.whenStable();

			expect(slideOne.className).toBe('carousel-item active');
			expect(slideTwo.className).toBe('carousel-item');
			expect(slideThree.className).toBe('carousel-item');

			expect(vi.mocked(onSlidSpy).mock.calls).toEqual([
				[{ prev: 'one', current: 'two', direction: 'start', paused: false, source: 'indicator' }],
				[{ prev: 'two', current: 'three', direction: 'start', paused: false, source: 'indicator' }],
				[{ prev: 'three', current: 'one', direction: 'end', paused: false, source: 'indicator' }],
			]);

			expect(onSlidSpy).toHaveBeenCalledTimes(3);
		});
	});
}

@Component({
	selector: 'test-cmp-on-push',
	imports: [NgbCarousel, NgbSlide],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<ngb-carousel>
			<ng-template ngbSlide>foo</ng-template>
			<ng-template ngbSlide>bar</ng-template>
		</ngb-carousel>
	`,
})
class TestComponentOnPush {}

@Component({
	selector: 'test-cmp',
	imports: [NgbCarousel, NgbSlide, TestComponentOnPush],
	template: '',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestComponent {
	addNewSlide = signal(false);
	interval = signal(1000);
	activeSlideId = signal<string | null>(null);
	keyboard = signal(true);
	pauseOnHover = signal(true);
	showNavigationArrows = signal(true);
	showNavigationIndicators = signal(true);
	slides = signal(['a', 'b']);
	carouselSlideCallBack = (event: NgbSlideEvent) => {};
	carouselSingleSlideCallBack = (event: NgbSingleSlideEvent, id: string) => {};
}
