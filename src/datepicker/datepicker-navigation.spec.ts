import {TestBed, ComponentFixture} from '@angular/core/testing';
import {createGenericTestComponent} from '../test/common';
import {getMonthSelect, getYearSelect, getNavigationLinks} from '../test/datepicker/common';

import {Component} from '@angular/core';

import {NgbDatepickerModule} from './datepicker.module';
import {NavigationEvent} from './datepicker-view-model';
import {NgbDatepickerNavigation} from './datepicker-navigation';
import {NgbDate} from './ngb-date';
import {NgbDatepickerNavigationSelect} from './datepicker-navigation-select';

const createTestComponent = (html: string) =>
    createGenericTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;

function changeSelect(element: HTMLSelectElement, value: string) {
  element.value = value;
  const evt = document.createEvent('HTMLEvents');
  evt.initEvent('change', true, true);
  element.dispatchEvent(evt);
}

describe('ngbDatepickerNavigation', () => {

  beforeEach(() => {
    TestBed.overrideModule(
        NgbDatepickerModule, {set: {exports: [NgbDatepickerNavigation, NgbDatepickerNavigationSelect]}});
    TestBed.configureTestingModule({declarations: [TestComponent], imports: [NgbDatepickerModule]});
  });

  it('should render navigation select component for \'select\' type', () => {
    const fixture = createTestComponent(
        `<tbody ngbDatepickerNavigation type="select" [date]="date" [minDate]="minDate" [maxDate]="maxDate"></tbody>`);
    expect(getMonthSelect(fixture.nativeElement).value).toBe('8');
    expect(getYearSelect(fixture.nativeElement).value).toBe('2016');
  });

  it('should not render navigation select component for a differrent type', () => {
    const fixture = createTestComponent(`<tbody ngbDatepickerNavigation type="blah" [date]="date"></tbody>`);
    expect(fixture.nativeElement.querySelector('ngbDatepickerNavigation-select')).toBeFalsy();
  });

  it('should send date selection event', () => {
    const fixture = createTestComponent(`<tbody ngbDatepickerNavigation type="select" [date]="date" [minDate]="minDate" 
          [maxDate]="maxDate" (select)="onSelect($event)"></tbody>`);

    const monthSelect = getMonthSelect(fixture.nativeElement);
    const yearSelect = getYearSelect(fixture.nativeElement);
    spyOn(fixture.componentInstance, 'onSelect');

    changeSelect(monthSelect, '2');
    expect(fixture.componentInstance.onSelect).toHaveBeenCalledWith(new NgbDate(2016, 2, 1));

    changeSelect(yearSelect, '2020');
    expect(fixture.componentInstance.onSelect).toHaveBeenCalledWith(new NgbDate(2020, 8, 1));
  });

  it('should make navigation buttons disabled', () => {
    const fixture = createTestComponent(
        `<tbody ngbDatepickerNavigation type="select" [date]="date" [minDate]="minDate" [maxDate]="maxDate"></tbody>`);

    const links = getNavigationLinks(fixture.nativeElement);
    expect(links[0].hasAttribute('disabled')).toBeFalsy();
    expect(links[1].hasAttribute('disabled')).toBeFalsy();

    fixture.componentInstance.minDate = new NgbDate(2016, 8, 1);
    fixture.detectChanges();
    expect(links[0].hasAttribute('disabled')).toBeTruthy();
    expect(links[1].hasAttribute('disabled')).toBeFalsy();

    fixture.componentInstance.date = new NgbDate(2016, 9, 1);
    fixture.detectChanges();
    expect(links[0].hasAttribute('disabled')).toBeFalsy();
    expect(links[1].hasAttribute('disabled')).toBeFalsy();

    fixture.componentInstance.maxDate = new NgbDate(2016, 9, 20);
    fixture.detectChanges();
    expect(links[0].hasAttribute('disabled')).toBeFalsy();
    expect(links[1].hasAttribute('disabled')).toBeTruthy();
  });

  it('should send navigation events', () => {
    const fixture = createTestComponent(`<tbody ngbDatepickerNavigation [type]="type" [date]="date" [minDate]="minDate" 
          [maxDate]="maxDate" (navigate)="onNavigate($event)"></tbody>`);

    const links = getNavigationLinks(fixture.nativeElement);
    spyOn(fixture.componentInstance, 'onNavigate');

    // prev
    links[0].click();
    expect(fixture.componentInstance.onNavigate).toHaveBeenCalledWith(NavigationEvent.PREV);

    // next
    links[1].click();
    expect(fixture.componentInstance.onNavigate).toHaveBeenCalledWith(NavigationEvent.NEXT);
  });

});

@Component({selector: 'test-cmp', template: ''})
class TestComponent {
  type = 'select';
  date = new NgbDate(2016, 8, 22);
  minDate = new NgbDate(2015, 0, 1);
  maxDate = new NgbDate(2020, 11, 31);

  onNavigate = () => {};
  onSelect = () => {};
}
