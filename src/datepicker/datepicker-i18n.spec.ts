import {NgbDatepickerI18nDefault} from './datepicker-i18n';

describe('ngb-datepicker-i18n-default', () => {

  const i18n = new NgbDatepickerI18nDefault();

  it('should return month name', () => {
    expect(i18n.getMonthName(0)).toBe('Jan');
    expect(i18n.getMonthName(11)).toBe('Dec');
    expect(i18n.getMonthName(12)).toBe(undefined);
  });

  it('should return weekday name', () => {
    expect(i18n.getWeekdayName(0)).toBe('Su');
    expect(i18n.getWeekdayName(6)).toBe('Sa');
    expect(i18n.getWeekdayName(7)).toBe(undefined);
  });

});
