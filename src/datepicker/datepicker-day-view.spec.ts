import { TestBed } from '@angular/core/testing';

import { Component, signal } from '@angular/core';
import { NgbDate, NgbDatepickerDayView } from './datepicker.module';
import { beforeEach, describe, expect, it } from 'vitest';

function getElement(element: HTMLElement): HTMLElement {
	return <HTMLElement>element.querySelector('[ngbDatepickerDayView]');
}

describe('ngbDatepickerDayView', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({});
	});

	it('should display date', async () => {
		const fixture = TestBed.createComponent(TestComponent);
		await fixture.whenStable();

		const el = getElement(fixture.nativeElement);
		expect(el.innerText).toBe('22');

		fixture.componentInstance.date.set(new NgbDate(2016, 7, 25));
		await fixture.whenStable();
		expect(el.innerText).toBe('25');
	});

	it('should apply text-muted style for disabled days', async () => {
		const fixture = TestBed.createComponent(TestComponent);
		await fixture.whenStable();

		const el = getElement(fixture.nativeElement);
		expect(el).not.toHaveCssClass('text-muted');

		fixture.componentInstance.disabled.set(true);
		await fixture.whenStable();
		expect(el).toHaveCssClass('text-muted');
	});

	it('should apply text-muted and outside classes for days of a different month', async () => {
		const fixture = TestBed.createComponent(TestComponent);
		await fixture.whenStable();

		const el = getElement(fixture.nativeElement);
		expect(el).not.toHaveCssClass('text-muted');
		expect(el).not.toHaveCssClass('outside');

		fixture.componentInstance.date.set(new NgbDate(2016, 8, 22));
		await fixture.whenStable();
		expect(el).toHaveCssClass('text-muted');
		expect(el).toHaveCssClass('outside');
	});

	it('should apply selected style', async () => {
		const fixture = TestBed.createComponent(TestComponent);
		await fixture.whenStable();

		const el = getElement(fixture.nativeElement);
		expect(el).not.toHaveCssClass('text-white');
		expect(el).not.toHaveCssClass('bg-primary');

		fixture.componentInstance.selected.set(true);
		await fixture.whenStable();
		expect(el).toHaveCssClass('text-white');
		expect(el).toHaveCssClass('bg-primary');
	});

	it('should not apply muted style if disabled but selected', async () => {
		const fixture = TestBed.createComponent(TestComponent);
		fixture.componentInstance.disabled.set(true);
		fixture.componentInstance.selected.set(true);
		await fixture.whenStable();

		const el = getElement(fixture.nativeElement);
		expect(el).toHaveCssClass('bg-primary');
		expect(el).not.toHaveCssClass('text-muted');
	});
});

@Component({
	selector: 'test-cmp',
	imports: [NgbDatepickerDayView],
	template:
		'<div ngbDatepickerDayView [date]="date()" [currentMonth]="currentMonth()" [selected]="selected()" [disabled]="disabled()"></div>',
})
class TestComponent {
	readonly currentMonth = signal(7);
	readonly date = signal(new NgbDate(2016, 7, 22));
	readonly disabled = signal(false);
	readonly selected = signal(false);
}
