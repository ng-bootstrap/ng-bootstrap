import {TestBed, ComponentFixture, async, inject} from '@angular/core/testing';
import {createGenericTestComponent} from '../test/common';
import {getMonthSelect, getYearSelect, getNavigationLinks} from '../test/datepicker/common';

import {Component, TemplateRef, DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators} from '@angular/forms';

import {NgbDatepickerModule} from './datepicker.module';
import {NgbDate} from './ngb-date';
import {NgbDatepickerConfig} from './datepicker-config';
import {NgbDatepicker} from './datepicker';
import {DayTemplateContext} from './datepicker-day-template-context';
import {NgbDateStruct} from './ngb-date-struct';
import {NgbDatepickerMonthView} from './datepicker-month-view';
import {NgbDatepickerDayView} from './datepicker-day-view';
import {NgbDatepickerNavigationSelect} from './datepicker-navigation-select';
import {NgbDatepickerNavigation} from './datepicker-navigation';

const createTestComponent = (html: string) =>
    createGenericTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;

function getDates(element: HTMLElement): HTMLElement[] {
  return <HTMLElement[]>Array.from(element.querySelectorAll('.ngb-dp-day'));
}

function getDay(element: HTMLElement, index: number): HTMLElement {
  return getDates(element)[index].querySelector('div') as HTMLElement;
}

function getDatepicker(element: HTMLElement): HTMLElement {
  return element.querySelector('ngb-datepicker') as HTMLElement;
}

function triggerKeyDown(element: DebugElement, keyCode: number, shiftKey = false) {
  let event = {
    which: keyCode,
    shiftKey: shiftKey,
    defaultPrevented: false,
    propagationStopped: false,
    stopPropagation: function() { this.propagationStopped = true; },
    preventDefault: function() { this.defaultPrevented = true; }
  };
  element.triggerEventHandler('keydown', event);
  return event;
}

function expectFilteredDaysToBe(
    element: DebugElement, expectedDates: NgbDate[],
    filterFn: (dayView: NgbDatepickerDayView, element: DebugElement) => boolean) {
  const days = element.queryAll(By.directive(NgbDatepickerDayView))
                   .filter((day: DebugElement) => { return filterFn(day.componentInstance, day); })
                   .map((value: DebugElement) => NgbDate.from(value.componentInstance.date));
  expect(days).toEqual(expectedDates);
}

function expectSelectedDate(element: DebugElement, date: NgbDate) {
  expectFilteredDaysToBe(element, date ? [date] : [], (dayView: NgbDatepickerDayView) => dayView.selected);
}

function expectFocusedDate(element: DebugElement, date: NgbDate) {
  expectFilteredDaysToBe(element, date ? [date] : [], (dayView: NgbDatepickerDayView) => dayView.focused);
}

function expectSameValues(datepicker: NgbDatepicker, config: NgbDatepickerConfig) {
  expect(datepicker.dayTemplate).toBe(config.dayTemplate);
  expect(datepicker.displayMonths).toBe(config.displayMonths);
  expect(datepicker.firstDayOfWeek).toBe(config.firstDayOfWeek);
  expect(datepicker.markDisabled).toBe(config.markDisabled);
  expect(datepicker.minDate).toEqual(config.minDate);
  expect(datepicker.maxDate).toEqual(config.maxDate);
  expect(datepicker.navigation).toBe(config.navigation);
  expect(datepicker.outsideDays).toBe(config.outsideDays);
  expect(datepicker.showWeekdays).toBe(config.showWeekdays);
  expect(datepicker.showWeekNumbers).toBe(config.showWeekNumbers);
  expect(datepicker.startDate).toEqual(config.startDate);
}

function customizeConfig(config: NgbDatepickerConfig) {
  config.dayTemplate = {} as TemplateRef<DayTemplateContext>;
  config.firstDayOfWeek = 2;
  config.markDisabled = (date, current) => false;
  config.minDate = {year: 2000, month: 1, day: 1};
  config.maxDate = {year: 2030, month: 12, day: 31};
  config.navigation = 'none';
  config.outsideDays = 'collapsed';
  config.showWeekdays = false;
  config.showWeekNumbers = true;
  config.startDate = {year: 2015, month: 1};
}

