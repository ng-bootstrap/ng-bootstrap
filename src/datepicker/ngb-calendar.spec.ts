import {NgbCalendarGregorian} from './ngb-calendar';
import {NgbDate} from './ngb-date';

describe('ngb-calendar-gregorian', () => {

  const calendar = new NgbCalendarGregorian();

  it('should return todays date', () => {
    const jsToday = new Date();
    const today = new NgbDate(jsToday.getFullYear(), jsToday.getMonth() + 1, jsToday.getDate());

    expect(calendar.getToday()).toEqual(today);
  });

  it('should return number of days per week', () => { expect(calendar.getDaysPerWeek()).toBe(7); });

  it('should return number of weeks per month', () => { expect(calendar.getWeeksPerMonth()).toBe(6); });

  it('should return months of a year', () => {
    expect(calendar.getMonths()).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  });

  it('should return day of week', () => {
    expect(calendar.getWeekday(new NgbDate(2017, 1, 2))).toBe(1);  // Mon, 2 Jan 2017
    expect(calendar.getWeekday(new NgbDate(2017, 1, 3))).toBe(2);
    expect(calendar.getWeekday(new NgbDate(2017, 1, 4))).toBe(3);
    expect(calendar.getWeekday(new NgbDate(2017, 1, 5))).toBe(4);
    expect(calendar.getWeekday(new NgbDate(2017, 1, 6))).toBe(5);
    expect(calendar.getWeekday(new NgbDate(2017, 1, 7))).toBe(6);
    expect(calendar.getWeekday(new NgbDate(2017, 1, 8))).toBe(7);  // Sun, 8 Jan 2017
  });

  it('should add days to date', () => {
    expect(calendar.getNext(new NgbDate(2016, 12, 31))).toEqual(new NgbDate(2017, 1, 1));
    expect(calendar.getNext(new NgbDate(2016, 2, 28))).toEqual(new NgbDate(2016, 2, 29));
    expect(calendar.getNext(new NgbDate(2017, 2, 28))).toEqual(new NgbDate(2017, 3, 1));
  });

  it('should subtract days from date', () => {
    expect(calendar.getPrev(new NgbDate(2017, 1, 1))).toEqual(new NgbDate(2016, 12, 31));
    expect(calendar.getPrev(new NgbDate(2016, 2, 29))).toEqual(new NgbDate(2016, 2, 28));
    expect(calendar.getPrev(new NgbDate(2017, 3, 1))).toEqual(new NgbDate(2017, 2, 28));
  });

  it('should add months to date', () => {
    expect(calendar.getNext(new NgbDate(2016, 7, 22), 'm')).toEqual(new NgbDate(2016, 8, 1));
    expect(calendar.getNext(new NgbDate(2016, 7, 1), 'm')).toEqual(new NgbDate(2016, 8, 1));
    expect(calendar.getNext(new NgbDate(2016, 12, 22), 'm')).toEqual(new NgbDate(2017, 1, 1));
  });

  it('should subtract months from date', () => {
    expect(calendar.getPrev(new NgbDate(2016, 7, 22), 'm')).toEqual(new NgbDate(2016, 6, 1));
    expect(calendar.getPrev(new NgbDate(2016, 8, 1), 'm')).toEqual(new NgbDate(2016, 7, 1));
    expect(calendar.getPrev(new NgbDate(2017, 1, 22), 'm')).toEqual(new NgbDate(2016, 12, 1));
  });

  it('should add years to date', () => {
    expect(calendar.getNext(new NgbDate(2016, 1, 22), 'y')).toEqual(new NgbDate(2017, 1, 1));
    expect(calendar.getNext(new NgbDate(2017, 12, 22), 'y')).toEqual(new NgbDate(2018, 1, 1));
  });

  it('should subtract years from date', () => {
    expect(calendar.getPrev(new NgbDate(2016, 12, 22), 'y')).toEqual(new NgbDate(2015, 1, 1));
    expect(calendar.getPrev(new NgbDate(2017, 1, 22), 'y')).toEqual(new NgbDate(2016, 1, 1));
  });
});
