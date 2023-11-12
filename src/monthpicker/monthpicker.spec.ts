import { TestBed, ComponentFixture, inject, fakeAsync, tick } from '@angular/core/testing';
import { createGenericTestComponent, triggerEvent } from '../test/common';
import { getMonthSelect, getYearSelect, getNavigationLinks } from '../test/monthpicker/common';

import { Component, TemplateRef, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule, UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';

import { NgbMonthpickerModule, NgbMonthpickerNavigateEvent } from './monthpicker.module';
import { NgbMonth } from './ngb-month';
import { NgbMonthpickerConfig } from './monthpicker-config';
import { NgbMonthpicker, NgbMonthpickerState } from './monthpicker';
import { MonthTemplateContext } from './monthpicker-month-template-context';
import { NgbMonthStruct } from './ngb-month-struct';
import { NgbMonthpickerYear } from './monthpicker';
import { NgbMonthpickerMonthView } from './monthpicker-month-view';
import { NgbMonthpickerKeyboardService } from './monthpicker-keyboard-service';
import { NgbMonthpickerNavigationSelect } from './monthpicker-navigation-select';
import { NgbMonthpickerNavigation } from './monthpicker-navigation';
import { TranslationWidth } from '@angular/common';

const createTestComponent = (html: string) =>
	createGenericTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;

function getDates(element: HTMLElement): HTMLElement[] {
	return <HTMLElement[]>Array.from(element.querySelectorAll('.ngb-dp-day'));
}

function getDay(element: HTMLElement, index: number): HTMLElement {
	return getDates(element)[index].querySelector('div') as HTMLElement;
}

function getMonthpicker(element: HTMLElement): HTMLElement {
	return element.querySelector('ngb-monthpicker') as HTMLElement;
}

function getFocusableDays(element: DebugElement): DebugElement[] {
	return <DebugElement[]>Array.from(element.queryAll(By.css('div.ngb-dp-day[tabindex="0"]')));
}

function getSelectedDays(element: DebugElement): DebugElement[] {
	return <DebugElement[]>Array.from(element.queryAll(By.css('div.ngb-dp-day > div.bg-primary')));
}

function getWeekdays(element: HTMLElement): string[] {
	return (<HTMLElement[]>Array.from(element.querySelectorAll('.ngb-dp-weekday')) || []).map((el) =>
		el.textContent!.trim(),
	);
}

function focusDay() {
	const element = document.querySelector('div.ngb-dp-day[tabindex="0"]') as HTMLElement;
	triggerEvent(element, 'focusin');
	element.focus();
}

function triggerKeyDown(element: DebugElement, keyCode: number, shiftKey = false) {
	let event = {
		which: keyCode,
		shiftKey: shiftKey,
		defaultPrevented: false,
		propagationStopped: false,
		stopPropagation: function () {
			this.propagationStopped = true;
		},
		preventDefault: function () {
			this.defaultPrevented = true;
		},
	};
	expect(document.activeElement!.classList.contains('ngb-dp-day')).toBeTruthy(
		'You must focus day before triggering key events',
	);
	element.triggerEventHandler('keydown', event);
	return event;
}

function getMonthContainer(monthpicker: DebugElement) {
	return monthpicker.query(By.css('ngb-monthpicker-month'));
}

function expectSelectedDate(element: DebugElement, selectedDate: NgbMonth | null) {
	// checking we have 1 day with .selected class
	const days = getSelectedDays(element);

	if (selectedDate) {
		expect(days.length).toBe(1);

		// checking it corresponds to our date
		const day = days[0];
		const dayView = day.parent!.query(By.directive(NgbMonthpickerMonthView))
			.componentInstance as NgbMonthpickerMonthView;
		expect(NgbMonth.from(dayView.date)).toEqual(selectedDate);
	} else {
		expect(days.length).toBe(0);
	}
}

function expectFocusedDate(element: DebugElement, focusableDate: NgbMonth, isFocused = true) {
	// checking we have 1 day with tabIndex 0
	const days = getFocusableDays(element);
	expect(days.length).toBe(1);

	const day = days[0];

	// checking it corresponds to our date
	const dayView = day.query(By.directive(NgbMonthpickerMonthView)).componentInstance as NgbMonthpickerMonthView;
	expect(NgbMonth.from(dayView.date)).toEqual(focusableDate);

	// checking the active class
	// Unable to test it because of unknown failure (works when tested manually)
	// expect(day.queryAll(By.css('div.active')).length).toEqual(1, `The day must have a single element with the active
	// class`);

	// checking it is focused by the browser
	if (isFocused) {
		expect(document.activeElement).toBe(day.nativeElement, `Date HTML element for ${focusableDate} is not focused`);
	} else {
		expect(document.activeElement).not.toBe(
			day.nativeElement,
			`Date HTML element for ${focusableDate} must not be focused`,
		);
	}
}

function expectSameValues(monthpicker: NgbMonthpicker, config: NgbMonthpickerConfig) {
	expect(monthpicker.monthTemplate).toBe(config.monthTemplate);
	expect(monthpicker.monthTemplateData).toBe(config.monthTemplateData);
	expect(monthpicker.displayYears).toBe(config.displayYears);
	expect(monthpicker.footerTemplate).toBe(config.footerTemplate);
	expect(monthpicker.markDisabled).toBe(config.markDisabled);
	expect(monthpicker.minDate).toEqual(config.minDate);
	expect(monthpicker.maxDate).toEqual(config.maxDate);
	expect(monthpicker.navigation).toBe(config.navigation);
	expect(monthpicker.startDate).toEqual(config.startDate);
}

function customizeConfig(config: NgbMonthpickerConfig) {
	config.monthTemplate = {} as TemplateRef<MonthTemplateContext>;
	config.monthTemplateData = (date, current) => 42;
	config.footerTemplate = {} as TemplateRef<any>;
	config.markDisabled = (date, current) => false;
	config.minDate = { year: 2000, month: 1 };
	config.maxDate = { year: 2030, month: 12 };
	config.navigation = 'none';
	config.startDate = { year: 2015, month: 1 };
}

describe('ngb-monthpicker', () => {
	it('should initialize inputs with provided config', () => {
		const defaultConfig = new NgbMonthpickerConfig();
		const monthpicker = TestBed.createComponent(NgbMonthpicker).componentInstance;
		expectSameValues(monthpicker, defaultConfig);
	});

	it('should display current year if no date provided', () => {
		const fixture = createTestComponent(`<ngb-monthpicker></ngb-monthpicker>`);

		const today = new Date();
		expect(getYearSelect(fixture.nativeElement).value).toBe(`${today.getFullYear()}`);
	});

	it('should throw if max date is before min date', () => {
		expect(() => {
			createTestComponent('<ngb-monthpicker [minDate]="maxDate" [maxDate]="minDate"></ngb-monthpicker>');
		}).toThrowError();
	});

	it('should allow changing min/max dates at the same time', () => {
		const fixture = createTestComponent('<ngb-monthpicker [minDate]="minDate" [maxDate]="maxDate"></ngb-monthpicker>');

		expect(() => {
			fixture.componentInstance.minDate = { year: 2110, month: 1 };
			fixture.componentInstance.maxDate = { year: 2120, month: 12 };
			fixture.detectChanges();

			fixture.componentInstance.minDate = { year: 2010, month: 1 };
			fixture.componentInstance.maxDate = { year: 2020, month: 12 };
			fixture.detectChanges();
		}).not.toThrowError();
	});

	it('should handle incorrect startDate values', () => {
		const fixture = createTestComponent(`<ngb-monthpicker [startDate]="date"></ngb-monthpicker>`);
		const today = new Date();
		const currentMonth = `${today.getMonth() + 1}`;
		const currentYear = `${today.getFullYear()}`;

		expect(getMonthSelect(fixture.nativeElement).value).toBe('8');
		expect(getYearSelect(fixture.nativeElement).value).toBe('2016');

		fixture.componentInstance.date = <any>null;
		fixture.detectChanges();
		expect(getMonthSelect(fixture.nativeElement).value).toBe(currentMonth);
		expect(getYearSelect(fixture.nativeElement).value).toBe(currentYear);

		fixture.componentInstance.date = <any>undefined;
		fixture.detectChanges();
		expect(getMonthSelect(fixture.nativeElement).value).toBe(currentMonth);
		expect(getYearSelect(fixture.nativeElement).value).toBe(currentYear);

		fixture.componentInstance.date = <any>{};
		fixture.detectChanges();
		expect(getMonthSelect(fixture.nativeElement).value).toBe(currentMonth);
		expect(getYearSelect(fixture.nativeElement).value).toBe(currentYear);

		fixture.componentInstance.date = <any>new Date();
		fixture.detectChanges();
		expect(getMonthSelect(fixture.nativeElement).value).toBe(currentMonth);
		expect(getYearSelect(fixture.nativeElement).value).toBe(currentYear);

		fixture.componentInstance.date = new NgbMonth(3000000, 1);
		fixture.detectChanges();
		expect(getMonthSelect(fixture.nativeElement).value).toBe(currentMonth);
		expect(getYearSelect(fixture.nativeElement).value).toBe(currentYear);
	});

	it(`should display weekdays by default`, () => {
		const fixture = createTestComponent(`<ngb-monthpicker [startDate]="date"></ngb-monthpicker>`);
		expect(getWeekdays(fixture.nativeElement)).toEqual(['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']);
	});

	it(`should allow customizing the way weekdays are displayed (weekdays)`, () => {
		const fixture = createTestComponent(`<ngb-monthpicker [startDate]="date" [weekdays]="weekdays"></ngb-monthpicker>`);
		expect(getWeekdays(fixture.nativeElement)).toEqual(['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']);

		fixture.componentInstance.weekdays = false;
		fixture.detectChanges();
		expect(getWeekdays(fixture.nativeElement)).toEqual([]);

		fixture.componentInstance.weekdays = TranslationWidth.Narrow;
		fixture.detectChanges();
		expect(getWeekdays(fixture.nativeElement)).toEqual(['M', 'T', 'W', 'T', 'F', 'S', 'S']);
	});

	it(`should allow navigation work when startDate value changes`, () => {
		const fixture = createTestComponent(`<ngb-monthpicker [startDate]="getDate()"></ngb-monthpicker>`);

		expect(getMonthSelect(fixture.nativeElement).value).toBe('8');
		expect(getYearSelect(fixture.nativeElement).value).toBe('2016');

		const navigation = getNavigationLinks(fixture.nativeElement);

		// JUL 2016
		navigation[0].click();
		fixture.detectChanges();

		expect(getMonthSelect(fixture.nativeElement).value).toBe('7');
		expect(getYearSelect(fixture.nativeElement).value).toBe('2016');
	});

	it('should allow infinite navigation when min/max dates are not set', () => {
		const fixture = createTestComponent(`<ngb-monthpicker [startDate]="date"></ngb-monthpicker>`);

		fixture.detectChanges();
		expect(getMonthSelect(fixture.nativeElement).value).toBe('8');
		expect(getYearSelect(fixture.nativeElement).value).toBe('2016');

		fixture.componentInstance.date = { year: 1066, month: 2 };
		fixture.detectChanges();
		expect(getMonthSelect(fixture.nativeElement).value).toBe('2');
		expect(getYearSelect(fixture.nativeElement).value).toBe('1066');

		fixture.componentInstance.date = { year: 3066, month: 5 };
		fixture.detectChanges();
		expect(getMonthSelect(fixture.nativeElement).value).toBe('5');
		expect(getYearSelect(fixture.nativeElement).value).toBe('3066');
	});

	it('should allow setting minDate separately', () => {
		const fixture = createTestComponent(`<ngb-monthpicker [minDate]="minDate" [startDate]="date"></ngb-monthpicker>`);

		fixture.componentInstance.minDate = { year: 2000, month: 5 };
		fixture.detectChanges();
		expect(getMonthSelect(fixture.nativeElement).value).toBe('8');
		expect(getYearSelect(fixture.nativeElement).value).toBe('2016');

		fixture.componentInstance.date = { year: 1000, month: 2 };
		fixture.detectChanges();
		expect(getMonthSelect(fixture.nativeElement).value).toBe('5');
		expect(getYearSelect(fixture.nativeElement).value).toBe('2000');

		fixture.componentInstance.date = { year: 3000, month: 5 };
		fixture.detectChanges();
		expect(getMonthSelect(fixture.nativeElement).value).toBe('5');
		expect(getYearSelect(fixture.nativeElement).value).toBe('3000');
	});

	it('should allow setting maxDate separately', () => {
		const fixture = createTestComponent(`<ngb-monthpicker [maxDate]="maxDate" [startDate]="date"></ngb-monthpicker>`);

		fixture.componentInstance.maxDate = { year: 2050, month: 5 };
		fixture.detectChanges();
		expect(getMonthSelect(fixture.nativeElement).value).toBe('8');
		expect(getYearSelect(fixture.nativeElement).value).toBe('2016');

		fixture.componentInstance.date = { year: 3000, month: 2 };
		fixture.detectChanges();
		expect(getMonthSelect(fixture.nativeElement).value).toBe('5');
		expect(getYearSelect(fixture.nativeElement).value).toBe('2050');

		fixture.componentInstance.date = { year: 1000, month: 5 };
		fixture.detectChanges();
		expect(getMonthSelect(fixture.nativeElement).value).toBe('5');
		expect(getYearSelect(fixture.nativeElement).value).toBe('1000');
	});

	it('should handle minDate edge case values', () => {
		const fixture = createTestComponent(`<ngb-monthpicker [minDate]="minDate" [startDate]="date"></ngb-monthpicker>`);
		const monthpicker = fixture.debugElement.query(By.directive(NgbMonthpicker)).injector.get(NgbMonthpicker);

		function expectMinDate(year: number, month: number) {
			monthpicker.navigateTo({ year: 1000, month: 1 });
			fixture.detectChanges();
			expect(getMonthSelect(fixture.nativeElement).value).toBe(`${month}`);
			expect(getYearSelect(fixture.nativeElement).value).toBe(`${year}`);
		}

		expectMinDate(2010, 1);

		// resetting
		fixture.componentInstance.minDate = <any>{};
		fixture.detectChanges();
		expectMinDate(1000, 1);

		// resetting
		fixture.componentInstance.minDate = <any>new Date();
		fixture.detectChanges();
		expectMinDate(1000, 1);

		// resetting
		fixture.componentInstance.minDate = new NgbMonth(3000000, 1);
		fixture.detectChanges();
		expectMinDate(1000, 1);

		// resetting
		fixture.componentInstance.minDate = <any>null;
		fixture.detectChanges();
		expectMinDate(1000, 1);

		// resetting
		fixture.componentInstance.minDate = <any>undefined;
		fixture.detectChanges();
		expectMinDate(1000, 1);
	});

	it('should handle maxDate edge case values', () => {
		const fixture = createTestComponent(`<ngb-monthpicker [maxDate]="maxDate" [startDate]="date"></ngb-monthpicker>`);
		const monthpicker = fixture.debugElement.query(By.directive(NgbMonthpicker)).injector.get(NgbMonthpicker);

		function expectMaxDate(year: number, month: number) {
			monthpicker.navigateTo({ year: 10000, month: 1 });
			fixture.detectChanges();
			expect(getMonthSelect(fixture.nativeElement).value).toBe(`${month}`);
			expect(getYearSelect(fixture.nativeElement).value).toBe(`${year}`);
		}

		expectMaxDate(2020, 12);

		// resetting
		fixture.componentInstance.maxDate = <any>{};
		fixture.detectChanges();
		expectMaxDate(10000, 1);

		// resetting
		fixture.componentInstance.maxDate = <any>new Date();
		fixture.detectChanges();
		expectMaxDate(10000, 1);

		// resetting
		fixture.componentInstance.maxDate = new NgbMonth(3000000, 1);
		fixture.detectChanges();
		expectMaxDate(10000, 1);

		// resetting
		fixture.componentInstance.maxDate = <any>null;
		fixture.detectChanges();
		expectMaxDate(10000, 1);

		// resetting
		fixture.componentInstance.maxDate = <any>undefined;
		fixture.detectChanges();
		expectMaxDate(10000, 1);
	});

	it('should support disabling dates via min/max dates', () => {
		const fixture = createTestComponent(
			`<ngb-monthpicker [startDate]="date" [minDate]="minDate" [maxDate]="maxDate"></ngb-monthpicker>`,
		);

		fixture.componentInstance.minDate = { year: 2016, month: 8 };
		fixture.componentInstance.maxDate = { year: 2016, month: 8 };
		fixture.detectChanges();

		// 19 AUG 2016
		expect(getDay(fixture.nativeElement, 18)).toHaveCssClass('text-muted');
		// 20 AUG 2016
		expect(getDay(fixture.nativeElement, 19)).not.toHaveCssClass('text-muted');
		// 25 AUG 2016
		expect(getDay(fixture.nativeElement, 24)).not.toHaveCssClass('text-muted');
		// 26 AUG 2016
		expect(getDay(fixture.nativeElement, 25)).toHaveCssClass('text-muted');
	});

	it('should support disabling dates via callback', () => {
		const fixture = createTestComponent(
			`<ngb-monthpicker [startDate]="date" [minDate]="minDate" [maxDate]="maxDate" [markDisabled]="markDisabled"></ngb-monthpicker>`,
		);

		// 22 AUG 2016
		expect(getDay(fixture.nativeElement, 21)).toHaveCssClass('text-muted');
	});

	it('should support passing custom data to the day template', () => {
		const fixture = createTestComponent(`
      <ng-template #dt let-date="date" let-data="data"><div>{{ date.day }}{{ data }}</div></ng-template>
      <ngb-monthpicker [startDate]="date" [monthTemplate]="dt" [monthTemplateData]="monthTemplateData"></ngb-monthpicker>
    `);

		// 22 AUG 2016
		expect(getDay(fixture.nativeElement, 21).innerText).toBe('22!');
	});

	it('should display multiple months', () => {
		const fixture = createTestComponent(`<ngb-monthpicker [displayMonths]="displayMonths"></ngb-monthpicker>`);

		let months = fixture.debugElement.queryAll(By.directive(NgbMonthpickerYear));
		expect(months.length).toBe(1);

		fixture.componentInstance.displayMonths = 3;
		fixture.detectChanges();
		months = fixture.debugElement.queryAll(By.directive(NgbMonthpickerYear));
		expect(months.length).toBe(3);
	});

	it('should reuse DOM elements when changing month (single month display)', () => {
		const fixture = createTestComponent(`<ngb-monthpicker [startDate]="date"></ngb-monthpicker>`);

		// AUG 2016
		const oldDates = getDates(fixture.nativeElement);
		const navigation = getNavigationLinks(fixture.nativeElement);
		expect(oldDates[0].innerText.trim()).toBe('1');

		// JUL 2016
		navigation[0].click();
		fixture.detectChanges();

		const newDates = getDates(fixture.nativeElement);
		expect(newDates[0].innerText.trim()).toBe('27');

		expect(oldDates).toEqual(newDates);
	});

	it('should reuse DOM elements when changing month (multiple months display)', () => {
		const fixture = createTestComponent(`<ngb-monthpicker [displayMonths]="2" [startDate]="date"></ngb-monthpicker>`);

		// AUG 2016 and SEP 2016
		const oldDates = getDates(fixture.nativeElement);
		const oldAugDates = oldDates.slice(0, 42);
		const oldSepDates = oldDates.slice(42);

		const navigation = getNavigationLinks(fixture.nativeElement);
		expect(oldAugDates[0].innerText.trim()).toBe('1');
		expect(oldSepDates[3].innerText.trim()).toBe('1');

		// JUL 2016 and AUG 2016
		navigation[0].click();
		fixture.detectChanges();

		const newDates = getDates(fixture.nativeElement);
		const newJulDates = newDates.slice(0, 42);
		const newAugDates = newDates.slice(42);

		expect(newJulDates[0].innerText.trim()).toBe('27');
		expect(newAugDates[0].innerText.trim()).toBe('1');

		// DOM elements were reused:
		expect(newAugDates).toEqual(oldAugDates);
		expect(newJulDates).toEqual(oldSepDates);
	});

	it('should switch navigation types', () => {
		const fixture = createTestComponent(`<ngb-monthpicker [navigation]="navigation"></ngb-monthpicker>`);

		expect(fixture.debugElement.query(By.directive(NgbMonthpickerNavigationSelect))).not.toBeNull();
		expect(fixture.debugElement.query(By.directive(NgbMonthpickerNavigation))).not.toBeNull();

		fixture.componentInstance.navigation = 'arrows';
		fixture.detectChanges();
		expect(fixture.debugElement.query(By.directive(NgbMonthpickerNavigationSelect))).toBeNull();
		expect(fixture.debugElement.query(By.directive(NgbMonthpickerNavigation))).not.toBeNull();

		fixture.componentInstance.navigation = 'none';
		fixture.detectChanges();
		expect(fixture.debugElement.query(By.directive(NgbMonthpickerNavigationSelect))).toBeNull();
		expect(fixture.debugElement.query(By.directive(NgbMonthpickerNavigation))).toBeNull();
	});

	it('should toggle month names display for a single month', () => {
		const fixture = createTestComponent(
			`<ngb-monthpicker [startDate]="date" [displayMonths]="1" [navigation]="navigation"></ngb-monthpicker>`,
		);

		let months = fixture.debugElement.queryAll(By.css('.ngb-dp-month-name'));
		expect(months.length).toBe(0);

		fixture.componentInstance.navigation = 'arrows';
		fixture.detectChanges();
		months = fixture.debugElement.queryAll(By.css('.ngb-dp-month-name'));
		expect(months.length).toBe(1);
		expect(months.map((c) => c.nativeElement.innerText.trim())).toEqual(['August 2016']);

		fixture.componentInstance.navigation = 'none';
		fixture.detectChanges();
		months = fixture.debugElement.queryAll(By.css('.ngb-dp-month-name'));
		expect(months.length).toBe(1);
		expect(months.map((c) => c.nativeElement.innerText.trim())).toEqual(['August 2016']);
	});

	it('should always display month names for multiple months', () => {
		const fixture = createTestComponent(
			`<ngb-monthpicker [startDate]="date" [displayMonths]="3" [navigation]="navigation"></ngb-monthpicker>`,
		);

		let months = fixture.debugElement.queryAll(By.css('.ngb-dp-month-name'));
		expect(months.length).toBe(3);
		expect(months.map((c) => c.nativeElement.innerText.trim())).toEqual([
			'August 2016',
			'September 2016',
			'October 2016',
		]);

		fixture.componentInstance.navigation = 'arrows';
		fixture.detectChanges();
		months = fixture.debugElement.queryAll(By.css('.ngb-dp-month-name'));
		expect(months.length).toBe(3);
		expect(months.map((c) => c.nativeElement.innerText.trim())).toEqual([
			'August 2016',
			'September 2016',
			'October 2016',
		]);
	});

	it('should emit navigate event when startDate is defined', () => {
		TestBed.overrideComponent(TestComponent, {
			set: { template: `<ngb-monthpicker [startDate]="date" (navigate)="onNavigate($event)"></ngb-monthpicker>` },
		});
		const fixture = TestBed.createComponent(TestComponent);

		spyOn(fixture.componentInstance, 'onNavigate');
		fixture.detectChanges();

		expect(fixture.componentInstance.onNavigate).toHaveBeenCalledWith({
			current: null,
			next: { year: 2016, month: 8 },
			preventDefault: jasmine.any(Function),
		});
	});

	it('should emit navigate event without startDate defined', () => {
		TestBed.overrideComponent(TestComponent, {
			set: { template: `<ngb-monthpicker (navigate)="onNavigate($event)"></ngb-monthpicker>` },
		});
		const fixture = TestBed.createComponent(TestComponent);
		const now = new Date();

		spyOn(fixture.componentInstance, 'onNavigate');
		fixture.detectChanges();

		expect(fixture.componentInstance.onNavigate).toHaveBeenCalledWith({
			current: null,
			next: { year: now.getFullYear(), month: now.getMonth() + 1 },
			preventDefault: jasmine.any(Function),
		});
	});

	it('should emit navigate event using built-in navigation arrows', () => {
		const fixture = createTestComponent(
			`<ngb-monthpicker [startDate]="date" (navigate)="onNavigate($event)"></ngb-monthpicker>`,
		);

		spyOn(fixture.componentInstance, 'onNavigate');
		const navigation = getNavigationLinks(fixture.nativeElement);

		// JUL 2016
		navigation[0].click();
		fixture.detectChanges();
		expect(fixture.componentInstance.onNavigate).toHaveBeenCalledWith({
			current: { year: 2016, month: 8 },
			next: { year: 2016, month: 7 },
			preventDefault: jasmine.any(Function),
		});
	});

	it('should emit navigate event using navigateTo({date})', () => {
		const fixture =
			createTestComponent(`<ngb-monthpicker #dp [startDate]="date" (navigate)="onNavigate($event)"></ngb-monthpicker>
       <button id="btn"(click)="dp.navigateTo({year: 2015, month: 6})"></button>`);

		spyOn(fixture.componentInstance, 'onNavigate');
		const button = fixture.nativeElement.querySelector('button#btn');
		button.click();

		fixture.detectChanges();
		expect(fixture.componentInstance.onNavigate).toHaveBeenCalledWith({
			current: { year: 2016, month: 8 },
			next: { year: 2015, month: 6 },
			preventDefault: jasmine.any(Function),
		});
	});

	it('should prevent navigation when calling preventDefault()', () => {
		const fixture = createTestComponent(
			`<ngb-monthpicker #dp [startDate]="date" (navigate)="onPreventableNavigate($event)"></ngb-monthpicker>
       <button id="btn" (click)="dp.navigateTo({year: 2015, month: 7})"></button>`,
		);

		expect(getMonthSelect(fixture.nativeElement).value).toBe('8');
		expect(getYearSelect(fixture.nativeElement).value).toBe('2016');
		expect(getDay(fixture.nativeElement, 0).innerText).toBe('1');

		const button = fixture.nativeElement.querySelector('button#btn');
		button.click();
		fixture.detectChanges();

		expect(getMonthSelect(fixture.nativeElement).value).toBe('8');
		expect(getYearSelect(fixture.nativeElement).value).toBe('2016');
		expect(getDay(fixture.nativeElement, 0).innerText).toBe('1');
	});

	it('should not focus day initially', () => {
		const fixture = createTestComponent('<ngb-monthpicker #dp [startDate]="date"></ngb-monthpicker>');
		const monthpicker = fixture.debugElement.query(By.directive(NgbMonthpicker));
		expectFocusedDate(monthpicker, new NgbMonth(2016, 8), false);
	});

	it('should remove focus day on blur', () => {
		const fixture = createTestComponent(
			'<ngb-monthpicker #dp [startDate]="date"></ngb-monthpicker><input id="focusout" >',
		);
		const monthpicker = fixture.debugElement.query(By.directive(NgbMonthpicker));

		// focus in
		focusDay();
		fixture.detectChanges();
		expectFocusedDate(monthpicker, new NgbMonth(2016, 8), true);

		// focus out
		(document.querySelector('#focusout') as HTMLElement).focus();

		fixture.detectChanges();
		expectFocusedDate(monthpicker, new NgbMonth(2016, 8), false);
		expectSelectedDate(monthpicker, null);
	});

	it('should emit select event when select date', () => {
		const fixture = createTestComponent(
			`<ngb-monthpicker #dp [startDate]="date" (dateSelect)="onDateSelect($event)"></ngb-monthpicker>`,
		);

		spyOn(fixture.componentInstance, 'onDateSelect');
		let dates = getDates(fixture.nativeElement);
		dates[11].click();

		fixture.detectChanges();
		expect(fixture.componentInstance.onDateSelect).toHaveBeenCalledTimes(1);
	});

	it('should emit select event twice when select same date twice', () => {
		const fixture = createTestComponent(
			`<ngb-monthpicker #dp [startDate]="date" (dateSelect)="onDateSelect($event)"></ngb-monthpicker>`,
		);

		spyOn(fixture.componentInstance, 'onDateSelect');
		let dates = getDates(fixture.nativeElement);

		dates[11].click();
		fixture.detectChanges();

		dates[11].click();
		fixture.detectChanges();

		expect(fixture.componentInstance.onDateSelect).toHaveBeenCalledTimes(2);
	});

	it('should emit select event twice when press enter key twice', () => {
		const fixture = createTestComponent(
			`<ngb-monthpicker #dp [startDate]="date" (dateSelect)="onDateSelect($event)"></ngb-monthpicker>`,
		);
		const monthpicker = fixture.debugElement.query(By.directive(NgbMonthpicker));

		spyOn(fixture.componentInstance, 'onDateSelect');

		focusDay();
		fixture.detectChanges();

		triggerKeyDown(getMonthContainer(monthpicker), 13 /* enter */);
		fixture.detectChanges();

		triggerKeyDown(getMonthContainer(monthpicker), 13 /* enter */);
		fixture.detectChanges();
		expect(fixture.componentInstance.onDateSelect).toHaveBeenCalledTimes(2);
	});

	it('should emit select event twice when press space key twice', () => {
		const fixture = createTestComponent(
			`<ngb-monthpicker #dp [startDate]="date" (dateSelect)="onDateSelect($event)"></ngb-monthpicker>`,
		);
		const monthpicker = fixture.debugElement.query(By.directive(NgbMonthpicker));

		spyOn(fixture.componentInstance, 'onDateSelect');

		focusDay();
		fixture.detectChanges();

		triggerKeyDown(getMonthContainer(monthpicker), 32 /* space */);
		fixture.detectChanges();

		triggerKeyDown(getMonthContainer(monthpicker), 32 /* space */);
		fixture.detectChanges();
		expect(fixture.componentInstance.onDateSelect).toHaveBeenCalledTimes(2);
	});

	it('should insert an embedded view for footer when `footerTemplate` provided', () => {
		const fixture = createTestComponent(`<ngb-monthpicker #dp [footerTemplate]="footerTemplate"></ngb-monthpicker>
      <ng-template #footerTemplate><span id="myMonthpickerFooter">My footer</span></ng-template>`);

		fixture.detectChanges();

		expect(fixture.nativeElement.querySelector('#myMonthpickerFooter')).not.toBeNull();
	});

	describe('ngModel', () => {
		it('should update model based on calendar clicks', () => {
			const fixture = createTestComponent(
				`<ngb-monthpicker [startDate]="date" [minDate]="minDate" [maxDate]="maxDate" [(ngModel)]="model"></ngb-monthpicker>`,
			);

			const dates = getDates(fixture.nativeElement);
			dates[0].click(); // 1 AUG 2016
			expect(fixture.componentInstance.model).toEqual({ year: 2016, month: 8 });

			dates[1].click();
			expect(fixture.componentInstance.model).toEqual({ year: 2016, month: 8, day: 2 });
		});

		it('should not update model based on calendar clicks when disabled', fakeAsync(() => {
			const fixture = createTestComponent(
				`<ngb-monthpicker [startDate]="date" [minDate]="minDate" [maxDate]="maxDate" [(ngModel)]="model" [disabled]="true">
              </ngb-monthpicker>`,
			);

			tick();
			fixture.detectChanges();

			const dates = getDates(fixture.nativeElement);
			dates[0].click(); // 1 AUG 2016
			expect(fixture.componentInstance.model).toBeFalsy();

			dates[1].click();
			expect(fixture.componentInstance.model).toBeFalsy();
		}));

		it('select calendar date based on model updates', fakeAsync(() => {
			const fixture = createTestComponent(
				`<ngb-monthpicker [startDate]="date" [minDate]="minDate" [maxDate]="maxDate" [(ngModel)]="model"></ngb-monthpicker>`,
			);

			fixture.componentInstance.model = { year: 2016, month: 8 };
			fixture.detectChanges();
			tick();
			fixture.detectChanges();
			expect(getDay(fixture.nativeElement, 0)).toHaveCssClass('bg-primary');

			fixture.componentInstance.model = { year: 2016, month: 8, day: 2 };
			fixture.detectChanges();
			tick();
			fixture.detectChanges();
			expect(getDay(fixture.nativeElement, 0)).not.toHaveCssClass('bg-primary');
			expect(getDay(fixture.nativeElement, 1)).toHaveCssClass('bg-primary');
		}));

		it('should switch month when clicked on the date outside of current month', fakeAsync(() => {
			const fixture = createTestComponent(
				`<ngb-monthpicker [startDate]="date" [minDate]="minDate" [maxDate]="maxDate" [(ngModel)]="model"></ngb-monthpicker>`,
			);
			fixture.detectChanges();
			tick();
			let dates = getDates(fixture.nativeElement);

			dates[31].click(); // 1 SEP 2016
			expect(fixture.componentInstance.model).toEqual({ year: 2016, month: 9 });

			// month changes to SEP
			fixture.detectChanges();
			expect(getDay(fixture.nativeElement, 0).innerText).toBe('29'); // 29 AUG 2016
			expect(getDay(fixture.nativeElement, 3)).toHaveCssClass('bg-primary'); // 1 SEP still selected
		}));

		it('should switch month on prev/next navigation click', () => {
			const fixture = createTestComponent(
				`<ngb-monthpicker [startDate]="date" [minDate]="minDate" [maxDate]="maxDate" [(ngModel)]="model"></ngb-monthpicker>`,
			);

			let dates = getDates(fixture.nativeElement);
			const navigation = getNavigationLinks(fixture.nativeElement);

			dates[0].click(); // 1 AUG 2016
			expect(fixture.componentInstance.model).toEqual({ year: 2016, month: 8 });

			// PREV
			navigation[0].click();
			fixture.detectChanges();
			dates = getDates(fixture.nativeElement);
			dates[4].click(); // 1 JUL 2016
			expect(fixture.componentInstance.model).toEqual({ year: 2016, month: 7 });

			// NEXT
			navigation[1].click();
			fixture.detectChanges();
			dates = getDates(fixture.nativeElement);
			dates[0].click(); // 1 AUG 2016
			expect(fixture.componentInstance.model).toEqual({ year: 2016, month: 8 });
		});

		it('should switch month using navigateTo({date})', () => {
			const fixture = createTestComponent(
				`<ngb-monthpicker #dp [startDate]="date" [minDate]="minDate" [maxDate]="maxDate" [(ngModel)]="model"></ngb-monthpicker>
       <button id="btn" (click)="dp.navigateTo({year: 2015, month: 6})"></button>`,
			);

			const button = fixture.nativeElement.querySelector('button#btn');
			button.click();

			fixture.detectChanges();
			expect(getMonthSelect(fixture.nativeElement).value).toBe('6');
			expect(getYearSelect(fixture.nativeElement).value).toBe('2015');

			const dates = getDates(fixture.nativeElement);
			dates[0].click(); // 1 JUN 2015
			expect(fixture.componentInstance.model).toEqual({ year: 2015, month: 6 });
		});

		it('should switch to current month using navigateTo() without arguments', () => {
			const fixture = createTestComponent(`
        <ngb-monthpicker #dp [startDate]="date"></ngb-monthpicker>
        <button id="btn" (click)="dp.navigateTo()"></button>
      `);

			const button = fixture.nativeElement.querySelector('button#btn');
			button.click();

			fixture.detectChanges();
			const today = new Date();
			expect(getMonthSelect(fixture.nativeElement).value).toBe(`${today.getMonth() + 1}`);
			expect(getYearSelect(fixture.nativeElement).value).toBe(`${today.getFullYear()}`);
		});

		it('should support disabling all dates and navigation via the disabled attribute', fakeAsync(() => {
			const fixture = createTestComponent(
				`<ngb-monthpicker [(ngModel)]="model" [startDate]="date" [disabled]="true"></ngb-monthpicker>`,
			);
			fixture.detectChanges();
			tick();
			fixture.detectChanges();
			for (let index = 0; index < 31; index++) {
				expect(getDay(fixture.nativeElement, index)).toHaveCssClass('text-muted');
			}

			const links = getNavigationLinks(fixture.nativeElement);
			expect(links[0].hasAttribute('disabled')).toBeTruthy();
			expect(links[1].hasAttribute('disabled')).toBeTruthy();
			expect(getYearSelect(fixture.nativeElement).disabled).toBeTruthy();
			expect(getMonthSelect(fixture.nativeElement).disabled).toBeTruthy();
			expect(getMonthpicker(fixture.nativeElement)).toHaveCssClass('disabled');
		}));
	});

	describe('aria attributes', () => {
		const template = `<ngb-monthpicker #dp
        [startDate]="date"></ngb-monthpicker>
        `;

		it('should contains aria-label on the days', () => {
			const fixture = createTestComponent(template);

			const dates = getDates(fixture.nativeElement);

			dates.forEach(function (date) {
				expect(date.getAttribute('aria-label')).toBeDefined('Missing aria-label attribute on a day');
			});
		});
	});

	describe('keyboard navigation', () => {
		const template = `<ngb-monthpicker #dp
        [startDate]="date" [minDate]="minDate"
        [maxDate]="maxDate" [displayMonths]="2"
        [markDisabled]="markDisabled"></ngb-monthpicker>
        <input id="focusout">
        `;

		it('should move focus with arrow keys', () => {
			const fixture = createTestComponent(template);

			const monthpicker = fixture.debugElement.query(By.directive(NgbMonthpicker));

			// focus in
			focusDay();

			triggerKeyDown(getMonthContainer(monthpicker), 40 /* down arrow */);
			fixture.detectChanges();
			expectFocusedDate(monthpicker, new NgbMonth(2016, 8));
			expectSelectedDate(monthpicker, null);

			triggerKeyDown(getMonthContainer(monthpicker), 39 /* right arrow */);
			fixture.detectChanges();
			expectFocusedDate(monthpicker, new NgbMonth(2016, 8));
			expectSelectedDate(monthpicker, null);

			triggerKeyDown(getMonthContainer(monthpicker), 38 /* up arrow */);
			fixture.detectChanges();
			expectFocusedDate(monthpicker, new NgbMonth(2016, 8));
			expectSelectedDate(monthpicker, null);

			triggerKeyDown(getMonthContainer(monthpicker), 37 /* left arrow */);
			fixture.detectChanges();
			expectFocusedDate(monthpicker, new NgbMonth(2016, 8));
			expectSelectedDate(monthpicker, null);
		});

		it('should select focused date with enter or space', () => {
			const fixture = createTestComponent(template);

			const monthpicker = fixture.debugElement.query(By.directive(NgbMonthpicker));

			focusDay();

			triggerKeyDown(getMonthContainer(monthpicker), 32 /* space */);
			fixture.detectChanges();
			expectFocusedDate(monthpicker, new NgbMonth(2016, 8));
			expectSelectedDate(monthpicker, new NgbMonth(2016, 8));

			triggerKeyDown(getMonthContainer(monthpicker), 40 /* down arrow */);
			fixture.detectChanges();
			expectFocusedDate(monthpicker, new NgbMonth(2016, 8));
			expectSelectedDate(monthpicker, new NgbMonth(2016, 8));

			triggerKeyDown(getMonthContainer(monthpicker), 13 /* enter */);
			fixture.detectChanges();
			expectFocusedDate(monthpicker, new NgbMonth(2016, 8));
			expectSelectedDate(monthpicker, new NgbMonth(2016, 8));
		});

		it('should select first and last dates of the view with home/end', () => {
			const fixture = createTestComponent(template);

			const monthpicker = fixture.debugElement.query(By.directive(NgbMonthpicker));

			focusDay();

			triggerKeyDown(getMonthContainer(monthpicker), 35 /* end */);
			fixture.detectChanges();
			expectFocusedDate(monthpicker, new NgbMonth(2016, 9));
			expectSelectedDate(monthpicker, null);

			triggerKeyDown(getMonthContainer(monthpicker), 36 /* home */);
			fixture.detectChanges();
			expectFocusedDate(monthpicker, new NgbMonth(2016, 8));
			expectSelectedDate(monthpicker, null);
		});

		it('should select min and max dates with shift+home/end', () => {
			const fixture = createTestComponent(template);

			const monthpicker = fixture.debugElement.query(By.directive(NgbMonthpicker));

			focusDay();

			triggerKeyDown(getMonthContainer(monthpicker), 35 /* end */, true /* shift */);
			fixture.detectChanges();
			expectFocusedDate(monthpicker, new NgbMonth(2020, 12));
			expectSelectedDate(monthpicker, null);

			triggerKeyDown(getMonthContainer(monthpicker), 40 /* down arrow */);
			fixture.detectChanges();
			expectFocusedDate(monthpicker, new NgbMonth(2020, 12));
			expectSelectedDate(monthpicker, null);

			triggerKeyDown(getMonthContainer(monthpicker), 36 /* home */, true /* shift */);
			fixture.detectChanges();
			expectFocusedDate(monthpicker, new NgbMonth(2010, 1));
			expectSelectedDate(monthpicker, null);

			triggerKeyDown(getMonthContainer(monthpicker), 38 /* up arrow */);
			fixture.detectChanges();
			expectFocusedDate(monthpicker, new NgbMonth(2010, 1));
			expectSelectedDate(monthpicker, null);
		});

		it('should navigate between months with pageUp/Down', () => {
			const fixture = createTestComponent(template);

			let monthpicker = fixture.debugElement.query(By.directive(NgbMonthpicker));

			focusDay();

			triggerKeyDown(getMonthContainer(monthpicker), 39 /* right arrow */);
			fixture.detectChanges();
			expectFocusedDate(monthpicker, new NgbMonth(2016, 8));
			expectSelectedDate(monthpicker, null);

			triggerKeyDown(getMonthContainer(monthpicker), 33 /* page up */);
			fixture.detectChanges();
			expectFocusedDate(monthpicker, new NgbMonth(2016, 7));
			expectSelectedDate(monthpicker, null);

			triggerKeyDown(getMonthContainer(monthpicker), 34 /* page down */);
			fixture.detectChanges();
			expectFocusedDate(monthpicker, new NgbMonth(2016, 8));
			expectSelectedDate(monthpicker, null);

			triggerKeyDown(getMonthContainer(monthpicker), 34 /* page down */);
			fixture.detectChanges();

			expectFocusedDate(monthpicker, new NgbMonth(2016, 9));
			expectSelectedDate(monthpicker, null);

			triggerKeyDown(getMonthContainer(monthpicker), 34 /* page down */);
			fixture.detectChanges();
			monthpicker = fixture.debugElement.query(By.directive(NgbMonthpicker));
			expectFocusedDate(monthpicker, new NgbMonth(2016, 10));
			expectSelectedDate(monthpicker, null);
		});

		it('should navigate between years with shift+pageUp/Down', () => {
			const fixture = createTestComponent(template);

			const monthpicker = fixture.debugElement.query(By.directive(NgbMonthpicker));
			focusDay();

			getMonthContainer(monthpicker).triggerEventHandler('focus', {});
			fixture.detectChanges();

			expectFocusedDate(monthpicker, new NgbMonth(2016, 8));
			expectSelectedDate(monthpicker, null);

			triggerKeyDown(getMonthContainer(monthpicker), 33 /* page up */, true /* shift */);
			fixture.detectChanges();

			expectFocusedDate(monthpicker, new NgbMonth(2015, 8), true);
			expectSelectedDate(monthpicker, null);

			triggerKeyDown(getMonthContainer(monthpicker), 34 /* page down */, true /* shift */);
			fixture.detectChanges();

			expectFocusedDate(monthpicker, new NgbMonth(2016, 8));
			expectSelectedDate(monthpicker, null);
		});

		it(`shouldn't be focusable when disabled`, fakeAsync(() => {
			const fixture = createTestComponent(
				`<ngb-monthpicker #dp [(ngModel)]="model" [disabled]="true"></ngb-monthpicker>`,
			);
			tick();
			fixture.detectChanges();

			const monthpicker = fixture.debugElement.query(By.directive(NgbMonthpicker));

			const days = getFocusableDays(monthpicker);

			expect(days.length).toEqual(0, 'A focusable day has been found');
		}));
	});

	describe('forms', () => {
		it('should work with template-driven form validation', fakeAsync(() => {
			const fixture = createTestComponent(`
        <form>
          <ngb-monthpicker [startDate]="date" [minDate]="minDate" [maxDate]="maxDate" [(ngModel)]="model" name="date" required>
          </ngb-monthpicker>
        </form>
      `);

			const compiled = fixture.nativeElement;
			fixture.detectChanges();
			tick();
			fixture.detectChanges();
			expect(getMonthpicker(compiled)).toHaveCssClass('ng-invalid');
			expect(getMonthpicker(compiled)).not.toHaveCssClass('ng-valid');

			fixture.componentInstance.model = { year: 2016, month: 8 };
			fixture.detectChanges();
			tick();
			fixture.detectChanges();
			expect(getMonthpicker(compiled)).toHaveCssClass('ng-valid');
			expect(getMonthpicker(compiled)).not.toHaveCssClass('ng-invalid');
		}));

		it('should work with model-driven form validation', () => {
			const html = `
          <form [formGroup]="form">
            <ngb-monthpicker [startDate]="date" [minDate]="minDate" [maxDate]="maxDate" formControlName="control" required></ngb-monthpicker>
          </form>`;

			const fixture = createTestComponent(html);
			const compiled = fixture.nativeElement;
			fixture.detectChanges();
			const dates = getDates(fixture.nativeElement);

			expect(getMonthpicker(compiled)).toHaveCssClass('ng-invalid');
			expect(getMonthpicker(compiled)).not.toHaveCssClass('ng-valid');

			dates[0].click();
			fixture.detectChanges();
			expect(getMonthpicker(compiled)).toHaveCssClass('ng-valid');
			expect(getMonthpicker(compiled)).not.toHaveCssClass('ng-invalid');
		});

		it('should be disabled with reactive forms', () => {
			const html = `<form [formGroup]="disabledForm">
            <ngb-monthpicker [startDate]="date" [minDate]="minDate" [maxDate]="maxDate" formControlName="control">
            </ngb-monthpicker>
        </form>`;

			const fixture = createTestComponent(html);
			fixture.detectChanges();
			const dates = getDates(fixture.nativeElement);
			dates[0].click(); // 1 AUG 2016
			expect(fixture.componentInstance.disabledForm.controls['control'].value).toBeFalsy();
			for (let index = 0; index < 31; index++) {
				expect(getDay(fixture.nativeElement, index)).toHaveCssClass('text-muted');
			}
			expect(fixture.nativeElement.querySelector('ngb-monthpicker').getAttribute('tabindex')).toBeFalsy();
			expect(getMonthpicker(fixture.nativeElement)).toHaveCssClass('disabled');
		});

		it('should not change again the value in the model on a change coming from the model (template-driven form)', () => {
			const html = `<form>
             <ngb-monthpicker [startDate]="date" [minDate]="minDate" [maxDate]="maxDate" [(ngModel)]="model" name="date">
             </ngb-monthpicker>
           </form>`;

			const fixture = createTestComponent(html);
			fixture.detectChanges();

			const value = new NgbMonth(2018, 7);
			fixture.componentInstance.model = value;
			fixture.detectChanges();
			expect(fixture.componentInstance.model).toBe(value);
		});

		it('should not change again the value in the model on a change coming from the model (reactive form)', () => {
			const html = `<form [formGroup]="form">
             <ngb-monthpicker [startDate]="date" [minDate]="minDate" [maxDate]="maxDate" formControlName="control">
             </ngb-monthpicker>
           </form>`;

			const fixture = createTestComponent(html);

			const formChangeSpy = jasmine.createSpy('form change');
			const form = fixture.componentInstance.form;
			form.valueChanges.subscribe(formChangeSpy);

			const controlValue = new NgbMonth(2018, 7);
			form.setValue({ control: controlValue });
			expect(formChangeSpy).toHaveBeenCalledTimes(1);
			expect(form.value.control).toBe(controlValue);
		});
	});

	describe('Custom config', () => {
		let config: NgbMonthpickerConfig;

		beforeEach(inject([NgbMonthpickerConfig], (c: NgbMonthpickerConfig) => {
			config = c;
			customizeConfig(config);
		}));

		it('should initialize inputs with provided config', () => {
			const fixture = TestBed.createComponent(NgbMonthpicker);

			const monthpicker = fixture.componentInstance;
			expectSameValues(monthpicker, config);
		});
	});

	describe('Custom config as provider', () => {
		const config = new NgbMonthpickerConfig();
		customizeConfig(config);

		beforeEach(() => {
			TestBed.configureTestingModule({
				providers: [{ provide: NgbMonthpickerConfig, useValue: config }],
			});
		});

		it('should initialize inputs with provided config as provider', () => {
			const fixture = TestBed.createComponent(NgbMonthpicker);

			const monthpicker = fixture.componentInstance;
			expectSameValues(monthpicker, config);
		});
	});

	describe('NgbMonthpicker', () => {
		let mockState: NgbMonthpickerState;
		let dp: NgbMonthpicker;
		let mv: NgbMonthpickerYear;
		const mockKeyboardService: Partial<NgbMonthpickerKeyboardService> = {
			processKey(event: KeyboardEvent, monthpicker: NgbMonthpicker) {
				mockState = monthpicker.state;
			},
		};

		beforeEach(() => {
			TestBed.configureTestingModule({
				providers: [{ provide: NgbMonthpickerKeyboardService, useValue: mockKeyboardService }],
			});
			const fixture = createTestComponent(
				`<ngb-monthpicker [startDate]="date" [minDate]="minDate" [maxDate]="maxDate"></ngb-monthpicker>`,
			);
			fixture.detectChanges();
			dp = <NgbMonthpicker>fixture.debugElement.query(By.directive(NgbMonthpicker)).componentInstance;
			mv = fixture.debugElement.query(By.css('ngb-monthpicker-month')).injector.get(NgbMonthpickerYear);
		});

		it('should provide an defensive copy of minDate', () => {
			mv.onKeyDown(<KeyboardEvent>{});
			expect(mockState.firstDate).toEqual(NgbMonth.from({ year: 2016, month: 8 })!);
			expect(mockState.lastDate).toEqual(NgbMonth.from({ year: 2016, month: 8 })!);
			expect(mockState.minDate).toEqual(NgbMonth.from({ year: 2010, month: 1 }));
			expect(mockState.maxDate).toEqual(NgbMonth.from({ year: 2020, month: 12 }));
			Object.assign(mockState, { minDate: undefined });
			mv.onKeyDown(<KeyboardEvent>{});
			expect(dp.model.minDate).toEqual(NgbMonth.from({ year: 2010, month: 1 }));
		});

		it('should provide an defensive copy of maxDate', () => {
			mv.onKeyDown(<KeyboardEvent>{});
			expect(mockState.firstDate).toEqual(NgbMonth.from({ year: 2016, month: 8 })!);
			expect(mockState.lastDate).toEqual(NgbMonth.from({ year: 2016, month: 8 })!);
			expect(mockState.minDate).toEqual(NgbMonth.from({ year: 2010, month: 1 }));
			expect(mockState.maxDate).toEqual(NgbMonth.from({ year: 2020, month: 12 }));
			Object.assign(mockState, { maxDate: undefined });
			mv.onKeyDown(<KeyboardEvent>{});
			expect(dp.model.maxDate).toEqual(NgbMonth.from({ year: 2020, month: 12 }));
		});

		it('should provide an defensive copy of firstDate', () => {
			mv.onKeyDown(<KeyboardEvent>{});
			expect(mockState.firstDate).toEqual(NgbMonth.from({ year: 2016, month: 8 })!);
			expect(mockState.lastDate).toEqual(NgbMonth.from({ year: 2016, month: 8 })!);
			expect(mockState.minDate).toEqual(NgbMonth.from({ year: 2010, month: 1 }));
			expect(mockState.maxDate).toEqual(NgbMonth.from({ year: 2020, month: 12 }));
			Object.assign(mockState, { firstDate: undefined });
			mv.onKeyDown(<KeyboardEvent>{});
			expect(dp.model.firstDate).toEqual(NgbMonth.from({ year: 2016, month: 8 }));
		});

		it('should provide an defensive copy of lastDate', () => {
			mv.onKeyDown(<KeyboardEvent>{});
			expect(mockState.firstDate).toEqual(NgbMonth.from({ year: 2016, month: 8 })!);
			expect(mockState.lastDate).toEqual(NgbMonth.from({ year: 2016, month: 8 })!);
			expect(mockState.minDate).toEqual(NgbMonth.from({ year: 2010, month: 1 }));
			expect(mockState.maxDate).toEqual(NgbMonth.from({ year: 2020, month: 12 }));
			Object.assign(mockState, { lastDate: undefined });
			mv.onKeyDown(<KeyboardEvent>{});
			expect(dp.model.lastDate).toEqual(NgbMonth.from({ year: 2016, month: 8 }));
		});

		it('should provide an defensive copy of focusedDate', () => {
			mv.onKeyDown(<KeyboardEvent>{});
			expect(mockState.focusedDate).toEqual(NgbMonth.from({ year: 2016, month: 8 })!);
			Object.assign(mockState, { focusedDate: undefined });
			mv.onKeyDown(<KeyboardEvent>{});
			expect(dp.model.focusDate).toEqual(NgbMonth.from({ year: 2016, month: 8 }));
		});

		it('should prevent overriding of calendar', () => {
			try {
				(<any>dp)['calendar'] = null;
				/* eslint-disable-next-line no-empty */
			} catch (e) {}
			expect(dp.calendar).toBeTruthy();
		});
	});
});

@Component({
	selector: 'test-cmp',
	standalone: true,
	imports: [NgbMonthpickerModule, FormsModule, ReactiveFormsModule],
	template: '',
})
class TestComponent {
	date = { year: 2016, month: 8 };
	displayMonths = 1;
	navigation = 'select';
	minDate: NgbMonthStruct = { year: 2010, month: 1 };
	maxDate: NgbMonthStruct = { year: 2020, month: 12 };
	form = new UntypedFormGroup({ control: new UntypedFormControl('', Validators.required) });
	disabledForm = new UntypedFormGroup({ control: new UntypedFormControl({ value: null, disabled: true }) });
	model;
	weekdays: boolean | TranslationWidth = true;
	monthTemplateData = () => '!';
	markDisabled = (date: NgbMonthStruct) => {
		return NgbMonth.from(date)!.equals(new NgbMonth(2016, 8));
	};
	onNavigate = (event) => {};
	onDateSelect = () => {};
	getDate = () => ({ year: 2016, month: 8 });
	onPreventableNavigate = (event: NgbMonthpickerNavigateEvent) => event.preventDefault();
}
