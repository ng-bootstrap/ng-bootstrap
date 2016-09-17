import {NgbCalendarHijri} from './ngb-calendar-hijri';
import {NgbPeriod} from '../ngb-calendar';
import {NgbDateIslamicCivil} from './ngb-date-islamic-civil';

describe('ngb-calendar-hijri[civil]', () => {

  const calendar = new NgbCalendarHijri(NgbDateIslamicCivil);

  it('should return todays date', () => {
    const jsToday = new Date();
    const today = new NgbDateIslamicCivil();

    expect(calendar.getToday()).toEqual(today);
  });

  it('should return number of days per week', () => { expect(calendar.getDaysPerWeek()).toBe(7); });

  it('should return number of weeks per month', () => { expect(calendar.getWeeksPerMonth()).toBe(6); });

  it('should return months of a year', () => {
    expect(calendar.getMonths()).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
  });

  it('should add days to date', () => {
    expect(calendar.getNext(new NgbDateIslamicCivil(1431, 0, 30))).toEqual(new NgbDateIslamicCivil(1431, 1, 1));
    expect(calendar.getNext(new NgbDateIslamicCivil(1437, 1, 28))).toEqual(new NgbDateIslamicCivil(1437, 1, 29));
    expect(calendar.getNext(new NgbDateIslamicCivil(1437, 1, 29))).toEqual(new NgbDateIslamicCivil(1437, 2, 1));
  });

  it('should subtract days from date', () => {
    expect(calendar.getPrev(new NgbDateIslamicCivil(1431, 1, 1))).toEqual(new NgbDateIslamicCivil(1431, 0, 30));
    expect(calendar.getPrev(new NgbDateIslamicCivil(1431, 2, 1))).toEqual(new NgbDateIslamicCivil(1431, 1, 29));
    expect(calendar.getPrev(new NgbDateIslamicCivil(1437, 2, 5))).toEqual(new NgbDateIslamicCivil(1437, 2, 4));
  });

  it('should add months to date', () => {
    expect(calendar.getNext(new NgbDateIslamicCivil(1437, 7, 22), 'm')).toEqual(new NgbDateIslamicCivil(1437, 8, 1));
    expect(calendar.getNext(new NgbDateIslamicCivil(1437, 7, 1), 'm')).toEqual(new NgbDateIslamicCivil(1437, 8, 1));
    expect(calendar.getNext(new NgbDateIslamicCivil(1437, 11, 22), 'm')).toEqual(new NgbDateIslamicCivil(1438, 0, 1));
  });

  it('should subtract months from date', () => {
    expect(calendar.getPrev(new NgbDateIslamicCivil(1437, 7, 22), 'm')).toEqual(new NgbDateIslamicCivil(1437, 6, 1));
    expect(calendar.getPrev(new NgbDateIslamicCivil(1437, 8, 1), 'm')).toEqual(new NgbDateIslamicCivil(1437, 7, 1));
    expect(calendar.getPrev(new NgbDateIslamicCivil(1437, 0, 22), 'm')).toEqual(new NgbDateIslamicCivil(1436, 11, 1));
  });

  it('should add years to date', () => {
    expect(calendar.getNext(new NgbDateIslamicCivil(1437, 1, 22), 'y')).toEqual(new NgbDateIslamicCivil(1438, 0, 1));
    expect(calendar.getNext(new NgbDateIslamicCivil(1438, 11, 22), 'y')).toEqual(new NgbDateIslamicCivil(1439, 0, 1));
  });

  it('should subtract years from date', () => {
    expect(calendar.getPrev(new NgbDateIslamicCivil(1437, 11, 22), 'y')).toEqual(new NgbDateIslamicCivil(1436, 0, 1));
    expect(calendar.getPrev(new NgbDateIslamicCivil(1438, 1, 22), 'y')).toEqual(new NgbDateIslamicCivil(1437, 0, 1));
  });

  it('should return weekday', () => {
    expect(calendar.getWeekday(new NgbDateIslamicCivil(1437, 11, 15))).toEqual(0);
    expect(calendar.getWeekday(new NgbDateIslamicCivil(1437, 11, 16))).toEqual(1);
    expect(calendar.getWeekday(new NgbDateIslamicCivil(1437, 11, 17))).toEqual(2);
    expect(calendar.getWeekday(new NgbDateIslamicCivil(1437, 11, 18))).toEqual(3);
    expect(calendar.getWeekday(new NgbDateIslamicCivil(1437, 11, 19))).toEqual(4);
    expect(calendar.getWeekday(new NgbDateIslamicCivil(1437, 11, 20))).toEqual(5);
    expect(calendar.getWeekday(new NgbDateIslamicCivil(1437, 11, 21))).toEqual(6);
    expect(calendar.getWeekday(new NgbDateIslamicCivil(1431, 0, 11))).toEqual(1);
    expect(calendar.getWeekday(new NgbDateIslamicCivil(1431, 6, 22))).toEqual(0);
    expect(calendar.getWeekday(new NgbDateIslamicCivil(1431, 1, 3))).toEqual(2);
    expect(calendar.getWeekday(new NgbDateIslamicCivil(1431, 2, 10))).toEqual(3);
    expect(calendar.getWeekday(new NgbDateIslamicCivil(1431, 3, 23))).toEqual(4);
    expect(calendar.getWeekday(new NgbDateIslamicCivil(1202, 1, 19))).toEqual(5);
    expect(calendar.getWeekday(new NgbDateIslamicCivil(1431, 6, 21))).toEqual(6);
  });

  it('should return week number', () => {
    let week = [
      new NgbDateIslamicCivil(1437, 0, 1), new NgbDateIslamicCivil(1437, 0, 2), new NgbDateIslamicCivil(1437, 0, 3),
      new NgbDateIslamicCivil(1437, 0, 4), new NgbDateIslamicCivil(1437, 0, 5), new NgbDateIslamicCivil(1437, 0, 6),
      new NgbDateIslamicCivil(1437, 0, 7)
    ];
    expect(calendar.getWeekNumber(week, 0)).toEqual(1);
    week = [
      new NgbDateIslamicCivil(1437, 11, 15), new NgbDateIslamicCivil(1437, 11, 16),
      new NgbDateIslamicCivil(1437, 11, 17), new NgbDateIslamicCivil(1437, 11, 18),
      new NgbDateIslamicCivil(1437, 11, 19), new NgbDateIslamicCivil(1437, 11, 20),
      new NgbDateIslamicCivil(1437, 11, 21)
    ];
    expect(calendar.getWeekNumber(week, 0)).toEqual(50);
    week = [
      new NgbDateIslamicCivil(1437, 11, 22), new NgbDateIslamicCivil(1437, 11, 23),
      new NgbDateIslamicCivil(1437, 11, 24), new NgbDateIslamicCivil(1437, 11, 25),
      new NgbDateIslamicCivil(1437, 11, 26), new NgbDateIslamicCivil(1437, 11, 27),
      new NgbDateIslamicCivil(1437, 11, 28)
    ];
    expect(calendar.getWeekNumber(week, 0)).toEqual(51);
  });
});
