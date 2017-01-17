import {NgbDatepickerI18nDefault} from './datepicker-i18n';

describe('ngb-datepicker-i18n-default', () => {

  const i18n = new NgbDatepickerI18nDefault();

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
