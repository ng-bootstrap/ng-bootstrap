import {NgbCalendarGregorian, NgbPeriod} from './ngb-calendar';
import {NgbDate} from './ngb-date';

describe('ngb-calendar-gregorian', () => {

  const calendar = new NgbCalendarGregorian();

  it('should return todays date', () => {
    const jsToday = new Date();
    const today = new NgbDate(jsToday.getFullYear(), jsToday.getMonth(), jsToday.getDate());

    expect(calendar.getToday()).toEqual(today);
  });

  it('should return number of days per week', () => { expect(calendar.getDaysPerWeek()).toBe(7); });

  it('should return number of weeks per month', () => { expect(calendar.getWeeksPerMonth()).toBe(6); });

  it('should return months of a year', () => {
    expect(calendar.getMonths()).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
  });

  it('should add days to date', () => {
    expect(calendar.getNext(new NgbDate(2016, 11, 31))).toEqual(new NgbDate(2017, 0, 1));
    expect(calendar.getNext(new NgbDate(2016, 1, 28))).toEqual(new NgbDate(2016, 1, 29));
    expect(calendar.getNext(new NgbDate(2017, 1, 28))).toEqual(new NgbDate(2017, 2, 1));
  });

  it('should subtract days from date', () => {
    expect(calendar.getPrev(new NgbDate(2017, 0, 1))).toEqual(new NgbDate(2016, 11, 31));
    expect(calendar.getPrev(new NgbDate(2016, 1, 29))).toEqual(new NgbDate(2016, 1, 28));
    expect(calendar.getPrev(new NgbDate(2017, 2, 1))).toEqual(new NgbDate(2017, 1, 28));
  });

  it('should add months to date', () => {
    expect(calendar.getNext(new NgbDate(2016, 7, 22), 'm')).toEqual(new NgbDate(2016, 8, 1));
    expect(calendar.getNext(new NgbDate(2016, 7, 1), 'm')).toEqual(new NgbDate(2016, 8, 1));
    expect(calendar.getNext(new NgbDate(2016, 11, 22), 'm')).toEqual(new NgbDate(2017, 0, 1));
  });

  it('should subtract months from date', () => {
    expect(calendar.getPrev(new NgbDate(2016, 7, 22), 'm')).toEqual(new NgbDate(2016, 6, 1));
    expect(calendar.getPrev(new NgbDate(2016, 8, 1), 'm')).toEqual(new NgbDate(2016, 7, 1));
    expect(calendar.getPrev(new NgbDate(2017, 0, 22), 'm')).toEqual(new NgbDate(2016, 11, 1));
  });

  it('should add years to date', () => {
    expect(calendar.getNext(new NgbDate(2016, 1, 22), 'y')).toEqual(new NgbDate(2017, 0, 1));
    expect(calendar.getNext(new NgbDate(2017, 11, 22), 'y')).toEqual(new NgbDate(2018, 0, 1));
  });

  it('should subtract years from date', () => {
    expect(calendar.getPrev(new NgbDate(2016, 11, 22), 'y')).toEqual(new NgbDate(2015, 0, 1));
    expect(calendar.getPrev(new NgbDate(2017, 1, 22), 'y')).toEqual(new NgbDate(2016, 0, 1));
  });
});
