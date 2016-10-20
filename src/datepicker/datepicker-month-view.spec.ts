import {TestBed, ComponentFixture} from '@angular/core/testing';
import {createGenericTestComponent, isBrowser} from '../test/common';

import {Component} from '@angular/core';

import {NgbDatepickerModule} from './datepicker.module';
import {NgbDatepickerMonthView} from './datepicker-month-view';
import {MonthViewModel} from './datepicker-view-model';
import {NgbDate} from './ngb-date';
import {NgbDatepickerDayView} from './datepicker-day-view';

const createTestComponent = (html: string) =>
    createGenericTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;

function getWeekdays(element: HTMLElement): HTMLElement[] {
  return <HTMLElement[]>Array.from(element.querySelectorAll('td.weekday'));
}

function getWeekNumbers(element: HTMLElement): HTMLElement[] {
  return <HTMLElement[]>Array.from(element.querySelectorAll('td.weeknumber'));
}

function getDates(element: HTMLElement): HTMLElement[] {
  return <HTMLElement[]>Array.from(element.querySelectorAll('td.day'));
}

function expectWeekdays(element: HTMLElement, weekdays: string[]) {
  const result = getWeekdays(element).map(td => td.innerText.trim());
  expect(result).toEqual(weekdays);
}

function expectWeekNumbers(element: HTMLElement, weeknumbers: string[]) {
  const result = getWeekNumbers(element).map(td => td.innerText.trim());
  expect(result).toEqual(weeknumbers);
}

function expectDates(element: HTMLElement, dates: string[]) {
  const result = getDates(element).map(td => td.innerText.trim());
  expect(result).toEqual(dates);
}

