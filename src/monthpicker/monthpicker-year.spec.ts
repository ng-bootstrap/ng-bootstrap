import { ComponentFixture, TestBed } from '@angular/core/testing';
import { createGenericTestComponent } from '../test/common';

import { Component, Injectable } from '@angular/core';

import { NgbMonthpickerModule } from './monthpicker.module';
import { NgbMonthpicker } from './monthpicker';
import { NgbMonthpickerKeyboardService } from './monthpicker-keyboard-service';
import { NgbMonthpickerService } from './monthpicker-service';
import { NgbMonth } from './ngb-month';
import { NgbMonthStruct } from './ngb-month-struct';

const createTestComponent = () =>
	createGenericTestComponent(
		`
  <ngb-monthpicker #dp
                  [dayTemplate]="dt"
                  [weekdays]="weekdays"
                  [showWeekNumbers]="showWeekNumbers"
                  [outsideDays]="outsideDays"
                  (dateSelect)="onClick($event)">
    <ng-template #dt let-date="date">{{ date.day }}</ng-template>
  </ngb-monthpicker>
`,
		TestComponent,
	) as ComponentFixture<TestComponent>;

function getWeekNumbers(element: HTMLElement): HTMLElement[] {
	return <HTMLElement[]>Array.from(element.querySelectorAll('.ngb-mp-week-number'));
}

function getDates(element: HTMLElement): HTMLElement[] {
	return <HTMLElement[]>Array.from(element.querySelectorAll('.ngb-mp-day'));
}

function getWeekLabel(element: HTMLElement): HTMLElement | null {
	return element.querySelector('.ngb-mp-showweek');
}

function expectWeekNumbers(element: HTMLElement, weeknumbers: string[]) {
	const result = getWeekNumbers(element).map((td) => td.innerText.trim());
	expect(result).toEqual(weeknumbers);
}

function expectDates(element: HTMLElement, dates: string[]) {
	const result = getDates(element).map((td) => td.innerText.trim());
	expect(result).toEqual(dates);
}

function expectWeekLabel(element: HTMLElement, weekLabel: string) {
	const weekLabelElement = getWeekLabel(element);
	const result = weekLabelElement ? weekLabelElement.innerText.trim() : '';
	expect(result).toEqual(weekLabel);
}

@Injectable()
class MockMonthpickerService extends NgbMonthpickerService {
	getMonth(struct: NgbMonthStruct) {
		return {
			firstDate: new NgbMonth(2016, 8),
			lastDate: new NgbMonth(2016, 8),
			year: 2016,
			number: 8,
			weekdays: ['Mo', 'Tu'],
			weeks: [
				// month: 7, 8
				{
					number: 1,
					days: [
						{
							date: new NgbMonth(2016, 7),
							context: {
								currentMonth: 8,
								currentYear: 2016,
								$implicit: new NgbMonth(2016, 7),
								date: new NgbMonth(2016, 7),
								disabled: false,
								focused: false,
								selected: false,
								today: false,
							},
							tabindex: -1,
							ariaLabel: 'Monday',
							hidden: true,
						},
						{
							date: new NgbMonth(2016, 8),
							context: {
								currentMonth: 8,
								currentYear: 2016,
								$implicit: new NgbMonth(2016, 8),
								date: new NgbMonth(2016, 8),
								disabled: false,
								focused: false,
								selected: false,
								today: false,
							},
							tabindex: -1,
							ariaLabel: 'Monday',
							hidden: false,
						},
					],
					collapsed: false,
				},
				// month: 8, 8
				{
					number: 2,
					days: [
						{
							date: new NgbMonth(2016, 8),
							context: {
								currentMonth: 8,
								currentYear: 2016,
								$implicit: new NgbMonth(2016, 8),
								date: new NgbMonth(2016, 8),
								disabled: true,
								focused: false,
								selected: false,
								today: true,
							},
							tabindex: -1,
							ariaLabel: 'Friday',
							hidden: false,
						},
						{
							date: new NgbMonth(2016, 8),
							context: {
								currentMonth: 8,
								currentYear: 2016,
								$implicit: new NgbMonth(2016, 8),
								date: new NgbMonth(2016, 8),
								disabled: false,
								focused: false,
								selected: false,
								today: false,
							},
							tabindex: -1,
							ariaLabel: 'Saturday',
							hidden: false,
						},
					],
					collapsed: false,
				},
				// month: 8, 9
				{
					number: 3,
					days: [
						{
							date: new NgbMonth(2016, 8),
							context: {
								currentMonth: 8,
								currentYear: 2016,
								$implicit: new NgbMonth(2016, 8),
								date: new NgbMonth(2016, 8),
								disabled: false,
								focused: false,
								selected: false,
								today: false,
							},
							tabindex: -1,
							ariaLabel: 'Sunday',
							hidden: false,
						},
						{
							date: new NgbMonth(2016, 9),
							context: {
								currentMonth: 8,
								currentYear: 2016,
								$implicit: new NgbMonth(2016, 9),
								date: new NgbMonth(2016, 9),
								disabled: false,
								focused: false,
								selected: false,
								today: false,
							},
							tabindex: -1,
							ariaLabel: 'Saturday',
							hidden: true,
						},
					],
					collapsed: false,
				},
				// month: 9, 9 -> to collapse
				{
					number: 4,
					days: [
						{
							date: new NgbMonth(2016, 9),
							context: {
								currentMonth: 8,
								currentYear: 2016,
								$implicit: new NgbMonth(2016, 9),
								date: new NgbMonth(2016, 9),
								disabled: false,
								focused: false,
								selected: false,
								today: false,
							},
							tabindex: -1,
							ariaLabel: 'Sunday',
							hidden: true,
						},
						{
							date: new NgbMonth(2016, 9),
							context: {
								currentMonth: 8,
								currentYear: 2016,
								$implicit: new NgbMonth(2016, 9),
								date: new NgbMonth(2016, 9),
								disabled: false,
								focused: false,
								selected: false,
								today: false,
							},
							tabindex: -1,
							ariaLabel: 'Monday',
							hidden: true,
						},
					],
					collapsed: true,
				},
			],
		};
	}
}

