import { ComponentFixture, TestBed } from '@angular/core/testing';
import { createGenericTestComponent } from '../test/common';

import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
	FormControl,
	FormsModule,
	ReactiveFormsModule,
	UntypedFormControl,
	UntypedFormGroup,
	Validators,
} from '@angular/forms';

import { NgbRating } from './rating';
import { NgbRatingConfig } from './rating-config';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { page, Locator } from 'vitest/browser';

function createKeyDownEvent(key: string) {
	const event = { key, preventDefault: () => {} };
	vi.spyOn(event, 'preventDefault');
	return event;
}

class RatingTester {
	readonly fixture: ComponentFixture<TestComponent>;
	readonly componentInstance: TestComponent;
	readonly root: Locator;
	readonly rating: Locator;
	readonly stars: Locator;
	readonly ariaStars: Locator;

	constructor(html: string) {
		this.fixture = createGenericTestComponent(html, TestComponent, false);
		this.componentInstance = this.fixture.componentInstance;
		this.root = page.elementLocator(this.fixture.nativeElement);
		this.rating = this.root.getByCss('ngb-rating');
		this.stars = this.root.getByCss('ngb-rating span:not(.visually-hidden)');
		this.ariaStars = this.root.getByCss('ngb-rating .visually-hidden');
	}

	static async create(html: string) {
		const tester = new RatingTester(html);
		await tester.whenStable();
		return tester;
	}

	async whenStable() {
		await this.fixture.whenStable();
	}
	async expectStarsStateToBe(expected: boolean[]) {
		await expect
			.poll(() => this.stars.elements().map((start) => start.textContent.trim() === String.fromCharCode(9733)))
			.toEqual(expected);
	}
	async expectStarsStateTextToBe(expected: string[]) {
		await expect.poll(() => this.stars.elements().map((star) => star.textContent.trim())).toEqual(expected);
	}
	async expectAriaStateToBe(expected: boolean[]) {
		await expect
			.poll(() => this.ariaStars.elements().map((star) => star.textContent.trim() === '(*)'))
			.toEqual(expected);
	}
}

