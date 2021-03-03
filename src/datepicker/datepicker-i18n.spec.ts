import {NgbDatepickerI18nDefault} from './datepicker-i18n';
import {TestBed} from '@angular/core/testing';
import {NgbDate} from './ngb-date';
import {NGB_DATEPICKER_WEEKDAY_FORMAT} from './datepicker-weekday-format';
import {TranslationWidth} from '@angular/common';

describe('ngb-datepicker-i18n-default', () => {

  let i18n: NgbDatepickerI18nDefault;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:
          [NgbDatepickerI18nDefault, {provide: NGB_DATEPICKER_WEEKDAY_FORMAT, useValue: TranslationWidth.Short}]
    });
    i18n = TestBed.inject(NgbDatepickerI18nDefault);
  });

  it('should return abbreviated month name', () => {
    expect(i18n.getMonthShortName(0)).toBe('');
    expect(i18n.getMonthShortName(1)).toBe('Jan');
    expect(i18n.getMonthShortName(12)).toBe('Dec');
    expect(i18n.getMonthShortName(13)).toBe('');
  });

  it('should return wide month name', () => {
    expect(i18n.getMonthFullName(0)).toBe('');
    expect(i18n.getMonthFullName(1)).toBe('January');
    expect(i18n.getMonthFullName(12)).toBe('December');
    expect(i18n.getMonthFullName(13)).toBe('');
  });

  it('should return weekday name', () => {
    expect(i18n.getWeekdayName(0)).toBe('');
    expect(i18n.getWeekdayName(1)).toBe('Mo');
    expect(i18n.getWeekdayName(7)).toBe('Su');
    expect(i18n.getWeekdayName(8)).toBe('');
  });

  it('should generate aria label for a date',
     () => { expect(i18n.getDayAriaLabel(new NgbDate(2010, 10, 8))).toBe('Friday, October 8, 2010'); });

  it('should generate week number numerals', () => {
    expect(i18n.getWeekNumerals(1)).toBe('1');
    expect(i18n.getWeekNumerals(55)).toBe('55');
  });

  it('should generate day numerals', () => {
    expect(i18n.getDayNumerals(new NgbDate(2010, 10, 1))).toBe('1');
    expect(i18n.getDayNumerals(new NgbDate(2010, 10, 31))).toBe('31');
  });

  it('should generate year numerals', () => {
    expect(i18n.getYearNumerals(0)).toBe('0');
    expect(i18n.getYearNumerals(2000)).toBe('2000');
  });
});