describe('ngb-datepicker', () => {

  beforeEach(() => {
    TestBed.configureTestingModule(
        {declarations: [TestComponent], imports: [NgbDatepickerModule.forRoot(), FormsModule, ReactiveFormsModule]});
  });

  it('should initialize inputs with provided config', () => {
    const defaultConfig = new NgbDatepickerConfig();
    const datepicker = TestBed.createComponent(NgbDatepicker).componentInstance;
    expectSameValues(datepicker, defaultConfig);
  });

  it('should display current month if no date provided', () => {
    const fixture = createTestComponent(`<ngb-datepicker></ngb-datepicker>`);

    const today = new Date();
    expect(getMonthSelect(fixture.nativeElement).value).toBe(`${today.getMonth() + 1}`);
    expect(getYearSelect(fixture.nativeElement).value).toBe(`${today.getFullYear()}`);
  });

  it('should throw if max date is before min date', () => {
    expect(() => {
      createTestComponent('<ngb-datepicker [minDate]="maxDate" [maxDate]="minDate"></ngb-datepicker>');
    }).toThrowError();
  });

  it('should handle incorrect startDate values', () => {
    const fixture = createTestComponent(`<ngb-datepicker [startDate]="date"></ngb-datepicker>`);
    const today = new Date();
    const currentMonth = `${today.getMonth() + 1}`;
    const currentYear = `${today.getFullYear()}`;

    expect(getMonthSelect(fixture.nativeElement).value).toBe('8');
    expect(getYearSelect(fixture.nativeElement).value).toBe('2016');

    fixture.componentInstance.date = null;
    fixture.detectChanges();
    expect(getMonthSelect(fixture.nativeElement).value).toBe(currentMonth);
    expect(getYearSelect(fixture.nativeElement).value).toBe(currentYear);

    fixture.componentInstance.date = undefined;
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

    fixture.componentInstance.date = new NgbDate(3000000, 1, 1);
    fixture.detectChanges();
    expect(getMonthSelect(fixture.nativeElement).value).toBe(currentMonth);
    expect(getYearSelect(fixture.nativeElement).value).toBe(currentYear);
  });

  it('should handle incorrect minDate values', () => {
    const fixture = createTestComponent(
        `<ngb-datepicker [minDate]="minDate" [maxDate]="maxDate" [startDate]="date"></ngb-datepicker>`);

    function expectMinDate(year: number, month: number) {
      fixture.componentInstance.date = {year: 0, month: 1};
      fixture.detectChanges();
      expect(getMonthSelect(fixture.nativeElement).value).toBe(`${month}`);
      expect(getYearSelect(fixture.nativeElement).value).toBe(`${year}`);

      // resetting
      fixture.componentInstance.date = {year: 1000, month: 1};
      fixture.detectChanges();
    }

    expectMinDate(2010, 1);

    fixture.componentInstance.minDate = null;
    fixture.detectChanges();
    expectMinDate(990, 1);

    fixture.componentInstance.minDate = undefined;
    fixture.detectChanges();
    expectMinDate(990, 1);

    fixture.componentInstance.minDate = <any>{};
    fixture.detectChanges();
    expectMinDate(990, 1);

    fixture.componentInstance.minDate = <any>new Date();
    fixture.detectChanges();
    expectMinDate(990, 1);

    fixture.componentInstance.minDate = new NgbDate(3000000, 1, 1);
    fixture.detectChanges();
    expectMinDate(990, 1);
  });

  it('should handle incorrect maxDate values', () => {
    const fixture = createTestComponent(
        `<ngb-datepicker [minDate]="minDate" [maxDate]="maxDate" [startDate]="date"></ngb-datepicker>`);

    function expectMaxDate(year: number, month: number) {
      fixture.componentInstance.date = {year: 10000, month: 1};
      fixture.detectChanges();
      expect(getMonthSelect(fixture.nativeElement).value).toBe(`${month}`);
      expect(getYearSelect(fixture.nativeElement).value).toBe(`${year}`);

      // resetting
      fixture.componentInstance.date = {year: 3000, month: 1};
      fixture.detectChanges();
    }

    expectMaxDate(2020, 12);

    fixture.componentInstance.maxDate = null;
    fixture.detectChanges();
    expectMaxDate(3010, 12);

    fixture.componentInstance.maxDate = undefined;
    fixture.detectChanges();
    expectMaxDate(3010, 12);

    fixture.componentInstance.maxDate = <any>{};
    fixture.detectChanges();
    expectMaxDate(3010, 12);

    fixture.componentInstance.maxDate = <any>new Date();
    fixture.detectChanges();
    expectMaxDate(3010, 12);

    fixture.componentInstance.maxDate = new NgbDate(3000000, 1, 1);
    fixture.detectChanges();
    expectMaxDate(3010, 12);
  });

  it('should support disabling dates via callback', () => {
    const fixture = createTestComponent(
        `<ngb-datepicker [startDate]="date" [minDate]="minDate" [maxDate]="maxDate" [markDisabled]="markDisabled"></ngb-datepicker>`);

    // 22 AUG 2016
    expect(getDay(fixture.nativeElement, 21)).toHaveCssClass('text-muted');
  });

  it('should support disabling dates via min/max dates', () => {
    const fixture = createTestComponent(
        `<ngb-datepicker [startDate]="date" [minDate]="minDate" [maxDate]="maxDate"></ngb-datepicker>`);

    fixture.componentInstance.minDate = {year: 2016, month: 8, day: 20};
    fixture.componentInstance.maxDate = {year: 2016, month: 8, day: 25};
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
        `<ngb-datepicker [startDate]="date" [minDate]="minDate" [maxDate]="maxDate" [markDisabled]="markDisabled"></ngb-datepicker>`);

    // 22 AUG 2016
    expect(getDay(fixture.nativeElement, 21)).toHaveCssClass('text-muted');
  });

  it('should display multiple months', () => {
    const fixture = createTestComponent(`<ngb-datepicker [displayMonths]="displayMonths"></ngb-datepicker>`);

    let months = fixture.debugElement.queryAll(By.directive(NgbDatepickerMonthView));
    expect(months.length).toBe(1);

    fixture.componentInstance.displayMonths = 3;
    fixture.detectChanges();
    months = fixture.debugElement.queryAll(By.directive(NgbDatepickerMonthView));
    expect(months.length).toBe(3);
  });

  it('should switch navigation types', () => {
    const fixture = createTestComponent(`<ngb-datepicker [navigation]="navigation"></ngb-datepicker>`);

    expect(fixture.debugElement.query(By.directive(NgbDatepickerNavigationSelect))).not.toBeNull();
    expect(fixture.debugElement.query(By.directive(NgbDatepickerNavigation))).not.toBeNull();

    fixture.componentInstance.navigation = 'arrows';
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.directive(NgbDatepickerNavigationSelect))).toBeNull();
    expect(fixture.debugElement.query(By.directive(NgbDatepickerNavigation))).not.toBeNull();

    fixture.componentInstance.navigation = 'none';
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.directive(NgbDatepickerNavigationSelect))).toBeNull();
    expect(fixture.debugElement.query(By.directive(NgbDatepickerNavigation))).toBeNull();
  });

  it('should override outside days to "hidden" if there are multiple months displayed', () => {
    const fixture = createTestComponent(
        `<ngb-datepicker [displayMonths]="displayMonths" [outsideDays]="'collapsed'"></ngb-datepicker>`);


    let months = fixture.debugElement.queryAll(By.directive(NgbDatepickerMonthView));
    expect(months[0].componentInstance.outsideDays).toBe('collapsed');

    fixture.componentInstance.displayMonths = 2;
    fixture.detectChanges();
    months = fixture.debugElement.queryAll(By.directive(NgbDatepickerMonthView));
    expect(months[0].componentInstance.outsideDays).toBe('hidden');
  });

  it('should toggle month names display for a single month', () => {
    const fixture = createTestComponent(
        `<ngb-datepicker [startDate]="date" [displayMonths]="1" [navigation]="navigation"></ngb-datepicker>`);

    let months = fixture.debugElement.queryAll(By.css('.ngb-dp-month-name'));
    expect(months.length).toBe(0);

    fixture.componentInstance.navigation = 'arrows';
    fixture.detectChanges();
    months = fixture.debugElement.queryAll(By.css('.ngb-dp-month-name'));
    expect(months.length).toBe(1);
    expect(months.map(c => c.nativeElement.innerText.trim())).toEqual(['August 2016']);

    fixture.componentInstance.navigation = 'none';
    fixture.detectChanges();
    months = fixture.debugElement.queryAll(By.css('.ngb-dp-month-name'));
    expect(months.length).toBe(1);
    expect(months.map(c => c.nativeElement.innerText.trim())).toEqual(['August 2016']);
  });

  it('should always display month names for multiple months', () => {
    const fixture = createTestComponent(
        `<ngb-datepicker [startDate]="date" [displayMonths]="3" [navigation]="navigation"></ngb-datepicker>`);

    let months = fixture.debugElement.queryAll(By.css('.ngb-dp-month-name'));
    expect(months.length).toBe(3);
    expect(months.map(c => c.nativeElement.innerText.trim())).toEqual([
      'August 2016', 'September 2016', 'October 2016'
    ]);

    fixture.componentInstance.navigation = 'arrows';
    fixture.detectChanges();
    months = fixture.debugElement.queryAll(By.css('.ngb-dp-month-name'));
    expect(months.length).toBe(3);
    expect(months.map(c => c.nativeElement.innerText.trim())).toEqual([
      'August 2016', 'September 2016', 'October 2016'
    ]);
  });

  it('should emit navigate event when startDate is defined', () => {
    TestBed.overrideComponent(
        TestComponent,
        {set: {template: `<ngb-datepicker [startDate]="date" (navigate)="onNavigate($event)"></ngb-datepicker>`}});
    const fixture = TestBed.createComponent(TestComponent);

    spyOn(fixture.componentInstance, 'onNavigate');
    fixture.detectChanges();

    expect(fixture.componentInstance.onNavigate).toHaveBeenCalledWith({current: null, next: {year: 2016, month: 8}});
  });

  it('should emit navigate event without startDate defined', () => {
    TestBed.overrideComponent(
        TestComponent, {set: {template: `<ngb-datepicker (navigate)="onNavigate($event)"></ngb-datepicker>`}});
    const fixture = TestBed.createComponent(TestComponent);
    const now = new Date();

    spyOn(fixture.componentInstance, 'onNavigate');
    fixture.detectChanges();

    expect(fixture.componentInstance.onNavigate)
        .toHaveBeenCalledWith({current: null, next: {year: now.getFullYear(), month: now.getMonth() + 1}});
  });

  it('should emit navigate event using built-in navigation arrows', () => {
    const fixture =
        createTestComponent(`<ngb-datepicker [startDate]="date" (navigate)="onNavigate($event)"></ngb-datepicker>`);

    spyOn(fixture.componentInstance, 'onNavigate');
    const navigation = getNavigationLinks(fixture.nativeElement);

    // JUL 2016
    navigation[0].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.onNavigate)
        .toHaveBeenCalledWith({current: {year: 2016, month: 8}, next: {year: 2016, month: 7}});
  });

  it('should emit navigate event using navigateTo({date})', () => {
    const fixture =
        createTestComponent(`<ngb-datepicker #dp [startDate]="date" (navigate)="onNavigate($event)"></ngb-datepicker>
       <button id="btn"(click)="dp.navigateTo({year: 2015, month: 6})"></button>`);

    spyOn(fixture.componentInstance, 'onNavigate');
    const button = fixture.nativeElement.querySelector('button#btn');
    button.click();

    fixture.detectChanges();
    expect(fixture.componentInstance.onNavigate)
        .toHaveBeenCalledWith({current: {year: 2016, month: 8}, next: {year: 2015, month: 6}});
  });

  it('should calculate header dimensions correctly', () => {
    const datepicker = TestBed.createComponent(NgbDatepicker).componentInstance;

    // 1, 'select', weekdays
    expect(datepicker.getHeaderHeight()).toBe(4.25);
    expect(datepicker.getHeaderMargin()).toBe(2);

    // 1, 'select', no weekdays
    datepicker.showWeekdays = false;
    expect(datepicker.getHeaderHeight()).toBe(2.25);
    expect(datepicker.getHeaderMargin()).toBe(0);

    // 1, 'none', no weekdays
    datepicker.navigation = 'none';
    expect(datepicker.getHeaderHeight()).toBe(2.25);
    expect(datepicker.getHeaderMargin()).toBe(2);

    // 2, 'none', no weekdays
    datepicker.displayMonths = 2;
    expect(datepicker.getHeaderHeight()).toBe(2.25);
    expect(datepicker.getHeaderMargin()).toBe(2);

    // 2, 'select', no weekdays
    datepicker.navigation = 'select';
    expect(datepicker.getHeaderHeight()).toBe(4.25);
    expect(datepicker.getHeaderMargin()).toBe(2);

    // 2, 'select', weekdays
    datepicker.showWeekdays = true;
    expect(datepicker.getHeaderHeight()).toBe(6.25);
    expect(datepicker.getHeaderMargin()).toBe(4);

    // 2, 'none', weekdays
    datepicker.navigation = 'none';
    expect(datepicker.getHeaderHeight()).toBe(4.25);
    expect(datepicker.getHeaderMargin()).toBe(4);
  });

  it('should allow focusing datepicker programmatically', () => {
    const datepicker = TestBed.createComponent(NgbDatepicker);
    expect(datepicker.nativeElement.getAttribute('tabindex')).toBe('0');

    datepicker.componentInstance.focus();
    expect(document.activeElement).toBe(datepicker.nativeElement);
  });

  describe('ngModel', () => {

    it('should update model based on calendar clicks', async(() => {
         const fixture = createTestComponent(
             `<ngb-datepicker [startDate]="date" [minDate]="minDate" [maxDate]="maxDate" [(ngModel)]="model"></ngb-datepicker>`);

         const dates = getDates(fixture.nativeElement);
         dates[0].click();  // 1 AUG 2016
         expect(fixture.componentInstance.model).toEqual({year: 2016, month: 8, day: 1});

         dates[1].click();
         expect(fixture.componentInstance.model).toEqual({year: 2016, month: 8, day: 2});
       }));

    it('should not update model based on calendar clicks when disabled', async(() => {
         const fixture = createTestComponent(
             `<ngb-datepicker [startDate]="date" [minDate]="minDate" [maxDate]="maxDate" [(ngModel)]="model" [disabled]="true">
              </ngb-datepicker>`);

         fixture.whenStable()
             .then(() => {
               fixture.detectChanges();
               return fixture.whenStable();
             })
             .then(() => {

               const dates = getDates(fixture.nativeElement);
               dates[0].click();  // 1 AUG 2016
               expect(fixture.componentInstance.model).toBeFalsy();

               dates[1].click();
               expect(fixture.componentInstance.model).toBeFalsy();
             });
       }));

    it('select calendar date based on model updates', async(() => {
         const fixture = createTestComponent(
             `<ngb-datepicker [startDate]="date" [minDate]="minDate" [maxDate]="maxDate" [(ngModel)]="model"></ngb-datepicker>`);

         fixture.componentInstance.model = {year: 2016, month: 8, day: 1};

         fixture.detectChanges();
         fixture.whenStable()
             .then(() => {
               fixture.detectChanges();
               return fixture.whenStable();
             })
             .then(() => {
               expect(getDay(fixture.nativeElement, 0)).toHaveCssClass('bg-primary');

               fixture.componentInstance.model = {year: 2016, month: 8, day: 2};
               fixture.detectChanges();
               return fixture.whenStable();
             })
             .then(() => {
               fixture.detectChanges();
               return fixture.whenStable();
             })
             .then(() => {
               expect(getDay(fixture.nativeElement, 0)).not.toHaveCssClass('bg-primary');
               expect(getDay(fixture.nativeElement, 1)).toHaveCssClass('bg-primary');
             });
       }));

    it('should switch month when clicked on the date outside of current month', async(() => {
         const fixture = createTestComponent(
             `<ngb-datepicker [startDate]="date" [minDate]="minDate" [maxDate]="maxDate" [(ngModel)]="model"></ngb-datepicker>`);
         fixture.detectChanges();
         fixture.whenStable().then(() => {

           let dates = getDates(fixture.nativeElement);

           dates[31].click();  // 1 SEP 2016
           expect(fixture.componentInstance.model).toEqual({year: 2016, month: 9, day: 1});

           // month changes to SEP
           fixture.detectChanges();
           expect(getDay(fixture.nativeElement, 0).innerText).toBe('29');          // 29 AUG 2016
           expect(getDay(fixture.nativeElement, 3)).toHaveCssClass('bg-primary');  // 1 SEP still selected
         });
       }));

    it('should switch month on prev/next navigation click', async(() => {
         const fixture = createTestComponent(
             `<ngb-datepicker [startDate]="date" [minDate]="minDate" [maxDate]="maxDate" [(ngModel)]="model"></ngb-datepicker>`);

         let dates = getDates(fixture.nativeElement);
         const navigation = getNavigationLinks(fixture.nativeElement);

         dates[0].click();  // 1 AUG 2016
         expect(fixture.componentInstance.model).toEqual({year: 2016, month: 8, day: 1});

         // PREV
         navigation[0].click();
         fixture.detectChanges();
         dates = getDates(fixture.nativeElement);
         dates[4].click();  // 1 JUL 2016
         expect(fixture.componentInstance.model).toEqual({year: 2016, month: 7, day: 1});

         // NEXT
         navigation[1].click();
         fixture.detectChanges();
         dates = getDates(fixture.nativeElement);
         dates[0].click();  // 1 AUG 2016
         expect(fixture.componentInstance.model).toEqual({year: 2016, month: 8, day: 1});
       }));

    it('should switch month using navigateTo({date})', async(() => {
         const fixture = createTestComponent(
             `<ngb-datepicker #dp [startDate]="date" [minDate]="minDate" [maxDate]="maxDate" [(ngModel)]="model"></ngb-datepicker>
       <button id="btn"(click)="dp.navigateTo({year: 2015, month: 6})"></button>`);

         const button = fixture.nativeElement.querySelector('button#btn');
         button.click();

         fixture.detectChanges();
         expect(getMonthSelect(fixture.nativeElement).value).toBe('6');
         expect(getYearSelect(fixture.nativeElement).value).toBe('2015');

         const dates = getDates(fixture.nativeElement);
         dates[0].click();  // 1 JUN 2015
         expect(fixture.componentInstance.model).toEqual({year: 2015, month: 6, day: 1});
       }));

    it('should switch to current month using navigateTo() without arguments', () => {
      const fixture = createTestComponent(
          `<ngb-datepicker #dp [startDate]="date" [minDate]="minDate" [maxDate]="maxDate"></ngb-datepicker>
       <button id="btn"(click)="dp.navigateTo()"></button>`);

      const button = fixture.nativeElement.querySelector('button#btn');
      button.click();

      fixture.detectChanges();
      const today = new Date();
      expect(getMonthSelect(fixture.nativeElement).value).toBe(`${today.getMonth() + 1}`);
      expect(getYearSelect(fixture.nativeElement).value).toBe(`${today.getFullYear()}`);
    });

    it('should support disabling all dates and navigation via the disabled attribute', async(() => {
         const fixture = createTestComponent(
             `<ngb-datepicker [(ngModel)]="model" [startDate]="date" [disabled]="true"></ngb-datepicker>`);
         fixture.detectChanges();
         fixture.whenStable()
             .then(() => {
               fixture.detectChanges();
               return fixture.whenStable();
             })
             .then(() => {
               for (let index = 0; index < 31; index++) {
                 expect(getDay(fixture.nativeElement, index)).toHaveCssClass('text-muted');
               }

               const links = getNavigationLinks(fixture.nativeElement);
               expect(links[0].hasAttribute('disabled')).toBeTruthy();
               expect(links[1].hasAttribute('disabled')).toBeTruthy();
               expect(getYearSelect(fixture.nativeElement).disabled).toBeTruthy();
               expect(getMonthSelect(fixture.nativeElement).disabled).toBeTruthy();
             });
       }));
  });

  describe('keyboard navigation', () => {

    const template = `<ngb-datepicker #dp
        [startDate]="date" [minDate]="minDate"
        [maxDate]="maxDate" [displayMonths]="2"
        [markDisabled]="markDisabled"></ngb-datepicker>`;

    it('should move focus with arrow keys', () => {
      const fixture = createTestComponent(template);

      const datepicker = fixture.debugElement.query(By.directive(NgbDatepicker));
      expectFocusedDate(datepicker, null);
      expectSelectedDate(datepicker, null);

      datepicker.triggerEventHandler('focus', {});
      fixture.detectChanges();
      expectFocusedDate(datepicker, new NgbDate(2016, 8, 1));
      expectSelectedDate(datepicker, null);

      triggerKeyDown(datepicker, 40 /* down arrow */);
      fixture.detectChanges();
      expectFocusedDate(datepicker, new NgbDate(2016, 8, 8));
      expectSelectedDate(datepicker, null);

      triggerKeyDown(datepicker, 39 /* right arrow */);
      fixture.detectChanges();
      expectFocusedDate(datepicker, new NgbDate(2016, 8, 9));
      expectSelectedDate(datepicker, null);

      triggerKeyDown(datepicker, 38 /* up arrow */);
      fixture.detectChanges();
      expectFocusedDate(datepicker, new NgbDate(2016, 8, 2));
      expectSelectedDate(datepicker, null);

      triggerKeyDown(datepicker, 37 /* left arrow */);
      fixture.detectChanges();
      expectFocusedDate(datepicker, new NgbDate(2016, 8, 1));
      expectSelectedDate(datepicker, null);

      datepicker.triggerEventHandler('blur', {});
      fixture.detectChanges();
      expectFocusedDate(datepicker, null);
    });

    it('should select focused date with enter or space', () => {
      const fixture = createTestComponent(template);

      const datepicker = fixture.debugElement.query(By.directive(NgbDatepicker));
      expectFocusedDate(datepicker, null);
      expectSelectedDate(datepicker, null);

      datepicker.triggerEventHandler('focus', {});
      fixture.detectChanges();
      expectFocusedDate(datepicker, new NgbDate(2016, 8, 1));
      expectSelectedDate(datepicker, null);

      triggerKeyDown(datepicker, 32 /* space */);
      fixture.detectChanges();
      expectFocusedDate(datepicker, new NgbDate(2016, 8, 1));
      expectSelectedDate(datepicker, new NgbDate(2016, 8, 1));

      triggerKeyDown(datepicker, 40 /* down arrow */);
      fixture.detectChanges();
      expectFocusedDate(datepicker, new NgbDate(2016, 8, 8));
      expectSelectedDate(datepicker, new NgbDate(2016, 8, 1));

      triggerKeyDown(datepicker, 13 /* enter */);
      fixture.detectChanges();
      expectFocusedDate(datepicker, new NgbDate(2016, 8, 8));
      expectSelectedDate(datepicker, new NgbDate(2016, 8, 8));
    });

    it('should select first and last dates of the view with home/end', () => {
      const fixture = createTestComponent(template);

      const datepicker = fixture.debugElement.query(By.directive(NgbDatepicker));
      expectFocusedDate(datepicker, null);
      expectSelectedDate(datepicker, null);

      datepicker.triggerEventHandler('focus', {});
      fixture.detectChanges();
      expectFocusedDate(datepicker, new NgbDate(2016, 8, 1));
      expectSelectedDate(datepicker, null);

      triggerKeyDown(datepicker, 35 /* end */);
      fixture.detectChanges();
      expectFocusedDate(datepicker, new NgbDate(2016, 9, 30));
      expectSelectedDate(datepicker, null);

      triggerKeyDown(datepicker, 36 /* home */);
      fixture.detectChanges();
      expectFocusedDate(datepicker, new NgbDate(2016, 8, 1));
      expectSelectedDate(datepicker, null);
    });

    it('should select min and max dates with shift+home/end', () => {
      const fixture = createTestComponent(template);

      const datepicker = fixture.debugElement.query(By.directive(NgbDatepicker));
      expectFocusedDate(datepicker, null);
      expectSelectedDate(datepicker, null);

      datepicker.triggerEventHandler('focus', {});
      fixture.detectChanges();
      expectFocusedDate(datepicker, new NgbDate(2016, 8, 1));
      expectSelectedDate(datepicker, null);

      triggerKeyDown(datepicker, 35 /* end */, true /* shift */);
      fixture.detectChanges();
      expectFocusedDate(datepicker, new NgbDate(2020, 12, 31));
      expectSelectedDate(datepicker, null);

      triggerKeyDown(datepicker, 40 /* down arrow */);
      fixture.detectChanges();
      expectFocusedDate(datepicker, new NgbDate(2020, 12, 31));
      expectSelectedDate(datepicker, null);

      triggerKeyDown(datepicker, 36 /* home */, true /* shift */);
      fixture.detectChanges();
      expectFocusedDate(datepicker, new NgbDate(2010, 1, 1));
      expectSelectedDate(datepicker, null);

      triggerKeyDown(datepicker, 38 /* up arrow */);
      fixture.detectChanges();
      expectFocusedDate(datepicker, new NgbDate(2010, 1, 1));
      expectSelectedDate(datepicker, null);
    });

    it('should navigate between months with pageUp/Down', () => {
      const fixture = createTestComponent(template);

      const datepicker = fixture.debugElement.query(By.directive(NgbDatepicker));
      expectFocusedDate(datepicker, null);
      expectSelectedDate(datepicker, null);

      datepicker.triggerEventHandler('focus', {});
      fixture.detectChanges();
      expectFocusedDate(datepicker, new NgbDate(2016, 8, 1));
      expectSelectedDate(datepicker, null);

      triggerKeyDown(datepicker, 39 /* right arrow */);
      fixture.detectChanges();
      expectFocusedDate(datepicker, new NgbDate(2016, 8, 2));
      expectSelectedDate(datepicker, null);

      triggerKeyDown(datepicker, 33 /* page up */);
      fixture.detectChanges();
      expectFocusedDate(datepicker, new NgbDate(2016, 7, 1));
      expectSelectedDate(datepicker, null);

      triggerKeyDown(datepicker, 34 /* page down */);
      fixture.detectChanges();
      expectFocusedDate(datepicker, new NgbDate(2016, 8, 1));
      expectSelectedDate(datepicker, null);
    });

    it('should navigate between years with shift+pageUp/Down', () => {
      const fixture = createTestComponent(template);

      const datepicker = fixture.debugElement.query(By.directive(NgbDatepicker));
      expectFocusedDate(datepicker, null);
      expectSelectedDate(datepicker, null);

      datepicker.triggerEventHandler('focus', {});
      fixture.detectChanges();
      expectFocusedDate(datepicker, new NgbDate(2016, 8, 1));
      expectSelectedDate(datepicker, null);

      triggerKeyDown(datepicker, 33 /* page up */, true /* shift */);
      fixture.detectChanges();
      expectFocusedDate(datepicker, new NgbDate(2015, 1, 1));
      expectSelectedDate(datepicker, null);

      triggerKeyDown(datepicker, 34 /* page down */, true /* shift */);
      fixture.detectChanges();
      expectFocusedDate(datepicker, new NgbDate(2016, 1, 1));
      expectSelectedDate(datepicker, null);
    });

  });

  describe('forms', () => {

    it('should work with template-driven form validation', async(() => {
         const fixture = createTestComponent(`
        <form>
          <ngb-datepicker [startDate]="date" [minDate]="minDate" [maxDate]="maxDate" [(ngModel)]="model" name="date" required>
          </ngb-datepicker>
        </form>
      `);

         const compiled = fixture.nativeElement;
         fixture.detectChanges();
         fixture.whenStable()
             .then(() => {
               fixture.detectChanges();
               return fixture.whenStable();
             })
             .then(() => {
               expect(getDatepicker(compiled)).toHaveCssClass('ng-invalid');
               expect(getDatepicker(compiled)).not.toHaveCssClass('ng-valid');

               fixture.componentInstance.model = {year: 2016, month: 8, day: 1};
               fixture.detectChanges();
               return fixture.whenStable();
             })
             .then(() => {
               fixture.detectChanges();
               return fixture.whenStable();
             })
             .then(() => {
               expect(getDatepicker(compiled)).toHaveCssClass('ng-valid');
               expect(getDatepicker(compiled)).not.toHaveCssClass('ng-invalid');
             });
       }));

    it('should work with model-driven form validation', async(() => {
         const html = `
          <form [formGroup]="form">
            <ngb-datepicker [startDate]="date" [minDate]="minDate" [maxDate]="maxDate" formControlName="control" required></ngb-datepicker>
          </form>`;

         const fixture = createTestComponent(html);
         const compiled = fixture.nativeElement;
         fixture.detectChanges();
         fixture.whenStable()
             .then(() => {
               const dates = getDates(fixture.nativeElement);

               expect(getDatepicker(compiled)).toHaveCssClass('ng-invalid');
               expect(getDatepicker(compiled)).not.toHaveCssClass('ng-valid');

               dates[0].click();
               fixture.detectChanges();
               return fixture.whenStable();
             })
             .then(() => {
               expect(getDatepicker(compiled)).toHaveCssClass('ng-valid');
               expect(getDatepicker(compiled)).not.toHaveCssClass('ng-invalid');
             });
       }));

    it('should be disabled with reactive forms', async(() => {
         const html = `<form [formGroup]="disabledForm">
            <ngb-datepicker [startDate]="date" [minDate]="minDate" [maxDate]="maxDate" formControlName="control">
            </ngb-datepicker>
        </form>`;

         const fixture = createTestComponent(html);
         fixture.detectChanges();
         const dates = getDates(fixture.nativeElement);
         dates[0].click();  // 1 AUG 2016
         expect(fixture.componentInstance.disabledForm.controls['control'].value).toBeFalsy();
         for (let index = 0; index < 31; index++) {
           expect(getDay(fixture.nativeElement, index)).toHaveCssClass('text-muted');
         }
         expect(fixture.nativeElement.querySelector('ngb-datepicker').getAttribute('tabindex')).toBeFalsy();
       }));
  });

  describe('Custom config', () => {
    let config: NgbDatepickerConfig;

    beforeEach(() => { TestBed.configureTestingModule({imports: [NgbDatepickerModule.forRoot()]}); });

    beforeEach(inject([NgbDatepickerConfig], (c: NgbDatepickerConfig) => {
      config = c;
      customizeConfig(config);
    }));

    it('should initialize inputs with provided config', () => {
      const fixture = TestBed.createComponent(NgbDatepicker);

      const datepicker = fixture.componentInstance;
      expectSameValues(datepicker, config);
    });
  });

  describe('Custom config as provider', () => {
    const config = new NgbDatepickerConfig();
    customizeConfig(config);

    beforeEach(() => {
      TestBed.configureTestingModule(
          {imports: [NgbDatepickerModule.forRoot()], providers: [{provide: NgbDatepickerConfig, useValue: config}]});
    });

    it('should initialize inputs with provided config as provider', () => {
      const fixture = createGenericTestComponent('', NgbDatepicker);

      const datepicker = fixture.componentInstance;
      expectSameValues(datepicker, config);
    });
  });
});

@Component({selector: 'test-cmp', template: ''})
class TestComponent {
  date = {year: 2016, month: 8};
  displayMonths = 1;
  navigation = 'select';
  minDate: NgbDateStruct = {year: 2010, month: 1, day: 1};
  maxDate: NgbDateStruct = {year: 2020, month: 12, day: 31};
  form = new FormGroup({control: new FormControl('', Validators.required)});
  disabledForm = new FormGroup({control: new FormControl({value: null, disabled: true})});
  model;
  showWeekdays = true;
  markDisabled = (date: NgbDateStruct) => { return NgbDate.from(date).equals(new NgbDate(2016, 8, 22)); };
  onNavigate = () => {};
}
