import {NgbCalendarHebrew} from './ngb-calendar-hebrew';
import {NgbDate} from '../ngb-date';

describe('ngb-calendar-hebrew', () => {
  const DATE_TABLE = [
    [5760, 3, 16, 1999, 11, 25], [5760, 7, 27, 2000, 4, 3],   [5760, 12, 14, 2000, 8, 15], [5761, 1, 30, 2000, 10, 29],
    [5761, 8, 1, 2001, 4, 24],   [5761, 10, 17, 2001, 7, 8],  [5762, 2, 29, 2001, 11, 15], [5762, 7, 2, 2002, 3, 15],
    [5762, 9, 10, 2002, 5, 21],  [5763, 5, 22, 2003, 1, 25],  [5763, 7, 28, 2003, 4, 1],   [5763, 13, 29, 2003, 9, 26],
    [5764, 11, 14, 2004, 8, 1],  [5764, 5, 13, 2004, 2, 5],   [5764, 1, 1, 2003, 9, 27],   [5765, 6, 3, 2005, 2, 12],
    [5765, 3, 19, 2004, 12, 2],  [5765, 12, 9, 2005, 8, 14],  [5766, 4, 11, 2006, 1, 11],  [5766, 5, 2, 2006, 1, 31],
    [5766, 10, 22, 2006, 7, 18], [5767, 6, 27, 2007, 3, 17],  [5767, 8, 4, 2007, 4, 22],   [5767, 2, 30, 2006, 11, 21],
    [5768, 13, 28, 2008, 9, 28], [5768, 6, 23, 2008, 2, 29],  [5768, 3, 17, 2007, 11, 27], [5769, 2, 27, 2008, 11, 25],
    [5769, 10, 5, 2009, 6, 27],  [5769, 9, 9, 2009, 6, 1],    [5770, 1, 18, 2009, 10, 6],  [5770, 12, 2, 2010, 8, 12],
    [5770, 7, 30, 2010, 4, 14],  [5771, 7, 15, 2011, 3, 21],  [5771, 6, 2, 2011, 2, 6],    [5771, 12, 1, 2011, 8, 1],
    [5772, 3, 30, 2011, 12, 26], [5772, 9, 26, 2012, 6, 16],  [5772, 12, 29, 2012, 9, 16], [5773, 11, 1, 2013, 7, 8],
    [5773, 4, 20, 2013, 1, 2],   [5773, 2, 11, 2012, 10, 27], [5774, 1, 21, 2013, 9, 25],  [5774, 11, 2, 2014, 6, 30],
    [5774, 6, 30, 2014, 3, 2],   [5775, 10, 27, 2015, 7, 14], [5775, 4, 2, 2014, 12, 24],  [5775, 5, 23, 2015, 2, 12],
    [5776, 12, 20, 2016, 8, 24], [5776, 10, 10, 2016, 6, 16], [5776, 5, 4, 2016, 1, 14],   [5777, 3, 17, 2016, 12, 17],
    [5777, 8, 29, 2017, 5, 25],  [5777, 10, 7, 2017, 7, 1],   [5778, 12, 11, 2018, 8, 22], [5778, 10, 19, 2018, 7, 2],
    [5778, 6, 25, 2018, 3, 12],  [5779, 2, 3, 2018, 10, 12],  [5779, 13, 15, 2019, 9, 15], [5779, 8, 30, 2019, 5, 5],
    [5780, 5, 14, 2020, 2, 9],   [5780, 11, 12, 2020, 8, 2],  [5780, 3, 30, 2019, 12, 28], [5781, 4, 20, 2021, 1, 4],
    [5781, 9, 19, 2021, 5, 30],  [5781, 10, 29, 2021, 7, 9],  [5782, 12, 24, 2022, 8, 21], [5782, 1, 2, 2021, 9, 8],
    [5782, 7, 26, 2022, 3, 29],  [5783, 2, 16, 2022, 11, 10], [5783, 10, 19, 2023, 7, 8],  [5783, 5, 5, 2023, 1, 27],
    [5784, 7, 1, 2024, 3, 11],   [5784, 13, 29, 2024, 10, 2], [5784, 3, 14, 2023, 11, 27], [5785, 3, 30, 2024, 12, 31],
    [5785, 7, 4, 2025, 4, 2],    [5785, 11, 11, 2025, 8, 5],  [5786, 10, 1, 2026, 6, 16],  [5786, 5, 28, 2026, 2, 15],
    [5786, 2, 17, 2025, 11, 8],  [5787, 10, 18, 2027, 6, 23], [5787, 6, 29, 2027, 3, 8],   [5787, 5, 3, 2027, 1, 11],
    [5788, 1, 30, 2027, 10, 31], [5788, 7, 15, 2028, 4, 11],  [5788, 9, 2, 2028, 5, 27],   [5789, 12, 16, 2029, 8, 27],
    [5789, 2, 3, 2028, 10, 23],  [5789, 8, 17, 2029, 5, 2],   [5790, 3, 6, 2029, 11, 13],  [5790, 10, 27, 2030, 6, 28],
    [5790, 12, 15, 2030, 8, 14]
  ];

  const calendar = new NgbCalendarHebrew();
  describe('toGregorian', () => {
    DATE_TABLE.forEach(element => {
      let hDate = new NgbDate(element[0], element[1], element[2]);
      let gDate = calendar.toGregorian(hDate);
      it('should convert correctly from Hebrew to Gregorian', () => {
        expect(
            new NgbDate(gDate.getFullYear(), gDate.getMonth() + 1, gDate.getDate())
                .equals(new NgbDate(element[3], element[4], element[5])))
            .toBeTruthy();
      });
    });
  });

  describe('fromGregorian', () => {
    DATE_TABLE.forEach(element => {
      const gDate = new Date(element[3], element[4] - 1, element[5]);
      let hDate = calendar.fromGregorian(gDate);
      it('should convert correctly from Gregorian to Hebrew',
         () => { expect(new NgbDate(element[0], element[1], element[2]).equals(hDate)).toBeTruthy(); });
    });
  });

  it('should return number of days per week', () => { expect(calendar.getDaysPerWeek()).toBe(7); });

  it('should return number of weeks per month', () => { expect(calendar.getWeeksPerMonth()).toBe(6); });

  it('should return months of a year', () => {
    expect(calendar.getMonths(5770)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    expect(calendar.getMonths(5771)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
    expect(calendar.getMonths(5772)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    expect(calendar.getMonths(5773)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    expect(calendar.getMonths(5774)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
    expect(calendar.getMonths(5775)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    expect(calendar.getMonths(5776)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
    expect(calendar.getMonths(5777)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    expect(calendar.getMonths(5778)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    expect(calendar.getMonths(5779)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
    expect(calendar.getMonths(5780)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  });

  it('should return day of week', () => {
    expect(calendar.getWeekday(new NgbDate(5777, 10, 8))).toEqual(7);
    expect(calendar.getWeekday(new NgbDate(5771, 4, 6))).toEqual(1);
    expect(calendar.getWeekday(new NgbDate(5779, 1, 30))).toEqual(2);
    expect(calendar.getWeekday(new NgbDate(5774, 7, 17))).toEqual(3);
    expect(calendar.getWeekday(new NgbDate(5778, 12, 5))).toEqual(4);
    expect(calendar.getWeekday(new NgbDate(5775, 3, 27))).toEqual(5);
    expect(calendar.getWeekday(new NgbDate(5774, 13, 18))).toEqual(6);
  });

  it('should add days to date', () => {
    expect(calendar.getNext(new NgbDate(5776, 2, 29))).toEqual(new NgbDate(5776, 2, 30));
    expect(calendar.getNext(new NgbDate(5777, 3, 29))).toEqual(new NgbDate(5777, 4, 1));
    expect(calendar.getNext(new NgbDate(5779, 12, 30))).toEqual(new NgbDate(5779, 13, 1));
  });

  it('should subtract days from date', () => {
    expect(calendar.getPrev(new NgbDate(5766, 1, 1))).toEqual(new NgbDate(5765, 13, 29));
    expect(calendar.getPrev(new NgbDate(5781, 4, 1))).toEqual(new NgbDate(5781, 3, 29));
    expect(calendar.getPrev(new NgbDate(5780, 3, 1))).toEqual(new NgbDate(5780, 2, 30));
  });

  it('should add months to date', () => {
    expect(calendar.getNext(new NgbDate(5778, 12, 18), 'm')).toEqual(new NgbDate(5779, 1, 1));
    expect(calendar.getNext(new NgbDate(5771, 12, 2), 'm')).toEqual(new NgbDate(5771, 13, 1));
    expect(calendar.getNext(new NgbDate(5765, 5, 26), 'm')).toEqual(new NgbDate(5765, 6, 1));
  });

  it('should subtract months from date', () => {
    expect(calendar.getPrev(new NgbDate(5779, 1, 14), 'm')).toEqual(new NgbDate(5778, 12, 1));
    expect(calendar.getPrev(new NgbDate(5772, 1, 25), 'm')).toEqual(new NgbDate(5771, 13, 1));
    expect(calendar.getPrev(new NgbDate(5765, 6, 8), 'm')).toEqual(new NgbDate(5765, 5, 1));
  });

  it('should add years to date', () => {
    expect(calendar.getNext(new NgbDate(5770, 12, 24), 'y')).toEqual(new NgbDate(5771, 1, 1));
    expect(calendar.getNext(new NgbDate(5771, 4, 11), 'y')).toEqual(new NgbDate(5772, 1, 1));
  });

  it('should subtract years from date', () => {
    expect(calendar.getPrev(new NgbDate(5777, 12, 1), 'y')).toEqual(new NgbDate(5776, 1, 1));
    expect(calendar.getPrev(new NgbDate(5779, 2, 18), 'y')).toEqual(new NgbDate(5778, 1, 1));
  });

  it('should return week number', () => {
    let week = [
      new NgbDate(5776, 13, 29), new NgbDate(5777, 1, 1), new NgbDate(5777, 1, 2), new NgbDate(5777, 1, 3),
      new NgbDate(5777, 1, 4), new NgbDate(5777, 1, 5), new NgbDate(5777, 1, 6)
    ];
    expect(calendar.getWeekNumber(week, 7)).toEqual(1);
    week = [
      new NgbDate(5777, 7, 13), new NgbDate(5777, 7, 14), new NgbDate(5777, 7, 15), new NgbDate(5777, 7, 16),
      new NgbDate(5777, 7, 17), new NgbDate(5777, 7, 18), new NgbDate(5777, 7, 19)
    ];
    expect(calendar.getWeekNumber(week, 7)).toEqual(28);
    week = [
      new NgbDate(5777, 12, 26), new NgbDate(5777, 12, 27), new NgbDate(5777, 12, 28), new NgbDate(5777, 12, 29),
      new NgbDate(5778, 1, 1), new NgbDate(5778, 1, 2), new NgbDate(5778, 1, 3)
    ];
    expect(calendar.getWeekNumber(week, 7)).toEqual(1);
  });

  it('should return Hebrew numerals', () => {
    expect(calendar.displayNumerals(3)).toEqual('\u05d2\u05f3');
    expect(calendar.displayNumerals(15)).toEqual('\u05d8\u05f4\u05d5');
    expect(calendar.displayNumerals(5777)).toEqual('\u05ea\u05e9\u05e2\u05f4\u05d6');
  });

  it('should return europian digits', () => {
    calendar.setDirection('ltr');
    expect(calendar.displayNumerals(3)).toEqual(3);
    expect(calendar.displayNumerals(15)).toEqual(15);
    expect(calendar.displayNumerals(5777)).toEqual(5777);
  });

});
