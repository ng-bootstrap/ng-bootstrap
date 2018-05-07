import {NgbDatepickerI18nDefault} from './datepicker-i18n';
import {TestBed} from '@angular/core/testing';
import {LOCALE_ID} from '@angular/core';
import {DatePipe} from '@angular/common';

describe('ngb-datepicker-i18n-default', () => {

  let i18n: NgbDatepickerI18nDefault;

  beforeEach(() => {
    TestBed.configureTestingModule({providers: [DatePipe]});

    const locale: string = TestBed.get(LOCALE_ID);
    const datePipe: DatePipe = TestBed.get(DatePipe);
    i18n = new NgbDatepickerI18nDefault(locale, datePipe);
  });

  it('should return abbreviated month name', () => {
    expect(i18n.getMonthShortName(0)).toBe(undefined);
    expect(i18n.getMonthShortName(1)).toBe('Jan');
    expect(i18n.getMonthShortName(12)).toBe('Dec');
    expect(i18n.getMonthShortName(13)).toBe(undefined);
  });

  it('should return wide month name', () => {
    expect(i18n.getMonthFullName(0)).toBe(undefined);
    expect(i18n.getMonthFullName(1)).toBe('January');
    expect(i18n.getMonthFullName(12)).toBe('December');
    expect(i18n.getMonthFullName(13)).toBe(undefined);
  });

  it('should return weekday name', () => {
    expect(i18n.getWeekdayShortName(0)).toBe(undefined);
    expect(i18n.getWeekdayShortName(1)).toBe('Mo');
    expect(i18n.getWeekdayShortName(7)).toBe('Su');
    expect(i18n.getWeekdayShortName(8)).toBe(undefined);
  });

});
