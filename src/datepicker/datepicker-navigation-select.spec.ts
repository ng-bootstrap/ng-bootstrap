import { TestBed } from '@angular/core/testing';
import { createGenericAsyncTestComponent, ignoreTrackWarnings, triggerEvent } from '../test/common';
import { getMonthSelect, getYearSelect } from '../test/datepicker/common';

import { Component, signal } from '@angular/core';

import { NgbDatepickerNavigationSelect } from './datepicker-navigation-select';
import { NgbDate } from './ngb-date';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const createTestComponent = (html: string) => createGenericAsyncTestComponent(html, TestComponent);

const getOptions = (element: HTMLSelectElement): HTMLOptionElement[] => Array.from(element.options);
const getOptionValues = (element: HTMLSelectElement): string[] => getOptions(element).map((x) => x.value);

function changeSelect(element: HTMLSelectElement, value: string) {
	element.value = value;
	triggerEvent(element, 'change');
}

describe('ngb-datepicker-navigation-select', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({});
	});

	it('should generate month options correctly', async () => {
		const fixture = await createTestComponent(
			`<ngb-datepicker-navigation-select [date]="date()" [months]="months()" [years]="years()">`,
		);
		expect(getOptionValues(getMonthSelect(fixture.nativeElement))).toEqual([
			'1',
			'2',
			'3',
			'4',
			'5',
			'6',
			'7',
			'8',
			'9',
			'10',
		]);

		fixture.componentInstance.months.set([1, 2, 3]);
		await fixture.whenStable();
		expect(getOptionValues(getMonthSelect(fixture.nativeElement))).toEqual(['1', '2', '3']);
	});

	it('should generate year options correctly', async () => {
		ignoreTrackWarnings();
		const fixture = await createTestComponent(
			`<ngb-datepicker-navigation-select [date]="date()" [months]="months()" [years]="years()">`,
		);

		const yearSelect = getYearSelect(fixture.nativeElement);
		expect(getOptionValues(yearSelect)).toEqual(['2015', '2016', '2017']);

		fixture.componentInstance.years.set([2001, 2002, 2003]);
		await fixture.whenStable();
		expect(getOptionValues(yearSelect)).toEqual(['2001', '2002', '2003']);
	});

	it('should send date selection events', async () => {
		const fixture = await createTestComponent(
			`<ngb-datepicker-navigation-select [date]="date()" [months]="months()" [years]="years()" (select)="onSelect($event)">`,
		);

		const monthSelect = getMonthSelect(fixture.nativeElement);
		const yearSelect = getYearSelect(fixture.nativeElement);
		vi.spyOn(fixture.componentInstance, 'onSelect');

		changeSelect(monthSelect, '2');
		expect(fixture.componentInstance.onSelect).toHaveBeenCalledWith(new NgbDate(2016, 2, 1));

		changeSelect(monthSelect, '10');
		expect(fixture.componentInstance.onSelect).toHaveBeenCalledWith(new NgbDate(2016, 10, 1));

		changeSelect(yearSelect, '2017');
		expect(fixture.componentInstance.onSelect).toHaveBeenCalledWith(new NgbDate(2017, 8, 1));

		// out of range
		changeSelect(yearSelect, '2000');
		expect(fixture.componentInstance.onSelect).toHaveBeenCalledWith(new NgbDate(NaN, 8, 1));
	});

	it('should select months and years when date changes', async () => {
		const fixture = await createTestComponent(
			`<ngb-datepicker-navigation-select [date]="date()" [months]="months()" [years]="years()">`,
		);

		expect(getMonthSelect(fixture.nativeElement).value).toBe('8');
		expect(getYearSelect(fixture.nativeElement).value).toBe('2016');

		fixture.componentInstance.date.set(new NgbDate(2017, 9, 22));
		await fixture.whenStable();
		expect(getMonthSelect(fixture.nativeElement).value).toBe('9');
		expect(getYearSelect(fixture.nativeElement).value).toBe('2017');

		// out of range
		fixture.componentInstance.date.set(new NgbDate(2222, 22, 22));
		await fixture.whenStable();
		expect(getMonthSelect(fixture.nativeElement).value).toBe('');
		expect(getYearSelect(fixture.nativeElement).value).toBe('');
	});

	it('should have disabled select boxes when disabled', async () => {
		const fixture = await createTestComponent(
			`<ngb-datepicker-navigation-select [disabled]="true" [date]="date()" [months]="months()" [years]="years()">`,
		);

		expect(getMonthSelect(fixture.nativeElement).disabled).toBe(true);
		expect(getYearSelect(fixture.nativeElement).disabled).toBe(true);
	});

	it('should have correct aria attributes on select options', async () => {
		const fixture = await createTestComponent(
			`<ngb-datepicker-navigation-select [date]="date()" [months]="[7, 8, 9]" [years]="years()">`,
		);

		getOptions(getMonthSelect(fixture.nativeElement)).forEach((option, index) => {
			expect(option.getAttribute('aria-label')).toBe(fixture.componentInstance.ariaMonths()[index]);
		});
	});

	it('should have correct aria attributes on select elements', async () => {
		const fixture = await createTestComponent(
			`<ngb-datepicker-navigation-select [date]="date()" [months]="[7, 8, 9]" [years]="years()">`,
		);

		expect(getMonthSelect(fixture.nativeElement).getAttribute('aria-label')).toBe('Select month');
		expect(getYearSelect(fixture.nativeElement).getAttribute('aria-label')).toBe('Select year');
	});

	it('should have correct title attributes on select elements', async () => {
		const fixture = await createTestComponent(
			`<ngb-datepicker-navigation-select [date]="date()" [months]="[7, 8, 9]" [years]="years()">`,
		);

		expect(getMonthSelect(fixture.nativeElement).getAttribute('title')).toBe('Select month');
		expect(getYearSelect(fixture.nativeElement).getAttribute('title')).toBe('Select year');
	});
});

@Component({
	selector: 'test-cmp',
	imports: [NgbDatepickerNavigationSelect],
	template: '',
})
class TestComponent {
	readonly date = signal(new NgbDate(2016, 8, 22));
	readonly months = signal([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
	readonly ariaMonths = signal(['July', 'August', 'September']);
	readonly years = signal([2015, 2016, 2017]);

	onSelect = (event) => {};
}
