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
import {Live} from '../util/accessibility/live';

const createTestComponent = (html: string) =>
    createGenericTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;

function changeSelect(element: HTMLSelectElement, value: string) {
  element.value = value;
  const evt = document.createEvent('HTMLEvents');
  evt.initEvent('change', true, true);
  element.dispatchEvent(evt);
}

describe('ngb-datepicker-navigation', () => {

  const mockLive = {say: (s: string) => {}};

  beforeEach(() => {
    TestBed.overrideModule(
        NgbDatepickerModule, {set: {exports: [NgbDatepickerNavigation, NgbDatepickerNavigationSelect]}});
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [NgbDatepickerModule],
      providers: [{provide: Live, useValue: mockLive}]
    });
  });

  it('should toggle navigation select component', () => {
    const fixture = createTestComponent(`<ngb-datepicker-navigation [showSelect]="showSelect" [date]="date"
          [selectBoxes]="selectBoxes"></ngb-datepicker-navigation>`);

    expect(fixture.debugElement.query(By.directive(NgbDatepickerNavigationSelect))).not.toBeNull();
    expect(getMonthSelect(fixture.nativeElement).value).toBe('8');
    expect(getYearSelect(fixture.nativeElement).value).toBe('2016');

    fixture.componentInstance.showSelect = false;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.directive(NgbDatepickerNavigationSelect))).toBeNull();
  });

  it('should send date selection event', () => {
    const fixture = createTestComponent(`<ngb-datepicker-navigation [showSelect]="true" [date]="date"
          [selectBoxes]="selectBoxes" (select)="onSelect($event)"></ngb-datepicker-navigation>`);

    const monthSelect = getMonthSelect(fixture.nativeElement);
    const yearSelect = getYearSelect(fixture.nativeElement);
    spyOn(fixture.componentInstance, 'onSelect');

    changeSelect(monthSelect, '2');
    expect(fixture.componentInstance.onSelect).toHaveBeenCalledWith(new NgbDate(2016, 2, 1));

    changeSelect(yearSelect, '2020');
    expect(fixture.componentInstance.onSelect).toHaveBeenCalledWith(new NgbDate(2020, 8, 1));
  });

  it('should make prev navigation button disabled', () => {
    const fixture =
        createTestComponent(`<ngb-datepicker-navigation [prevDisabled]="prevDisabled"></ngb-datepicker-navigation>`);

    const links = getNavigationLinks(fixture.nativeElement);
    expect(links[0].hasAttribute('disabled')).toBeFalsy();

    fixture.componentInstance.prevDisabled = true;
    fixture.detectChanges();
    expect(links[0].hasAttribute('disabled')).toBeTruthy();
  });

  it('should make next navigation button disabled', () => {
    const fixture =
        createTestComponent(`<ngb-datepicker-navigation [nextDisabled]="nextDisabled"></ngb-datepicker-navigation>`);

    const links = getNavigationLinks(fixture.nativeElement);
    expect(links[1].hasAttribute('disabled')).toBeFalsy();

    fixture.componentInstance.nextDisabled = true;
    fixture.detectChanges();
    expect(links[1].hasAttribute('disabled')).toBeTruthy();
  });

  it('should make year and month select boxes disabled', () => {
    const fixture = createTestComponent(`<ngb-datepicker-navigation [disabled]="true"
      [showSelect]="true" [selectBoxes]="selectBoxes"></ngb-datepicker-navigation>`);

    expect(getYearSelect(fixture.nativeElement).disabled).toBeTruthy();
    expect(getMonthSelect(fixture.nativeElement).disabled).toBeTruthy();
  });

  it('should send navigation events', () => {
    const fixture =
        createTestComponent(`<ngb-datepicker-navigation (navigate)="onNavigate($event)"></ngb-datepicker-navigation>`);
    const[previousButton, nextButton] = getNavigationLinks(fixture.nativeElement);
    const previousButtonSpan = previousButton.querySelector<HTMLElement>('span') !;
    const nextButtonSpan = nextButton.querySelector<HTMLElement>('span') !;
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
    const fixture = createTestComponent(`<ngb-datepicker-navigation></ngb-datepicker-navigation>`);
    const[previousButton, nextButton] = getNavigationLinks(fixture.nativeElement);

    // prev
    previousButton.click();
    expect(document.activeElement).toBe(previousButton);

    // next
    nextButton.click();
    expect(document.activeElement).toBe(nextButton);
  });

  it('should have buttons of type button', () => {
    const fixture = createTestComponent(`<ngb-datepicker-navigation></ngb-datepicker-navigation>`);

    const links = getNavigationLinks(fixture.nativeElement);
    links.forEach((link) => { expect(link.getAttribute('type')).toBe('button'); });
  });

  it('should have correct titles and aria attributes on buttons', () => {
    const fixture = createTestComponent(`<ngb-datepicker-navigation></ngb-datepicker-navigation>`);

    const links = getNavigationLinks(fixture.nativeElement);
    expect(links[0].getAttribute('aria-label')).toBe('Previous month');
    expect(links[1].getAttribute('aria-label')).toBe('Next month');
    expect(links[0].getAttribute('title')).toBe('Previous month');
    expect(links[1].getAttribute('title')).toBe('Next month');
  });

  it('when displaying one month should have correct screen reader text ', () => {
    const fixture = createTestComponent(`
      <ngb-datepicker-navigation [months]="monthsOne"></ngb-datepicker-navigation>`);
    spyOn(mockLive, 'say');
    const[previousButton, nextButton] = getNavigationLinks(fixture.nativeElement);
    previousButton.click();
    nextButton.click();
    expect(mockLive.say).toHaveBeenCalledWith('August 2016');
  });

  it('when displaying month range should have correct screen reader text ', () => {
    const fixture = createTestComponent(`
      <ngb-datepicker-navigation [months]="monthsRange"></ngb-datepicker-navigation>`);
    const[previousButton, nextButton] = getNavigationLinks(fixture.nativeElement);
    spyOn(mockLive, 'say');
    previousButton.click();
    nextButton.click();
    expect(mockLive.say).toHaveBeenCalledWith('August 2016 September 2016');
  });
});

@Component({selector: 'test-cmp', template: ''})
class TestComponent {
  date = new NgbDate(2016, 8, 1);
  prevDisabled = false;
  nextDisabled = false;
  showSelect = true;
  selectBoxes = {months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], years: [2015, 2016, 2017, 2018, 2019, 2020]};
  monthsOne = [{firstDate: new NgbDate(2016, 8, 1), lastDate: new NgbDate(2016, 8, 31)}];
  monthsRange = [
    {firstDate: new NgbDate(2016, 8, 1), lastDate: new NgbDate(2016, 8, 31)},
    {firstDate: new NgbDate(2016, 9, 1), lastDate: new NgbDate(2016, 9, 30)}
  ];

  onNavigate = () => {};
  onSelect = () => {};
}
