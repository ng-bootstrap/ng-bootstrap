import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { createGenericTestComponent, triggerEvent } from '../test/common';
import { getMonthSelect, getNavigationLinks, getYearSelect } from '../test/monthpicker/common';

import { Component } from '@angular/core';

import { NavigationEvent } from './monthpicker-view-model';
import { NgbMonthpickerNavigation } from './monthpicker-navigation';
import { NgbMonth } from './ngb-month';
import { NgbMonthpickerNavigationSelect } from './monthpicker-navigation-select';

const createTestComponent = (html: string) =>
	createGenericTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;

function changeSelect(element: HTMLSelectElement, value: string) {
	element.value = value;
	triggerEvent(element, 'change');
}

describe('ngb-monthpicker-navigation', () => {
	it('should toggle navigation select component', () => {
		const fixture = createTestComponent(`<ngb-monthpicker-navigation [showSelect]="showSelect" [date]="date"
          [selectBoxes]="selectBoxes"></ngb-monthpicker-navigation>`);

		expect(fixture.debugElement.query(By.directive(NgbMonthpickerNavigationSelect))).not.toBeNull();
		expect(getMonthSelect(fixture.nativeElement).value).toBe('8');
		expect(getYearSelect(fixture.nativeElement).value).toBe('2016');

		fixture.componentInstance.showSelect = false;
		fixture.detectChanges();
		expect(fixture.debugElement.query(By.directive(NgbMonthpickerNavigationSelect))).toBeNull();
	});

	it('should send date selection event', () => {
		const fixture = createTestComponent(`<ngb-monthpicker-navigation [showSelect]="true" [date]="date"
          [selectBoxes]="selectBoxes" (select)="onSelect($event)"></ngb-monthpicker-navigation>`);

		const monthSelect = getMonthSelect(fixture.nativeElement);
		const yearSelect = getYearSelect(fixture.nativeElement);
		spyOn(fixture.componentInstance, 'onSelect');

		changeSelect(monthSelect, '2');
		expect(fixture.componentInstance.onSelect).toHaveBeenCalledWith(new NgbMonth(2016, 2));

		changeSelect(yearSelect, '2020');
		expect(fixture.componentInstance.onSelect).toHaveBeenCalledWith(new NgbMonth(2020, 8));
	});

	it('should make prev navigation button disabled', () => {
		const fixture = createTestComponent(
			`<ngb-monthpicker-navigation [prevDisabled]="prevDisabled"></ngb-monthpicker-navigation>`,
		);

		const links = getNavigationLinks(fixture.nativeElement);
		expect(links[0].hasAttribute('disabled')).toBeFalsy();

		fixture.componentInstance.prevDisabled = true;
		fixture.detectChanges();
		expect(links[0].hasAttribute('disabled')).toBeTruthy();
	});

	it('should make next navigation button disabled', () => {
		const fixture = createTestComponent(
			`<ngb-monthpicker-navigation [nextDisabled]="nextDisabled"></ngb-monthpicker-navigation>`,
		);

		const links = getNavigationLinks(fixture.nativeElement);
		expect(links[1].hasAttribute('disabled')).toBeFalsy();

		fixture.componentInstance.nextDisabled = true;
		fixture.detectChanges();
		expect(links[1].hasAttribute('disabled')).toBeTruthy();
	});

	it('should make year and month select boxes disabled', () => {
		const fixture = createTestComponent(`<ngb-monthpicker-navigation [disabled]="true" [date]="date"
      [showSelect]="true" [selectBoxes]="selectBoxes"></ngb-monthpicker-navigation>`);

		expect(getYearSelect(fixture.nativeElement).disabled).toBeTruthy();
		expect(getMonthSelect(fixture.nativeElement).disabled).toBeTruthy();
	});

	it('should send navigation events', () => {
		const fixture = createTestComponent(
			`<ngb-monthpicker-navigation (navigate)="onNavigate($event)"></ngb-monthpicker-navigation>`,
		);
		const [previousButton, nextButton] = getNavigationLinks(fixture.nativeElement);
		const previousButtonSpan = previousButton.querySelector<HTMLElement>('span')!;
		const nextButtonSpan = nextButton.querySelector<HTMLElement>('span')!;
		spyOn(fixture.componentInstance, 'onNavigate');

		// prev
		previousButton.click();
		expect(fixture.componentInstance.onNavigate).toHaveBeenCalledWith(NavigationEvent.PREV);
		previousButtonSpan.click();
		expect(fixture.componentInstance.onNavigate).toHaveBeenCalledWith(NavigationEvent.PREV);

		// next
		nextButton.click();
		expect(fixture.componentInstance.onNavigate).toHaveBeenCalledWith(NavigationEvent.NEXT);
		nextButtonSpan.click();
		expect(fixture.componentInstance.onNavigate).toHaveBeenCalledWith(NavigationEvent.NEXT);
	});

	it('should retain focus on the navigation links after click', () => {
		const fixture = createTestComponent(`<ngb-monthpicker-navigation></ngb-monthpicker-navigation>`);
		const [previousButton, nextButton] = getNavigationLinks(fixture.nativeElement);

		// prev
		previousButton.click();
		expect(document.activeElement).toBe(previousButton);

		// next
		nextButton.click();
		expect(document.activeElement).toBe(nextButton);
	});

	it('should have buttons of type button', () => {
		const fixture = createTestComponent(`<ngb-monthpicker-navigation></ngb-monthpicker-navigation>`);

		const links = getNavigationLinks(fixture.nativeElement);
		links.forEach((link) => {
			expect(link.getAttribute('type')).toBe('button');
		});
	});

	it('should have correct titles and aria attributes on buttons', () => {
		const fixture = createTestComponent(`<ngb-monthpicker-navigation></ngb-monthpicker-navigation>`);

		const links = getNavigationLinks(fixture.nativeElement);
		expect(links[0].getAttribute('aria-label')).toBe('Previous month');
		expect(links[1].getAttribute('aria-label')).toBe('Next month');
		expect(links[0].getAttribute('title')).toBe('Previous month');
		expect(links[1].getAttribute('title')).toBe('Next month');
	});
});

@Component({ selector: 'test-cmp', standalone: true, imports: [NgbMonthpickerNavigation], template: '' })
class TestComponent {
	date = new NgbMonth(2016, 8);
	prevDisabled = false;
	nextDisabled = false;
	showSelect = true;
	selectBoxes = { years: [2015, 2016, 2017, 2018, 2019, 2020] };

	onNavigate = (event) => {};
	onSelect = (date) => {};
}
