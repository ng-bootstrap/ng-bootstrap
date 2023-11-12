import { ComponentFixture } from '@angular/core/testing';
import { createGenericTestComponent, triggerEvent } from '../test/common';
import { getMonthSelect, getYearSelect } from '../test/monthpicker/common';

import { Component } from '@angular/core';

import { NgbMonthpickerNavigationSelect } from './monthpicker-navigation-select';
import { NgbMonth } from './ngb-month';

const createTestComponent = (html: string) =>
	createGenericTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;

const getOptions = (element: HTMLSelectElement): HTMLOptionElement[] => Array.from(element.options);
const getOptionValues = (element: HTMLSelectElement): string[] => getOptions(element).map((x) => x.value);

function changeSelect(element: HTMLSelectElement, value: string) {
	element.value = value;
	triggerEvent(element, 'change');
}

describe('ngb-monthpicker-navigation-select', () => {
	it('should generate month options correctly', () => {
		const fixture = createTestComponent(
			`<ngb-monthpicker-navigation-select [date]="date" [months]="months" [years]="years">`,
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

		fixture.componentInstance.months = [1, 2, 3];
		fixture.detectChanges();
		expect(getOptionValues(getMonthSelect(fixture.nativeElement))).toEqual(['1', '2', '3']);
	});

	it('should generate year options correctly', () => {
		const fixture = createTestComponent(
			`<ngb-monthpicker-navigation-select [date]="date" [months]="months" [years]="years">`,
		);

		const yearSelect = getYearSelect(fixture.nativeElement);
		expect(getOptionValues(yearSelect)).toEqual(['2015', '2016', '2017']);

		fixture.componentInstance.years = [2001, 2002, 2003];
		fixture.detectChanges();
		expect(getOptionValues(yearSelect)).toEqual(['2001', '2002', '2003']);
	});

	it('should send date selection events', () => {
		const fixture = createTestComponent(
			`<ngb-monthpicker-navigation-select [date]="date" [months]="months" [years]="years" (select)="onSelect($event)">`,
		);

		const monthSelect = getMonthSelect(fixture.nativeElement);
		const yearSelect = getYearSelect(fixture.nativeElement);
		spyOn(fixture.componentInstance, 'onSelect');

		changeSelect(monthSelect, '2');
		expect(fixture.componentInstance.onSelect).toHaveBeenCalledWith(new NgbMonth(2016, 2));

		changeSelect(monthSelect, '10');
		expect(fixture.componentInstance.onSelect).toHaveBeenCalledWith(new NgbMonth(2016, 10));

		changeSelect(yearSelect, '2017');
		expect(fixture.componentInstance.onSelect).toHaveBeenCalledWith(new NgbMonth(2017, 8));

		// out of range
		changeSelect(yearSelect, '2000');
		expect(fixture.componentInstance.onSelect).toHaveBeenCalledWith(new NgbMonth(NaN, 8));
	});

	it('should select months and years when date changes', () => {
		const fixture = createTestComponent(
			`<ngb-monthpicker-navigation-select [date]="date" [months]="months" [years]="years">`,
		);

		expect(getMonthSelect(fixture.nativeElement).value).toBe('8');
		expect(getYearSelect(fixture.nativeElement).value).toBe('2016');

		fixture.componentInstance.date = new NgbMonth(2017, 9);
		fixture.detectChanges();
		expect(getMonthSelect(fixture.nativeElement).value).toBe('9');
		expect(getYearSelect(fixture.nativeElement).value).toBe('2017');

		// out of range
		fixture.componentInstance.date = new NgbMonth(2222, 22);
		fixture.detectChanges();
		expect(getMonthSelect(fixture.nativeElement).value).toBe('');
		expect(getYearSelect(fixture.nativeElement).value).toBe('');
	});

	it('should have disabled select boxes when disabled', () => {
		const fixture = createTestComponent(
			`<ngb-monthpicker-navigation-select [disabled]="true" [date]="date" [months]="months" [years]="years">`,
		);

		expect(getMonthSelect(fixture.nativeElement).disabled).toBe(true);
		expect(getYearSelect(fixture.nativeElement).disabled).toBe(true);
	});

	it('should have correct aria attributes on select options', () => {
		const fixture = createTestComponent(
			`<ngb-monthpicker-navigation-select [date]="date" [months]="[7, 8, 9]" [years]="years">`,
		);

		getOptions(getMonthSelect(fixture.nativeElement)).forEach((option, index) => {
			expect(option.getAttribute('aria-label')).toBe(fixture.componentInstance.ariaMonths[index]);
		});
	});

	it('should have correct aria attributes on select elements', () => {
		const fixture = createTestComponent(
			`<ngb-monthpicker-navigation-select [date]="date" [months]="[7, 8, 9]" [years]="years">`,
		);

		expect(getMonthSelect(fixture.nativeElement).getAttribute('aria-label')).toBe('Select month');
		expect(getYearSelect(fixture.nativeElement).getAttribute('aria-label')).toBe('Select year');
	});

	it('should have correct title attributes on select elements', () => {
		const fixture = createTestComponent(
			`<ngb-monthpicker-navigation-select [date]="date" [months]="[7, 8, 9]" [years]="years">`,
		);

		expect(getMonthSelect(fixture.nativeElement).getAttribute('title')).toBe('Select month');
		expect(getYearSelect(fixture.nativeElement).getAttribute('title')).toBe('Select year');
	});
});

@Component({ selector: 'test-cmp', standalone: true, imports: [NgbMonthpickerNavigationSelect], template: '' })
class TestComponent {
	date = new NgbMonth(2016, 8);
	months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	ariaMonths = ['July', 'August', 'September'];
	years = [2015, 2016, 2017];

	onSelect = (event) => {};
}