describe('ngbDatepickerMonthView', () => {

  beforeEach(() => {
    TestBed.overrideModule(NgbDatepickerModule, {set: {exports: [NgbDatepickerMonthView, NgbDatepickerDayView]}});
    TestBed.configureTestingModule({declarations: [TestComponent], imports: [NgbDatepickerModule.forRoot()]});
  });

  it('should show/hide weekdays', () => {
    const fixture =
        createTestComponent('<tbody ngbDatepickerMonthView [month]="month" [showWeekdays]="showWeekdays"></tbody>');

    expectWeekdays(fixture.nativeElement, ['Mo']);

    fixture.componentInstance.showWeekdays = false;
    fixture.detectChanges();
    expectWeekdays(fixture.nativeElement, []);
  });

  it('should show/hide week numbers', () => {
    const fixture = createTestComponent(
        '<tbody ngbDatepickerMonthView [month]="month" [showWeekNumbers]="showWeekNumbers"></tbody>');

    expectWeekNumbers(fixture.nativeElement, ['2']);

    fixture.componentInstance.showWeekNumbers = false;
    fixture.detectChanges();
    expectWeekNumbers(fixture.nativeElement, []);
  });

  it('should use custom template to display dates', () => {
    const fixture = createTestComponent(`
        <template #tpl let-date="date">{{ date.day }}</template>
        <tbody ngbDatepickerMonthView [month]="month" [dayTemplate]="tpl"></tbody>
      `);
    expectDates(fixture.nativeElement, ['22', '23']);
  });

  it('should send date selection events', () => {
    const fixture = createTestComponent(`
        <template #tpl let-date="date">{{ date.day }}</template>
        <tbody ngbDatepickerMonthView [month]="month" [dayTemplate]="tpl" (select)="onClick($event)"></tbody>
      `);

    spyOn(fixture.componentInstance, 'onClick');

    const dates = getDates(fixture.nativeElement);
    dates[0].click();

    expect(fixture.componentInstance.onClick).toHaveBeenCalledWith(new NgbDate(2016, 7, 22));
  });

  it('should not send date selection events for disabled dates', () => {
    const fixture = createTestComponent(`
        <template #tpl let-date="date">{{ date.day }}</template>
        <tbody ngbDatepickerMonthView [month]="month" [dayTemplate]="tpl" (select)="onClick($event)"></tbody>
      `);

    fixture.componentInstance.month.weeks[0].days[0].disabled = true;
    fixture.detectChanges();

    spyOn(fixture.componentInstance, 'onClick');

    const dates = getDates(fixture.nativeElement);
    dates[0].click();

    expect(fixture.componentInstance.onClick).not.toHaveBeenCalled();
  });

  it('should not send date selection events if disabled', () => {
    const fixture = createTestComponent(`
        <template #tpl let-date="date">{{ date.day }}</template>
        <tbody ngbDatepickerMonthView [month]="month" [dayTemplate]="tpl" [disabled]="true" (select)="onClick($event)"></tbody>
      `);

    fixture.detectChanges();

    spyOn(fixture.componentInstance, 'onClick');

    const dates = getDates(fixture.nativeElement);
    dates[0].click();

    expect(fixture.componentInstance.onClick).not.toHaveBeenCalled();
  });

  if (!isBrowser('ie9')) {
    it('should set cursor to pointer', () => {
      const fixture = createTestComponent(`
        <template #tpl let-date="date">{{ date.day }}</template>
        <table><tbody ngbDatepickerMonthView [month]="month" [dayTemplate]="tpl"
        (change)="onClick($event)"></tbody></table>
      `);

      const dates = getDates(fixture.nativeElement);
      expect(window.getComputedStyle(dates[0]).getPropertyValue('cursor')).toBe('pointer');
    });
  }

  if (!isBrowser('ie9')) {
    it('should set default cursor for disabled dates', () => {
      const fixture = createTestComponent(`
        <template #tpl let-date="date">{{ date.day }}</template>
        <table><tbody ngbDatepickerMonthView [month]="month" [dayTemplate]="tpl"
        (change)="onClick($event)"></tbody></table>
      `);

      fixture.componentInstance.month.weeks[0].days[0].disabled = true;
      fixture.detectChanges();

      const dates = getDates(fixture.nativeElement);
      expect(window.getComputedStyle(dates[0]).getPropertyValue('cursor')).toBe('default');
    });

    it('should set default cursor for all dates if disabled', () => {
      const fixture = createTestComponent(`
        <template #tpl let-date="date">{{ date.day }}</template>
        <table><tbody ngbDatepickerMonthView [month]="month" [dayTemplate]="tpl"
        (change)="onClick($event)" [disabled]="true"></tbody></table>
      `);

      fixture.detectChanges();

      const dates = getDates(fixture.nativeElement);
      dates.forEach((date) => expect(window.getComputedStyle(date).getPropertyValue('cursor')).toBe('default'));
    });

    it('should set default cursor for other months days', () => {
      const fixture =
          createTestComponent('<tbody ngbDatepickerMonthView [month]="month" [outsideDays]="outsideDays"></tbody>');

      const dates = getDates(fixture.nativeElement);
      expect(window.getComputedStyle(dates[1]).getPropertyValue('cursor')).toBe('pointer');

      fixture.componentInstance.outsideDays = 'collapsed';
      fixture.detectChanges();
      expect(window.getComputedStyle(dates[1]).getPropertyValue('cursor')).toBe('default');

      fixture.componentInstance.outsideDays = 'hidden';
      fixture.detectChanges();
      expect(window.getComputedStyle(dates[1]).getPropertyValue('cursor')).toBe('default');
    });
  }

  it('should apply proper visibility to other months days', () => {
    const fixture =
        createTestComponent('<tbody ngbDatepickerMonthView [month]="month" [outsideDays]="outsideDays"></tbody>');

    let dates = getDates(fixture.nativeElement);
    expect(dates[0]).not.toHaveCssClass('hidden');
    expect(dates[0]).not.toHaveCssClass('collapsed');
    expect(dates[1]).not.toHaveCssClass('hidden');
    expect(dates[1]).not.toHaveCssClass('collapsed');

    fixture.componentInstance.outsideDays = 'collapsed';
    fixture.detectChanges();
    expect(dates[0]).not.toHaveCssClass('hidden');
    expect(dates[0]).not.toHaveCssClass('collapsed');
    expect(dates[1]).not.toHaveCssClass('hidden');
    expect(dates[1]).toHaveCssClass('collapsed');

    fixture.componentInstance.outsideDays = 'hidden';
    fixture.detectChanges();
    expect(dates[0]).not.toHaveCssClass('hidden');
    expect(dates[0]).not.toHaveCssClass('collapsed');
    expect(dates[1]).toHaveCssClass('hidden');
    expect(dates[1]).not.toHaveCssClass('collapsed');
  });

});

@Component({selector: 'test-cmp', template: ''})
class TestComponent {
  month: MonthViewModel = {
    year: 2016,
    number: 7,
    weekdays: [1],
    weeks: [{
      number: 2,
      days: [{date: new NgbDate(2016, 7, 22), disabled: false}, {date: new NgbDate(2016, 8, 23), disabled: false}]
    }]
  };

  showWeekdays = true;
  showWeekNumbers = true;
  outsideDays = 'visible';

  onClick = () => {};
}
