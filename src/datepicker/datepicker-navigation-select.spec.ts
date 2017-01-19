import {TestBed, ComponentFixture} from '@angular/core/testing';
import {createGenericTestComponent} from '../test/common';
import {getMonthSelect, getYearSelect} from '../test/datepicker/common';

import {Component} from '@angular/core';

import {NgbDatepickerModule} from './datepicker.module';
import {NgbDatepickerNavigationSelect} from './datepicker-navigation-select';
import {NgbDate} from './ngb-date';

const createTestComponent = (html: string) =>
    createGenericTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;

function getOptionValues(element: HTMLSelectElement): string[] {
  return Array.from(element.options).map(x => (x as HTMLOptionElement).value);
}

function changeSelect(element: HTMLSelectElement, value: string) {
  element.value = value;
  const evt = document.createEvent('HTMLEvents');
  evt.initEvent('change', true, true);
  element.dispatchEvent(evt);
}

describe('ngb-datepicker-navigation-select', () => {

  beforeEach(() => {
    TestBed.overrideModule(NgbDatepickerModule, {set: {exports: [NgbDatepickerNavigationSelect]}});
    TestBed.configureTestingModule({declarations: [TestComponent], imports: [NgbDatepickerModule.forRoot()]});
  });

  it('should generate month options correctly', () => {
    const fixture =
        createTestComponent(`<ngb-datepicker-navigation-select [date]="date" [minDate]="minDate" [maxDate]="maxDate">`);

    expect(getOptionValues(getMonthSelect(fixture.nativeElement))).toEqual([
      '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'
    ]);

    fixture.componentInstance.minDate = new NgbDate(2016, 7, 1);
    fixture.detectChanges();
    expect(getOptionValues(getMonthSelect(fixture.nativeElement))).toEqual(['7', '8', '9', '10', '11', '12']);

    fixture.componentInstance.maxDate = new NgbDate(2016, 9, 1);
    fixture.detectChanges();
    expect(getOptionValues(getMonthSelect(fixture.nativeElement))).toEqual(['7', '8', '9']);

    fixture.componentInstance.minDate = new NgbDate(2015, 1, 1);
    fixture.detectChanges();
    expect(getOptionValues(getMonthSelect(fixture.nativeElement))).toEqual([
      '1', '2', '3', '4', '5', '6', '7', '8', '9'
    ]);
  });

  it('should update months when current date changes', () => {
    const fixture =
        createTestComponent(`<ngb-datepicker-navigation-select [date]="date" [minDate]="minDate" [maxDate]="maxDate">`);

    fixture.componentInstance.minDate = new NgbDate(2015, 7, 1);
    fixture.componentInstance.maxDate = new NgbDate(2017, 7, 1);
    fixture.detectChanges();
    expect(getOptionValues(getMonthSelect(fixture.nativeElement))).toEqual([
      '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'
    ]);

    fixture.componentInstance.date = new NgbDate(2015, 9, 1);
    fixture.detectChanges();
    expect(getOptionValues(getMonthSelect(fixture.nativeElement))).toEqual(['7', '8', '9', '10', '11', '12']);

    fixture.componentInstance.date = new NgbDate(2017, 5, 1);
    fixture.detectChanges();
    expect(getOptionValues(getMonthSelect(fixture.nativeElement))).toEqual(['1', '2', '3', '4', '5', '6', '7']);
  });

  it('should update months when current date changes between valid dates and null / undefined', () => {
    const fixture =
        createTestComponent(`<ngb-datepicker-navigation-select [date]="date" [minDate]="minDate" [maxDate]="maxDate">`);

    fixture.componentInstance.date = new NgbDate(2016, 1, 1);
    fixture.componentInstance.minDate = new NgbDate(2015, 7, 1);
    fixture.componentInstance.maxDate = new NgbDate(2016, 7, 1);
    fixture.detectChanges();
    expect(getOptionValues(getMonthSelect(fixture.nativeElement))).toEqual(['1', '2', '3', '4', '5', '6', '7']);

    fixture.componentInstance.date = null;
    fixture.detectChanges();
    expect(getOptionValues(getMonthSelect(fixture.nativeElement))).toEqual([
      '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'
    ]);

    fixture.componentInstance.date = new NgbDate(2016, 5, 1);
    fixture.detectChanges();
    expect(getOptionValues(getMonthSelect(fixture.nativeElement))).toEqual(['1', '2', '3', '4', '5', '6', '7']);
  });

  it('should generate year options correctly', () => {
    const fixture =
        createTestComponent(`<ngb-datepicker-navigation-select [date]="date" [minDate]="minDate" [maxDate]="maxDate">`);

    const yearSelect = getYearSelect(fixture.nativeElement);
    expect(getOptionValues(yearSelect)).toEqual(['2015', '2016', '2017', '2018', '2019', '2020']);

    fixture.componentInstance.maxDate = new NgbDate(2017, 1, 1);
    fixture.detectChanges();
    expect(getOptionValues(yearSelect)).toEqual(['2015', '2016', '2017']);

    fixture.componentInstance.minDate = new NgbDate(2014, 1, 1);
    fixture.detectChanges();
    expect(getOptionValues(yearSelect)).toEqual(['2014', '2015', '2016', '2017']);

    fixture.componentInstance.minDate = new NgbDate(2017, 1, 1);
    fixture.detectChanges();
    expect(getOptionValues(yearSelect)).toEqual(['2017']);
  });

  it('should send date selection events', () => {
    const fixture = createTestComponent(
        `<ngb-datepicker-navigation-select [date]="date" [minDate]="minDate" [maxDate]="maxDate" (select)="onSelect($event)">`);

    const monthSelect = getMonthSelect(fixture.nativeElement);
    const yearSelect = getYearSelect(fixture.nativeElement);
    spyOn(fixture.componentInstance, 'onSelect');

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

  it('should select months and years when date changes', () => {
    const fixture =
        createTestComponent(`<ngb-datepicker-navigation-select [date]="date" [minDate]="minDate" [maxDate]="maxDate">`);

    expect(getMonthSelect(fixture.nativeElement).value).toBe('8');
    expect(getYearSelect(fixture.nativeElement).value).toBe('2016');

    fixture.componentInstance.date = new NgbDate(2017, 9, 22);
    fixture.detectChanges();
    expect(getMonthSelect(fixture.nativeElement).value).toBe('9');
    expect(getYearSelect(fixture.nativeElement).value).toBe('2017');

    // out of range
    fixture.componentInstance.date = new NgbDate(2222, 22, 22);
    fixture.detectChanges();
    expect(getMonthSelect(fixture.nativeElement).value).toBe('');
    expect(getYearSelect(fixture.nativeElement).value).toBe('');
  });

  it('should have disabled select boxes when disabled', () => {
    const fixture = createTestComponent(
        `<ngb-datepicker-navigation-select [disabled]="true" [date]="date" [minDate]="minDate" [maxDate]="maxDate">`);

    expect(getMonthSelect(fixture.nativeElement).disabled).toBe(true);
    expect(getYearSelect(fixture.nativeElement).disabled).toBe(true);
  });

});

@Component({selector: 'test-cmp', template: ''})
class TestComponent {
  date = new NgbDate(2016, 8, 22);
  minDate = new NgbDate(2015, 1, 1);
  maxDate = new NgbDate(2020, 1, 1);

  onSelect = () => {};
}