describe('ngb-rating', () => {
	it('should initialize inputs with default values', () => {
		const defaultConfig = TestBed.inject(NgbRatingConfig);
		const rating = TestBed.createComponent(NgbRating).componentInstance;
		expect(rating.max).toBe(defaultConfig.max);
		expect(rating.readonly).toBe(defaultConfig.readonly);
	});

	it('should show as many stars as the configured max by default', async () => {
		const tester = await RatingTester.create('<ngb-rating/>');

		expect(tester.stars.elements().length).toBe(new NgbRatingConfig().max);
	});

	it('should change the num of stars with `max`', async () => {
		const tester = await RatingTester.create('<ngb-rating max="3"/>');

		expect(tester.stars.elements().length).toBe(3);
	});

	it('initializes the default star icons as selected', async () => {
		const tester = await RatingTester.create('<ngb-rating rate="3" max="5"/>');

		await tester.expectStarsStateToBe([true, true, true, false, false]);
	});

	it('sets stars within 0..max limits', async () => {
		const tester = await RatingTester.create('<ngb-rating [rate]="rate()" max="5"/>');

		await tester.expectStarsStateToBe([true, true, true, false, false]);

		tester.componentInstance.rate.set(0);
		await tester.whenStable();

		await tester.expectStarsStateToBe([false, false, false, false, false]);

		tester.componentInstance.rate.set(-5);
		await tester.whenStable();

		await tester.expectStarsStateToBe([false, false, false, false, false]);

		tester.componentInstance.rate.set(20);
		await tester.whenStable();

		await tester.expectStarsStateToBe([true, true, true, true, true]);
	});

	it('should now fire change event initially', async () => {
		const tester = await RatingTester.create('<ngb-rating [rate]="3" (rateChange)="changed.set(true)"/>');
		expect(tester.componentInstance.changed()).toBeFalsy();
	});

	it('handles correctly the click event', async () => {
		const tester = await RatingTester.create('<ngb-rating [(rate)]="rate" max="5"/>');

		// 3/5
		await tester.expectStarsStateToBe([true, true, true, false, false]);

		// enter 2 -> 2/5, rate = 3
		await tester.stars.nth(1).hover();
		await tester.whenStable();

		await tester.expectStarsStateToBe([true, true, false, false, false]);
		expect(tester.componentInstance.rate()).toBe(3);

		// click 2 -> 2/5, rate = 2
		await tester.stars.nth(1).click();
		await tester.whenStable();

		await tester.expectStarsStateToBe([true, true, false, false, false]);
		expect(tester.componentInstance.rate()).toBe(2);

		// leave 2 -> 2/5, rate = 2
		await tester.stars.nth(1).unhover();
		await tester.whenStable();

		await tester.expectStarsStateToBe([true, true, false, false, false]);
		expect(tester.componentInstance.rate()).toBe(2);
	});

	it('ignores the click event on a readonly rating', async () => {
		const tester = await RatingTester.create('<ngb-rating [(rate)]="rate" max="5" [readonly]="true"/>');

		// 3/5
		await tester.expectStarsStateToBe([true, true, true, false, false]);

		// enter 2 -> 3/5
		await tester.stars.nth(1).hover();
		await tester.whenStable();

		await tester.expectStarsStateToBe([true, true, true, false, false]);
		expect(tester.componentInstance.rate()).toBe(3);

		// click 2 -> 2/5
		await tester.stars.nth(1).click();
		await tester.whenStable();

		await tester.expectStarsStateToBe([true, true, true, false, false]);
		expect(tester.componentInstance.rate()).toBe(3);

		// leave 2 -> 3/5
		await tester.stars.nth(1).unhover();
		await tester.whenStable();

		await tester.expectStarsStateToBe([true, true, true, false, false]);
		expect(tester.componentInstance.rate()).toBe(3);
	});

	it('should not reset rating to 0 by default', async () => {
		const tester = await RatingTester.create('<ngb-rating [(rate)]="rate" max="5"/>');

		// 3/5 initially
		await tester.expectStarsStateToBe([true, true, true, false, false]);
		expect(tester.componentInstance.rate()).toBe(3);

		// click 3 -> 3/5
		await tester.stars.nth(2).click();
		await tester.whenStable();

		await tester.expectStarsStateToBe([true, true, true, false, false]);
		expect(tester.componentInstance.rate()).toBe(3);
	});

	it('should set `resettable` rating to 0', async () => {
		const tester = await RatingTester.create('<ngb-rating [(rate)]="rate" max="5" [resettable]="true"/>');

		// 3/5 initially
		await tester.expectStarsStateToBe([true, true, true, false, false]);
		expect(tester.componentInstance.rate()).toBe(3);

		// click 3 -> 0/5
		await tester.stars.nth(2).click();
		await tester.whenStable();

		await tester.expectStarsStateToBe([false, false, false, false, false]);
		expect(tester.componentInstance.rate()).toBe(0);

		// click 2 -> 2/5
		await tester.stars.nth(1).click();
		await tester.whenStable();

		await tester.expectStarsStateToBe([true, true, false, false, false]);
		expect(tester.componentInstance.rate()).toBe(2);
	});

	it('handles correctly the mouse enter/leave', async () => {
		const tester = await RatingTester.create('<ngb-rating [(rate)]="rate" max="5"/>');

		// 3/5
		await tester.expectStarsStateToBe([true, true, true, false, false]);

		// enter 1 -> 1/5, rate = 3
		await tester.stars.nth(0).hover();
		await tester.whenStable();

		await tester.expectStarsStateToBe([true, false, false, false, false]);
		expect(tester.componentInstance.rate()).toBe(3);

		// leave -> 3/5, rate = 3
		await tester.stars.nth(0).unhover();
		await tester.whenStable();

		await tester.expectStarsStateToBe([true, true, true, false, false]);
		expect(tester.componentInstance.rate()).toBe(3);

		// enter 5 -> 5/5, rate = 3
		await tester.stars.nth(4).hover();
		await tester.whenStable();

		await tester.expectStarsStateToBe([true, true, true, true, true]);
		expect(tester.componentInstance.rate()).toBe(3);

		// enter 4 -> 4/5, rate = 3
		await tester.stars.nth(3).hover();
		await tester.whenStable();

		await tester.expectStarsStateToBe([true, true, true, true, false]);
		expect(tester.componentInstance.rate()).toBe(3);
	});

	it('handles correctly the mouse enter/leave on readonly rating', async () => {
		const tester = await RatingTester.create('<ngb-rating [(rate)]="rate" max="5" [readonly]="true"/>');

		// 3/5
		await tester.expectStarsStateToBe([true, true, true, false, false]);

		// enter 1 -> 3/5, rate = 3
		await tester.stars.nth(0).hover();
		await tester.whenStable();

		await tester.expectStarsStateToBe([true, true, true, false, false]);
		expect(tester.componentInstance.rate()).toBe(3);

		// leave -> 3/5, rate = 3
		await tester.stars.nth(0).unhover();
		await tester.whenStable();

		await tester.expectStarsStateToBe([true, true, true, false, false]);
		expect(tester.componentInstance.rate()).toBe(3);

		// enter 5 -> 3/5, rate = 3
		await tester.stars.nth(4).hover();
		await tester.whenStable();

		await tester.expectStarsStateToBe([true, true, true, false, false]);
		expect(tester.componentInstance.rate()).toBe(3);

		// enter 4 -> 3/5, rate = 3
		await tester.stars.nth(3).hover();
		await tester.whenStable();

		await tester.expectStarsStateToBe([true, true, true, false, false]);
		expect(tester.componentInstance.rate()).toBe(3);
	});

	it('should set pointer cursor on stars when not readonly', async () => {
		const tester = await RatingTester.create('<ngb-rating/>');

		await expect.element(tester.stars.nth(1)).toHaveStyle('cursor: pointer');
	});

	it('should set default cursor on stars when readonly', async () => {
		const tester = await RatingTester.create('<ngb-rating [readonly]="true"/>');

		await expect.element(tester.stars.nth(1)).toHaveStyle('cursor: default');
	});

	it('should allow custom star template', async () => {
		const tester = await RatingTester.create(`
			<ng-template #t let-fill="fill">{{ fill === 100 ? 'x' : 'o' }}</ng-template>
      		<ngb-rating [starTemplate]="t" rate="2" max="4"/>
		`);

		await tester.expectStarsStateTextToBe(['x', 'x', 'o', 'o']);
	});

	it('should allow custom template as a child element', async () => {
		const tester = await RatingTester.create(`
			<ngb-rating rate="2" max="4">
				<ng-template let-fill="fill">{{ fill === 100 ? 'x' : 'o' }}</ng-template>
			</ngb-rating>
		`);

		await tester.expectStarsStateTextToBe(['x', 'x', 'o', 'o']);
	});

	it('should prefer explicitly set custom template to a child one', async () => {
		const tester = await RatingTester.create(`
			<ng-template #t let-fill="fill">{{ fill === 100 ? 'a' : 'b' }}</ng-template>
			<ngb-rating [starTemplate]="t" rate="2" max="4">
				<ng-template let-fill="fill">{{ fill === 100 ? 'c' : 'd' }}</ng-template>
			</ngb-rating>
		`);

		await tester.expectStarsStateTextToBe(['a', 'a', 'b', 'b']);
	});

	it('should calculate fill percentage correctly', async () => {
		const tester = await RatingTester.create(`
			<ng-template #t let-fill="fill">{{fill}}</ng-template>
      		<ngb-rating [starTemplate]="t" [rate]="rate()" max="4"/>
		`);

		await tester.expectStarsStateTextToBe(['100', '100', '100', '0']);

		tester.componentInstance.rate.set(0);
		await tester.whenStable();

		await tester.expectStarsStateTextToBe(['0', '0', '0', '0']);

		tester.componentInstance.rate.set(2.2);
		await tester.whenStable();

		await tester.expectStarsStateTextToBe(['100', '100', '20', '0']);

		tester.componentInstance.rate.set(2.25);
		await tester.whenStable();

		await tester.expectStarsStateTextToBe(['100', '100', '25', '0']);

		tester.componentInstance.rate.set(2.2548);
		await tester.whenStable();

		await tester.expectStarsStateTextToBe(['100', '100', '25', '0']);

		tester.componentInstance.rate.set(7);
		await tester.whenStable();

		await tester.expectStarsStateTextToBe(['100', '100', '100', '100']);
	});

	it('should allow custom star template based on index', async () => {
		const tester = await RatingTester.create(`
			<ng-template #t let-index="index">{{ index === 1 ? 'x' : 'o' }}</ng-template>
      		<ngb-rating [starTemplate]="t" rate="2" max="4"/>
		`);

		await tester.expectStarsStateTextToBe(['o', 'x', 'o', 'o']);
	});

	it('should allow custom template based on index as a child element', async () => {
		const tester = await RatingTester.create(`
			<ngb-rating rate="2" max="4">
				<ng-template let-index="index">{{ index === 1 ? 'x' : 'o' }}</ng-template>
			</ngb-rating>
		`);

		await tester.expectStarsStateTextToBe(['o', 'x', 'o', 'o']);
	});

	it('should prefer explicitly set custom template based on index to a child one', async () => {
		const tester = await RatingTester.create(`
			<ng-template #t let-index="index">{{ index === 1 ? 'a' : 'b' }}</ng-template>
			<ngb-rating [starTemplate]="t" rate="2" max="4">
				<ng-template let-index="index">{{ index === 1 ? 'c' : 'd' }}</ng-template>
			</ngb-rating>
		`);

		await tester.expectStarsStateTextToBe(['b', 'a', 'b', 'b']);
	});

	describe('aria support', () => {
		it('contains aria-valuemax with the number of stars', async () => {
			const tester = await RatingTester.create('<ngb-rating [max]="max()"/>');

			await expect.element(tester.rating).toHaveAttribute('aria-valuemax', '10');
		});

		it('contains aria-valuemin', async () => {
			const tester = await RatingTester.create('<ngb-rating [max]="max()"/>');

			await expect.element(tester.rating).toHaveAttribute('aria-valuemin', '0');
		});

		it('contains a hidden span for each star for screenreaders', async () => {
			const tester = await RatingTester.create('<ngb-rating max="5"/>');

			expect(tester.ariaStars.elements().length).toBe(5);
		});

		it('initializes populates the current rate for screenreaders', async () => {
			const tester = await RatingTester.create('<ngb-rating rate="3" max="5"/>');

			await tester.expectAriaStateToBe([true, true, true, false, false]);
		});

		it('contains aria-valuenow with the current rate', async () => {
			const tester = await RatingTester.create('<ngb-rating [max]="max()" rate="3"/>');

			await expect.element(tester.rating).toHaveAttribute('aria-valuenow', '3');
		});

		it('updates aria-valuenow when the rate changes', async () => {
			const tester = await RatingTester.create('<ngb-rating [max]="max()" rate="3"/>');

			await tester.stars.nth(6).click();
			await tester.whenStable();

			await expect.element(tester.rating).toHaveAttribute('aria-valuenow', '7');
		});

		it('updates aria-valuetext when the rate changes', async () => {
			const tester = await RatingTester.create('<ngb-rating [max]="max()" rate="3"/>');

			await tester.stars.nth(6).click();
			await tester.whenStable();

			await expect.element(tester.rating).toHaveAttribute('aria-valuetext', '7 out of 10');
		});

		it('should allow to customize aria-valuetext', async () => {
			const tester = await RatingTester.create(
				'<ngb-rating [max]="max()" rate="3" [ariaValueText]="customAriaValueTextFunction"/>',
			);

			await tester.stars.nth(6).click();
			await tester.whenStable();

			await expect.element(tester.rating).toHaveAttribute('aria-valuetext', 'Rating: 7 out of 10 stars');
		});

		it(`updates 'aria-readonly' when readonly`, async () => {
			const tester = await RatingTester.create('<ngb-rating [disabled]="disabled()" [readonly]="readonly()"/>');

			await expect.element(tester.rating).not.toHaveAttribute('aria-readonly');
			await expect.element(tester.rating).not.toHaveAttribute('aria-disabled');

			// readonly
			tester.componentInstance.readonly.set(true);
			await tester.whenStable();

			await expect.element(tester.rating).toHaveAttribute('aria-readonly', 'true');
			await expect.element(tester.rating).not.toHaveAttribute('aria-disabled');

			// readonly and disabled
			tester.componentInstance.disabled.set(true);
			await tester.whenStable();

			await expect.element(tester.rating).not.toHaveAttribute('aria-readonly');
			await expect.element(tester.rating).toHaveAttribute('aria-disabled', 'true');
		});

		it(`updates 'aria-disabled' when disabled`, async () => {
			const tester = await RatingTester.create('<ngb-rating [disabled]="disabled()"/>');

			await expect.element(tester.rating).not.toHaveAttribute('aria-disabled');

			tester.componentInstance.disabled.set(true);
			await tester.whenStable();

			await expect.element(tester.rating).toHaveAttribute('aria-disabled', 'true');
		});
	});

	it('should allow customizing tabindex', async () => {
		const tester = await RatingTester.create('<ngb-rating [formControl]="formControl" [tabindex]="tabindex()"/>');

		await expect.element(tester.rating).toHaveAttribute('tabindex', '3');

		tester.componentInstance.tabindex.set(undefined);
		await tester.whenStable();

		await expect.element(tester.rating).toHaveAttribute('tabindex', '0');

		tester.componentInstance.tabindex.set('2323');
		await tester.whenStable();

		await expect.element(tester.rating).toHaveAttribute('tabindex', '2323');

		tester.componentInstance.formControl.disable();
		await tester.whenStable();

		await expect.element(tester.rating).toHaveAttribute('tabindex', '-1');

		tester.componentInstance.formControl.enable();
		await tester.whenStable();

		await expect.element(tester.rating).toHaveAttribute('tabindex', '2323');
	});

	it('should set tabindex to -1 when disabled', async () => {
		const tester = await RatingTester.create('<ngb-rating [disabled]="disabled()"/>');

		await expect.element(tester.rating).toHaveAttribute('tabindex', '0');

		tester.componentInstance.disabled.set(true);
		await tester.whenStable();

		await expect.element(tester.rating).toHaveAttribute('tabindex', '-1');
	});

	it('should contain the correct number of stars when [max] is changed', async () => {
		const tester = await RatingTester.create('<ngb-rating [max]="max()"/>');

		expect(tester.stars.elements().length).toBe(10);

		tester.componentInstance.max.set(12);
		await tester.whenStable();

		expect(tester.stars.elements().length).toBe(12);

		// should be ignored
		tester.componentInstance.max.set(-1);
		await tester.whenStable();

		expect(tester.stars.elements().length).toBe(12);

		tester.componentInstance.max.set(5);
		await tester.whenStable();

		expect(tester.stars.elements().length).toBe(5);

		// should be ignored
		tester.componentInstance.max.set(0);
		await tester.whenStable();

		expect(tester.stars.elements().length).toBe(5);
	});

	it('should reduce the rating when [max] is changed to a value lower than the current rating', async () => {
		const tester = await RatingTester.create('<ngb-rating [(rate)]="rate" [max]="max()"/>');

		tester.componentInstance.max.set(2);
		await tester.whenStable();

		await tester.expectStarsStateToBe([true, true]);
		expect(tester.componentInstance.rate()).toBe(2);
	});

	describe('keyboard support', () => {
		it('should handle arrow keys', async () => {
			const tester = await RatingTester.create('<ngb-rating [rate]="3" [max]="5"/>');
			const element = tester.fixture.debugElement.query(By.directive(NgbRating));

			tester.stars.nth(2).element().focus();

			// right -> +1
			let event = createKeyDownEvent('ArrowRight');
			element.triggerEventHandler('keydown', event);
			await tester.whenStable();

			await tester.expectStarsStateToBe([true, true, true, true, false]);
			expect(event.preventDefault).toHaveBeenCalled();

			// up -> +1
			event = createKeyDownEvent('ArrowUp');
			element.triggerEventHandler('keydown', event);
			await tester.whenStable();

			await tester.expectStarsStateToBe([true, true, true, true, true]);
			expect(event.preventDefault).toHaveBeenCalled();

			// left -> -1
			event = createKeyDownEvent('ArrowLeft');
			element.triggerEventHandler('keydown', event);
			await tester.whenStable();

			await tester.expectStarsStateToBe([true, true, true, true, false]);
			expect(event.preventDefault).toHaveBeenCalled();

			// down -> -1
			event = createKeyDownEvent('ArrowDown');
			element.triggerEventHandler('keydown', event);
			await tester.whenStable();

			await tester.expectStarsStateToBe([true, true, true, false, false]);
			expect(event.preventDefault).toHaveBeenCalled();

			// any other -> 0
			event = createKeyDownEvent(' ');
			element.triggerEventHandler('keydown', event);
			await tester.whenStable();

			await tester.expectStarsStateToBe([true, true, true, false, false]);
			expect(event.preventDefault).not.toHaveBeenCalled();
		});

		it('should handle home/end keys', async () => {
			const tester = await RatingTester.create('<ngb-rating [rate]="3" [max]="5"/>');
			const element = tester.fixture.debugElement.query(By.directive(NgbRating));

			// home -> 0
			let event = createKeyDownEvent('Home');
			element.triggerEventHandler('keydown', event);
			await tester.whenStable();

			await tester.expectStarsStateToBe([false, false, false, false, false]);
			expect(event.preventDefault).toHaveBeenCalled();

			// end -> max
			event = createKeyDownEvent('End');
			element.triggerEventHandler('keydown', event);
			await tester.whenStable();

			await tester.expectStarsStateToBe([true, true, true, true, true]);
			expect(event.preventDefault).toHaveBeenCalled();
		});
	});

	describe('forms', () => {
		it('should work with template-driven form validation', async () => {
			const tester = await RatingTester.create(`
				<form>
					<ngb-rating [(ngModel)]="model" name="control" max="5" required/>
				</form>
			`);

			await tester.expectStarsStateToBe([false, false, false, false, false]);
			await expect.element(tester.rating).toHaveCssClass('ng-invalid');
			await expect.element(tester.rating).toHaveCssClass('ng-untouched');

			tester.componentInstance.model.set(1);
			await tester.whenStable();

			await tester.expectStarsStateToBe([true, false, false, false, false]);
			await expect.element(tester.rating).toHaveCssClass('ng-valid');
			await expect.element(tester.rating).toHaveCssClass('ng-untouched');

			tester.componentInstance.model.set(0);
			await tester.whenStable();

			await tester.expectStarsStateToBe([false, false, false, false, false]);
			await expect.element(tester.rating).toHaveCssClass('ng-valid');
			await expect.element(tester.rating).toHaveCssClass('ng-untouched');
		});

		it('should work with reactive form validation', async () => {
			const tester = await RatingTester.create(`
				<form [formGroup]="form">
					<ngb-rating formControlName="rating" max="5"/>
				</form>
			`);

			await tester.expectStarsStateToBe([false, false, false, false, false]);
			await expect.element(tester.rating).toHaveCssClass('ng-invalid');
			await expect.element(tester.rating).toHaveCssClass('ng-untouched');

			tester.componentInstance.form.patchValue({ rating: 3 });
			await tester.whenStable();

			await tester.expectStarsStateToBe([true, true, true, false, false]);
			await expect.element(tester.rating).toHaveCssClass('ng-valid');
			await expect.element(tester.rating).toHaveCssClass('ng-untouched');

			tester.componentInstance.form.patchValue({ rating: 0 });
			await tester.whenStable();

			await tester.expectStarsStateToBe([false, false, false, false, false]);
			await expect.element(tester.rating).toHaveCssClass('ng-valid');
			await expect.element(tester.rating).toHaveCssClass('ng-untouched');
		});

		it('should not update template driven form by clicking disabled control', async () => {
			class RatingDisabledTester {
				readonly fixture = createGenericTestComponent(
					`
					<ngb-rating [(ngModel)]="model" class="control" max="5"/>
          			<ngb-rating [(ngModel)]="model" class="control-disabled" max="5" disabled/>	
				`,
					TestComponent,
					false,
				);
				readonly componentInstance = this.fixture.componentInstance;
				readonly root = page.elementLocator(this.fixture.nativeElement);
				readonly rating = this.root.getByCss('ngb-rating').nth(0);
				readonly disabledRating = this.root.getByCss('ngb-rating').nth(1);
				readonly stars = this.rating.getByCss('span:not(.visually-hidden)');
				readonly disabledStars = this.disabledRating.getByCss('span:not(.visually-hidden)');

				async whenStable() {
					await this.fixture.whenStable();
				}
				async expectStarsStateToBe(expected: boolean[]) {
					await expect
						.poll(() => this.stars.elements().map((start) => start.textContent.trim() === String.fromCharCode(9733)))
						.toEqual(expected);
				}
				async expectDisabledStarsStateToBe(expected: boolean[]) {
					await expect
						.poll(() =>
							this.disabledStars.elements().map((start) => start.textContent.trim() === String.fromCharCode(9733)),
						)
						.toEqual(expected);
				}
			}

			const tester = new RatingDisabledTester();
			await tester.whenStable();

			await tester.stars.nth(2).click();
			await tester.whenStable();

			await tester.expectStarsStateToBe([true, true, true, false, false]);
			await expect.element(tester.rating).not.toHaveAttribute('aria-disabled');
			await tester.expectDisabledStarsStateToBe([false, false, false, false, false]);
			await expect.element(tester.disabledRating).toHaveAttribute('aria-disabled', 'true');
			expect(tester.componentInstance.model()).toEqual(3);

			await tester.disabledStars.nth(3).click();
			await tester.whenStable();

			await tester.expectStarsStateToBe([true, true, true, false, false]);
			await tester.expectDisabledStarsStateToBe([false, false, false, false, false]);
			expect(tester.componentInstance.model()).toEqual(3);
		});

		it('should handle clicks and update form control', async () => {
			const tester = await RatingTester.create(`
				<form [formGroup]="form">
					<ngb-rating formControlName="rating" max="5"/>
				</form>
			`);

			await tester.expectStarsStateToBe([false, false, false, false, false]);
			await expect.element(tester.rating).toHaveCssClass('ng-invalid');
			await expect.element(tester.rating).toHaveCssClass('ng-untouched');

			await tester.stars.nth(2).click();
			await tester.whenStable();

			await tester.expectStarsStateToBe([true, true, true, false, false]);
			expect(tester.componentInstance.form.get('rating')!.value).toBe(3);
			await expect.element(tester.rating).toHaveCssClass('ng-valid');
			await expect.element(tester.rating).toHaveCssClass('ng-touched');
		});

		it('should work with both rate input and form control', async () => {
			const tester = await RatingTester.create(`
				<form [formGroup]="form">
					<ngb-rating [(rate)]="rate" formControlName="rating" max="5"/>
				</form>/>
			`);

			await tester.expectStarsStateToBe([false, false, false, false, false]);
			await expect.element(tester.rating).toHaveCssClass('ng-valid');

			await tester.stars.nth(1).click();
			await tester.whenStable();

			await tester.expectStarsStateToBe([true, true, false, false, false]);
			expect(tester.componentInstance.rate()).toBe(2);
			expect(tester.componentInstance.form.get('rating')!.value).toBe(2);
			await expect.element(tester.rating).toHaveCssClass('ng-valid');

			tester.componentInstance.rate.set(4);
			await tester.whenStable();

			await tester.expectStarsStateToBe([true, true, true, true, false]);
			expect(tester.componentInstance.form.get('rating')!.value).toBe(4);
			await expect.element(tester.rating).toHaveCssClass('ng-valid');
		});

		it('should disable widget when a control is disabled', async () => {
			const tester = await RatingTester.create(`
				<form [formGroup]="form">
					<ngb-rating formControlName="rating" max="5"/>
				</form>
			`);

			await tester.expectStarsStateToBe([false, false, false, false, false]);
			expect(tester.componentInstance.form.get('rating')!.disabled).toBeFalsy();

			tester.componentInstance.form.get('rating')!.disable();
			await tester.whenStable();

			expect(tester.componentInstance.form.get('rating')!.disabled).toBeTruthy();

			await tester.stars.nth(2).click();
			await tester.whenStable();

			await tester.expectStarsStateToBe([false, false, false, false, false]);
		});

		it('should mark control as touched on blur', async () => {
			const tester = await RatingTester.create(`
				<form [formGroup]="form">
					<ngb-rating formControlName="rating" max="5"/>
				</form>
			`);
			const element = tester.fixture.debugElement.query(By.directive(NgbRating));

			await tester.expectStarsStateToBe([false, false, false, false, false]);
			await expect.element(tester.rating).toHaveCssClass('ng-untouched');

			element.triggerEventHandler('blur', {});
			await tester.whenStable();

			await tester.expectStarsStateToBe([false, false, false, false, false]);
			await expect.element(tester.rating).toHaveCssClass('ng-touched');
		});
	});

	describe('Custom config', () => {
		const config = new NgbRatingConfig();
		config.max = 5;
		config.readonly = true;

		beforeEach(() => {
			TestBed.configureTestingModule({
				providers: [{ provide: NgbRatingConfig, useValue: config }],
			});
		});

		it('should initialize inputs with provided config', () => {
			const fixture = TestBed.createComponent(NgbRating);
			fixture.detectChanges();

			let rating = fixture.componentInstance;
			expect(rating.max).toBe(config.max);
			expect(rating.readonly).toBe(config.readonly);
		});
	});

	describe('Custom config as provider', () => {
		let config: NgbRatingConfig;

		beforeEach(() => {
			TestBed.configureTestingModule({
				providers: [NgbRatingConfig],
			});
			config = TestBed.inject(NgbRatingConfig);
			config.max = 5;
			config.readonly = true;
		});

		it('should initialize inputs with provided config as provider', () => {
			const fixture = TestBed.createComponent(NgbRating);
			fixture.detectChanges();

			let rating = fixture.componentInstance;
			expect(rating.max).toBe(config.max);
			expect(rating.readonly).toBe(config.readonly);
		});
	});
});

@Component({
	selector: 'test-cmp',
	imports: [NgbRating, FormsModule, ReactiveFormsModule],
	template: '',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestComponent {
	changed = signal(false);
	disabled = signal(false);
	readonly = signal(false);
	form = new UntypedFormGroup({ rating: new UntypedFormControl(null, Validators.required) });
	formControl = new FormControl(0);
	max = signal(10);
	model = signal<undefined | number>(undefined);
	rate = signal(3);
	tabindex = signal<undefined | string | number>(3);
	customAriaValueTextFunction = (current: number, max: number) => `Rating: ${current} out of ${max} stars`;
}