describe('ngb-monthpicker-month', () => {
	beforeEach(() => {
		TestBed.overrideComponent(NgbMonthpicker, {
			add: {
				providers: [
					{ provide: NgbMonthpickerService, useClass: MockMonthpickerService },
					NgbMonthpickerKeyboardService,
				],
			},
		});
		TestBed.configureTestingModule({
			providers: [{ provide: NgbMonthpickerService, useClass: MockMonthpickerService }],
		});
	});

	it('should show/hide week numbers', () => {
		const fixture = createTestComponent();

		expectWeekNumbers(fixture.nativeElement, ['1', '2', '3']);
		expectWeekLabel(fixture.nativeElement, '');

		fixture.componentInstance.showWeekNumbers = false;
		fixture.detectChanges();

		expectWeekNumbers(fixture.nativeElement, []);
		expectWeekLabel(fixture.nativeElement, '');
	});

	it('should use custom template to display dates', () => {
		const fixture = createTestComponent();
		expectDates(fixture.nativeElement, ['', '1', '2', '3', '4', '']);
	});

	it('should use "date" as an implicit value for the template', () => {
		const fixture = createTestComponent();
		expectDates(fixture.nativeElement, ['', '1', '2', '3', '4', '']);
	});

	it('should send date selection events', () => {
		const fixture = createTestComponent();

		spyOn(fixture.componentInstance, 'onClick');

		const dates = getDates(fixture.nativeElement);
		dates[1].click();

		expect(fixture.componentInstance.onClick).toHaveBeenCalledWith(new NgbMonth(2016, 8));
	});

	it('should not send date selection events for hidden and disabled dates', () => {
		const fixture = createTestComponent();

		spyOn(fixture.componentInstance, 'onClick');

		const dates = getDates(fixture.nativeElement);
		dates[0].click(); // hidden
		dates[2].click(); // disabled

		expect(fixture.componentInstance.onClick).not.toHaveBeenCalled();
	});

	it('should set cursor to pointer or default', () => {
		const fixture = createTestComponent();

		const dates = getDates(fixture.nativeElement);
		// hidden
		expect(window.getComputedStyle(dates[0]).getPropertyValue('cursor')).toBe('default');
		// normal
		expect(window.getComputedStyle(dates[1]).getPropertyValue('cursor')).toBe('pointer');
		// disabled
		expect(window.getComputedStyle(dates[2]).getPropertyValue('cursor')).toBe('default');
	});

	it('should apply correct CSS classes to days', () => {
		const fixture = createTestComponent();

		let dates = getDates(fixture.nativeElement);
		// hidden
		expect(dates[0]).toHaveCssClass('hidden');
		expect(dates[0]).not.toHaveCssClass('disabled');
		expect(dates[0]).not.toHaveCssClass('ngb-mp-today');
		// normal
		expect(dates[1]).not.toHaveCssClass('hidden');
		expect(dates[1]).not.toHaveCssClass('disabled');
		expect(dates[1]).not.toHaveCssClass('ngb-mp-today');
		// disabled
		expect(dates[2]).not.toHaveCssClass('hidden');
		expect(dates[2]).toHaveCssClass('disabled');
		expect(dates[2]).toHaveCssClass('ngb-mp-today');
	});

	it('should not display collapsed weeks', () => {
		const fixture = createTestComponent();

		expectDates(fixture.nativeElement, ['', '1', '2', '3', '4', '']);
	});

	it('should add correct aria-label attribute', () => {
		const fixture = createTestComponent();

		let dates = getDates(fixture.nativeElement);
		expect(dates[0].getAttribute('aria-label')).toBe('Monday');
	});

	it('should render custom month layout', () => {
		const fixture = createGenericTestComponent(
			`
      <ngb-monthpicker #dp
                      [weekdays]="weekdays"
                      [showWeekNumbers]="showWeekNumbers"
                      [outsideDays]="outsideDays"
                      (select)="onClick($event)">
        <ng-template ngbMonthpickerContent>
          <ngb-monthpicker-month [month]="{month: 8, year: 2016}"></ngb-monthpicker-month>
        </ng-template>
      </ngb-monthpicker>`,
			TestComponent,
		) as ComponentFixture<TestComponent>;
		expectDates(fixture.nativeElement, ['', '1', '2', '3', '4', '']);
	});

	it('should render custom month template', () => {
		const fixture = createGenericTestComponent(
			`
      <ngb-monthpicker #dp
                      [weekdays]="weekdays"
                      [showWeekNumbers]="showWeekNumbers"
                      [outsideDays]="outsideDays"
                      (select)="onClick($event)">
        <ng-template ngbMonthpickerContent><div class="customClass">Custom Content</div></ng-template>
      </ngb-monthpicker>
    `,
			TestComponent,
		) as ComponentFixture<TestComponent>;
		expectDates(fixture.nativeElement, []);
		expect(fixture.nativeElement.querySelectorAll('.customClass').length).toEqual(1);
		expect(fixture.nativeElement.querySelectorAll('.customClass')[0].innerText.trim()).toEqual('Custom Content');
	});

	it('should prefer custom month template passed via the input', () => {
		const fixture = createGenericTestComponent(
			`
			<ng-template #cc><div class="customClass">Custom Content</div></ng-template>
      <ngb-monthpicker #dp
                      [weekdays]="weekdays"
                      [showWeekNumbers]="showWeekNumbers"
                      [outsideDays]="outsideDays"
                      [contentTemplate]='cc'
                      (select)="onClick($event)">
        <ng-template ngbMonthpickerContent><div class="customClass">Custom Inline Content</div></ng-template>
      </ngb-monthpicker>
    `,
			TestComponent,
		) as ComponentFixture<TestComponent>;
		expectDates(fixture.nativeElement, []);
		expect(fixture.nativeElement.querySelectorAll('.customClass').length).toEqual(1);
		expect(fixture.nativeElement.querySelectorAll('.customClass')[0].innerText.trim()).toEqual('Custom Content');
	});

	it('should handle keyboard events with custom month template', () => {
		const fixture = createGenericTestComponent(
			`
      <ngb-monthpicker #dp
                      [weekdays]="weekdays"
                      [showWeekNumbers]="showWeekNumbers"
                      [outsideDays]="outsideDays"
                      (select)="onClick($event)">
        <ng-template ngbMonthpickerContent><div class="customClass">Custom Content</div></ng-template>
      </ngb-monthpicker>
    `,
			TestComponent,
		) as ComponentFixture<TestComponent>;
		expectDates(fixture.nativeElement, []);
		expect(fixture.nativeElement.querySelectorAll('.customClass').length).toEqual(1);
		expect(fixture.nativeElement.querySelectorAll('.customClass')[0].innerText.trim()).toEqual('Custom Content');
	});
});

@Component({ selector: 'test-cmp', standalone: true, imports: [NgbMonthpickerModule], template: '' })
class TestComponent {
	weekdays = true;
	showWeekNumbers = true;
	outsideDays = 'visible';

	onClick = (event) => {};
}
