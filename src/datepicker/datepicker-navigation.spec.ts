import {TestBed, ComponentFixture} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
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

describe('ngb-datepicker-navigation', () => {

  beforeEach(() => {
    TestBed.overrideModule(
        NgbDatepickerModule, {set: {exports: [NgbDatepickerNavigation, NgbDatepickerNavigationSelect]}});
    TestBed.configureTestingModule({declarations: [TestComponent], imports: [NgbDatepickerModule.forRoot()]});
  });

  it('should toggle navigation select component', () => {
    const fixture =
        createTestComponent(`<ngb-datepicker-navigation [showSelect]="showSelect" [date]="date" [firstDate]="firstDate" 
          [minDate]="minDate" [maxDate]="maxDate"></ngb-datepicker-navigation>`);

    expect(fixture.debugElement.query(By.directive(NgbDatepickerNavigationSelect))).not.toBeNull();
    expect(getMonthSelect(fixture.nativeElement).value).toBe('8');
    expect(getYearSelect(fixture.nativeElement).value).toBe('2016');

    fixture.componentInstance.showSelect = false;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.directive(NgbDatepickerNavigationSelect))).toBeNull();
  });

  it('should send date selection event', () => {
    const fixture =
        createTestComponent(`<ngb-datepicker-navigation [showSelect]="true" [date]="date" [firstDate]="firstDate" 
          [minDate]="minDate" [maxDate]="maxDate" (select)="onSelect($event)"></ngb-datepicker-navigation>`);

    const monthSelect = getMonthSelect(fixture.nativeElement);
    const yearSelect = getYearSelect(fixture.nativeElement);
    spyOn(fixture.componentInstance, 'onSelect');

    changeSelect(monthSelect, '2');
    expect(fixture.componentInstance.onSelect).toHaveBeenCalledWith(new NgbDate(2016, 2, 1));

    changeSelect(yearSelect, '2020');
    expect(fixture.componentInstance.onSelect).toHaveBeenCalledWith(new NgbDate(2020, 8, 1));
  });

  it('should make navigation buttons disabled', () => {
    const fixture =
        createTestComponent(`<ngb-datepicker-navigation [showSelect]="true" [date]="date" [firstDate]="firstDate" 
          [minDate]="minDate" [maxDate]="maxDate"></ngb-datepicker-navigation>`);

    const links = getNavigationLinks(fixture.nativeElement);
    expect(links[0].hasAttribute('disabled')).toBeFalsy();
    expect(links[1].hasAttribute('disabled')).toBeFalsy();

    fixture.componentInstance.minDate = new NgbDate(2016, 8, 1);
    fixture.detectChanges();
    expect(links[0].hasAttribute('disabled')).toBeTruthy();
    expect(links[1].hasAttribute('disabled')).toBeFalsy();

    fixture.componentInstance.firstDate = new NgbDate(2016, 9, 1);
    fixture.componentInstance.date = new NgbDate(2016, 9, 1);
    fixture.detectChanges();
    expect(links[0].hasAttribute('disabled')).toBeFalsy();
    expect(links[1].hasAttribute('disabled')).toBeFalsy();

    fixture.componentInstance.maxDate = new NgbDate(2016, 9, 20);
    fixture.detectChanges();
    expect(links[0].hasAttribute('disabled')).toBeFalsy();
    expect(links[1].hasAttribute('disabled')).toBeTruthy();
  });

  it('should have disabled navigation buttons and year and month select boxes when disabled', () => {
    const fixture = createTestComponent(`<ngb-datepicker-navigation [disabled]="true" [showSelect]="true" [date]="date" 
          [firstDate]="firstDate" [minDate]="minDate" [maxDate]="maxDate"></ngb-datepicker-navigation>`);

    const links = getNavigationLinks(fixture.nativeElement);
    expect(links[0].hasAttribute('disabled')).toBeTruthy();
    expect(links[1].hasAttribute('disabled')).toBeTruthy();
    expect(getYearSelect(fixture.nativeElement).disabled).toBeTruthy();
    expect(getMonthSelect(fixture.nativeElement).disabled).toBeTruthy();
  });

  it('should send navigation events', () => {
    const fixture =
        createTestComponent(`<ngb-datepicker-navigation [date]="date" [firstDate]="firstDate" [minDate]="minDate" 
          [maxDate]="maxDate" (navigate)="onNavigate($event)"></ngb-datepicker-navigation>`);

    const links = getNavigationLinks(fixture.nativeElement);
    spyOn(fixture.componentInstance, 'onNavigate');

    // prev
    links[0].click();
    expect(fixture.componentInstance.onNavigate).toHaveBeenCalledWith(NavigationEvent.PREV);

    // next
    links[1].click();
    expect(fixture.componentInstance.onNavigate).toHaveBeenCalledWith(NavigationEvent.NEXT);
  });

  it('should have buttons of type button', () => {
    const fixture =
        createTestComponent(`<ngb-datepicker-navigation [date]="date" [firstDate]="firstDate" [minDate]="minDate" 
        [maxDate]="maxDate"></ngb-datepicker-navigation>`);

    const links = getNavigationLinks(fixture.nativeElement);
    links.forEach((link) => { expect(link.getAttribute('type')).toBe('button'); });
  });

});

@Component({selector: 'test-cmp', template: ''})
class TestComponent {
  firstDate = new NgbDate(2016, 8, 1);
  date = new NgbDate(2016, 8, 22);
  minDate = new NgbDate(2015, 0, 1);
  maxDate = new NgbDate(2020, 11, 31);
  showSelect = true;

  onNavigate = () => {};
  onSelect = () => {};
}
