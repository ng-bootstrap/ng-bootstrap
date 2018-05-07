import {
  buildMonth,
  buildMonths,
  checkDateInRange,
  dateComparator,
  generateSelectBoxMonths,
  getFirstViewDate,
  isDateSelectable,
  generateSelectBoxYears
} from './datepicker-tools';
import {NgbDate} from './ngb-date';
import {NgbCalendar, NgbCalendarGregorian} from './ngb-calendar';
import {TestBed} from '@angular/core/testing';
import {DatepickerViewModel, NgbMarkDisabled} from './datepicker-view-model';
import {NgbDatepickerI18n, NgbDatepickerI18nDefault} from './datepicker-i18n';
import {DatePipe} from '@angular/common';

describe(`datepicker-tools`, () => {

  describe(`dateComparator()`, () => {

    it(`should compare valid dates`, () => {
      expect(dateComparator(new NgbDate(2017, 5, 2), new NgbDate(2017, 5, 2))).toBe(true);

      expect(dateComparator(new NgbDate(2017, 5, 2), new NgbDate(2017, 5, 1))).toBe(false);
      expect(dateComparator(new NgbDate(2017, 5, 2), new NgbDate(2017, 1, 2))).toBe(false);
      expect(dateComparator(new NgbDate(2017, 5, 2), new NgbDate(2001, 5, 2))).toBe(false);
    });

    it(`should compare invalid dates`, () => {
      expect(dateComparator(undefined, undefined)).toBe(true);
      expect(dateComparator(null, null)).toBe(true);

      expect(dateComparator(new NgbDate(2017, 5, 2), null)).toBe(false);
      expect(dateComparator(new NgbDate(2017, 5, 2), undefined)).toBe(false);
      expect(dateComparator(null, new NgbDate(2017, 5, 2))).toBe(false);
      expect(dateComparator(undefined, new NgbDate(2017, 5, 2))).toBe(false);
    });
  });

  describe(`checkDateInRange()`, () => {

    it(`should throw adjust date to be in between of min and max dates`, () => {
      const minDate = new NgbDate(2015, 5, 1);
      const maxDate = new NgbDate(2015, 5, 10);

      expect(checkDateInRange(new NgbDate(2015, 5, 5), minDate, maxDate)).toEqual(new NgbDate(2015, 5, 5));
      expect(checkDateInRange(new NgbDate(2015, 4, 5), minDate, maxDate)).toEqual(minDate);
      expect(checkDateInRange(new NgbDate(2015, 6, 5), minDate, maxDate)).toEqual(maxDate);
    });

    it(`should allow for undefined max and min dates`, () => {
      const minDate = new NgbDate(2015, 5, 1);
      const maxDate = new NgbDate(2015, 5, 10);

      expect(checkDateInRange(new NgbDate(2015, 5, 5), undefined, undefined)).toEqual(new NgbDate(2015, 5, 5));
      expect(checkDateInRange(new NgbDate(2015, 5, 5), minDate, undefined)).toEqual(new NgbDate(2015, 5, 5));
      expect(checkDateInRange(new NgbDate(2015, 5, 5), undefined, maxDate)).toEqual(new NgbDate(2015, 5, 5));

      expect(checkDateInRange(new NgbDate(2015, 4, 5), minDate, undefined)).toEqual(minDate);
      expect(checkDateInRange(new NgbDate(2015, 6, 5), undefined, maxDate)).toEqual(maxDate);
    });

    it(`should bypass invalid date values`, () => {
      expect(checkDateInRange(undefined, undefined, undefined)).toBeUndefined();
      expect(checkDateInRange(null, undefined, undefined)).toBeNull();
      expect(checkDateInRange(new NgbDate(-2, 0, 0), undefined, undefined)).toEqual(new NgbDate(-2, 0, 0));
    });

    it(`should not alter date object`, () => {
      const date = new NgbDate(2017, 5, 1);
      expect(checkDateInRange(date, undefined, undefined)).toBe(date);
    });
  });

  describe(`buildMonth()`, () => {

    let calendar: NgbCalendar;
    let i18n: NgbDatepickerI18n;

    beforeAll(() => {
      TestBed.configureTestingModule({
        providers: [
          {provide: NgbCalendar, useClass: NgbCalendarGregorian},
          {provide: NgbDatepickerI18n, useClass: NgbDatepickerI18nDefault}, DatePipe
        ]
      });
      calendar = TestBed.get(NgbCalendar);
      i18n = TestBed.get(NgbDatepickerI18n);
    });

    // TODO: this should be automated somehow, ex. generate next 10 years or something
    const months = [
      {
        // MAY 2017
        date: new NgbDate(2017, 5, 5),
        lastDay: 31,
        firstWeek: {number: 18, date: new NgbDate(2017, 5, 1)},
        lastWeek: {number: 23, date: new NgbDate(2017, 6, 11)}
      },
      {
        // JUN 2017
        date: new NgbDate(2017, 6, 5),
        lastDay: 30,
        firstWeek: {number: 22, date: new NgbDate(2017, 5, 29)},
        lastWeek: {number: 27, date: new NgbDate(2017, 7, 9)}
      },
      {
        // FEB 2017
        date: new NgbDate(2017, 2, 1),
        lastDay: 28,
        firstWeek: {number: 5, date: new NgbDate(2017, 1, 30)},
        lastWeek: {number: 10, date: new NgbDate(2017, 3, 12)}
      },
      {
        // FEB 2016
        date: new NgbDate(2016, 2, 10),
        lastDay: 29,
        firstWeek: {number: 5, date: new NgbDate(2016, 2, 1)},
        lastWeek: {number: 10, date: new NgbDate(2016, 3, 13)}
      }
    ];

    months.forEach(refMonth => {
      it(`should build month (${refMonth.date.year} - ${refMonth.date.month}) correctly`, () => {

        let month = buildMonth(calendar, refMonth.date, { firstDayOfWeek: 1 } as DatepickerViewModel, i18n);

        expect(month).toBeTruthy();
        expect(month.year).toEqual(refMonth.date.year);
        expect(month.number).toEqual(refMonth.date.month);
        expect(month.firstDate).toEqual(new NgbDate(refMonth.date.year, refMonth.date.month, 1));
        expect(month.lastDate).toEqual(new NgbDate(refMonth.date.year, refMonth.date.month, refMonth.lastDay));
        expect(month.weekdays).toEqual([1, 2, 3, 4, 5, 6, 7]);
        expect(month.weeks.length).toBe(6);

        // First week, first day
        expect(month.weeks[0].number).toEqual(refMonth.firstWeek.number);
        expect(month.weeks[0].days.length).toEqual(7);
        expect(month.weeks[0].days[0].date).toEqual(refMonth.firstWeek.date);
        expect(month.weeks[0].days[0].context.disabled).toBe(false);

        // Last week, last day
        expect(month.weeks[5].number).toEqual(refMonth.lastWeek.number);
        expect(month.weeks[5].days.length).toEqual(7);
        expect(month.weeks[5].days[6].date).toEqual(refMonth.lastWeek.date);
        expect(month.weeks[5].days[6].context.disabled).toBe(false);
      });
    });

    it(`should mark dates as disabled`, () => {
      // disable the second day
      const markDisabled: NgbMarkDisabled = (date) => date.day === 2;

      // MAY 2017
      let month = buildMonth(
          calendar, new NgbDate(2017, 5, 5), { firstDayOfWeek: 1, markDisabled } as DatepickerViewModel, i18n);

      // 2 MAY - disabled
      expect(month.weeks[0].days[0].context.disabled).toBe(false);
      expect(month.weeks[0].days[1].context.disabled).toBe(true);
      expect(month.weeks[0].days[2].context.disabled).toBe(false);
    });


    it(`should call 'markDisabled' with correct arguments`, () => {
      const mock: {markDisabled: NgbMarkDisabled} = {markDisabled: () => false};
      spyOn(mock, 'markDisabled').and.returnValue(false);

      // MAY 2017
      let state = {
        firstDayOfWeek: 1,
        minDate: new NgbDate(2017, 5, 10),
        maxDate: new NgbDate(2017, 5, 10),
        markDisabled: mock.markDisabled
      } as DatepickerViewModel;
      buildMonth(calendar, new NgbDate(2017, 5, 5), state, i18n);

      // called one time, because it should be used only inside min-max range
      expect(mock.markDisabled).toHaveBeenCalledWith(new NgbDate(2017, 5, 10), {year: 2017, month: 5});
      expect(mock.markDisabled).toHaveBeenCalledTimes(1);
    });

    it(`should mark dates before 'minDate' as disabled and ignore 'markDisabled'`, () => {
      const markDisabled: NgbMarkDisabled = (date) => date.day === 1;

      // MAY 2017
      let state = { firstDayOfWeek: 1, minDate: new NgbDate(2017, 5, 3), markDisabled } as DatepickerViewModel;
      const month = buildMonth(calendar, new NgbDate(2017, 5, 5), state, i18n);

      // MIN = 2, so 1-2 MAY - disabled
      expect(month.weeks[0].days[0].context.disabled).toBe(true);
      expect(month.weeks[0].days[1].context.disabled).toBe(true);
      expect(month.weeks[0].days[2].context.disabled).toBe(false);
      expect(month.weeks[0].days[3].context.disabled).toBe(false);
    });

    it(`should mark dates after 'maxDate' as disabled and ignore 'markDisabled`, () => {
      const markDisabled: NgbMarkDisabled = (date) => date.day === 3;

      // MAY 2017
      let state = { firstDayOfWeek: 1, maxDate: new NgbDate(2017, 5, 2), markDisabled } as DatepickerViewModel;
      const month = buildMonth(calendar, new NgbDate(2017, 5, 5), state, i18n);

      // MAX = 2, so 3-4 MAY - disabled
      expect(month.weeks[0].days[0].context.disabled).toBe(false);
      expect(month.weeks[0].days[1].context.disabled).toBe(false);
      expect(month.weeks[0].days[2].context.disabled).toBe(true);
      expect(month.weeks[0].days[3].context.disabled).toBe(true);
    });

    it(`should rotate days of the week`, () => {
      // SUN = 7
      let month = buildMonth(calendar, new NgbDate(2017, 5, 5), { firstDayOfWeek: 7 } as DatepickerViewModel, i18n);
      expect(month.weekdays).toEqual([7, 1, 2, 3, 4, 5, 6]);
      expect(month.weeks[0].days[0].date).toEqual(new NgbDate(2017, 4, 30));

      // WED = 3
      month = buildMonth(calendar, new NgbDate(2017, 5, 5), { firstDayOfWeek: 3 } as DatepickerViewModel, i18n);
      expect(month.weekdays).toEqual([3, 4, 5, 6, 7, 1, 2]);
      expect(month.weeks[0].days[0].date).toEqual(new NgbDate(2017, 4, 26));
    });
  });

  describe(`buildMonths()`, () => {

    let calendar: NgbCalendar;
    let i18n: NgbDatepickerI18n;

    beforeAll(() => {
      TestBed.configureTestingModule({
        providers: [
          {provide: NgbCalendar, useClass: NgbCalendarGregorian},
          {provide: NgbDatepickerI18n, useClass: NgbDatepickerI18nDefault}, DatePipe
        ]
      });
      calendar = TestBed.get(NgbCalendar);
      i18n = TestBed.get(NgbDatepickerI18n);
    });

    it(`should generate 'displayMonths' number of months`, () => {
      let state = { displayMonths: 1, firstDayOfWeek: 1, months: [] } as DatepickerViewModel;
      let months = buildMonths(calendar, new NgbDate(2017, 5, 5), state, i18n, false);
      expect(months.length).toBe(1);

      state.displayMonths = 2;
      months = buildMonths(calendar, new NgbDate(2017, 5, 5), state, i18n, false);
      expect(months.length).toBe(2);
    });

    it(`should not rebuild existing months by default`, () => {
      const may = new NgbDate(2017, 5, 5);
      const june = new NgbDate(2017, 6, 5);

      // one same month
      let state = { displayMonths: 1, firstDayOfWeek: 1, months: [] } as DatepickerViewModel;
      state.months = buildMonths(calendar, may, state, i18n, false);
      let newMonths = buildMonths(calendar, may, state, i18n, false);

      expect(state.months.length).toBe(1);
      expect(newMonths.length).toBe(1);
      expect(state.months[0]).toBe(newMonths[0]);

      // one new month
      state = { displayMonths: 1, firstDayOfWeek: 1, months: [] } as DatepickerViewModel;
      state.months = buildMonths(calendar, may, state, i18n, false);
      newMonths = buildMonths(calendar, june, state, i18n, false);

      expect(state.months.length).toBe(1);
      expect(newMonths.length).toBe(1);
      expect(state.months[0]).not.toBe(newMonths[0]);

      // two same months
      state = { displayMonths: 2, firstDayOfWeek: 1, months: [] } as DatepickerViewModel;
      state.months = buildMonths(calendar, may, state, i18n, false);
      newMonths = buildMonths(calendar, may, state, i18n, false);

      expect(state.months.length).toBe(2);
      expect(newMonths.length).toBe(2);
      expect(state.months[0]).toBe(newMonths[0]);
      expect(state.months[1]).toBe(newMonths[1]);

      // two months, one overlaps
      state = { displayMonths: 2, firstDayOfWeek: 1, months: [] } as DatepickerViewModel;
      state.months = buildMonths(calendar, may, state, i18n, false);
      newMonths = buildMonths(calendar, june, state, i18n, false);

      expect(state.months.length).toBe(2);
      expect(newMonths.length).toBe(2);
      expect(state.months[0]).not.toBe(newMonths[0]);
      expect(state.months[1]).not.toBe(newMonths[1]);
      expect(state.months[1]).toBe(newMonths[0]);  // june reused
    });

    it(`should rebuild existing months with 'rebuild=false'`, () => {
      const may = new NgbDate(2017, 5, 5);
      const june = new NgbDate(2017, 6, 5);

      // one same month
      let state = { displayMonths: 1, firstDayOfWeek: 1, months: [] } as DatepickerViewModel;
      state.months = buildMonths(calendar, may, state, i18n, true);
      let newMonths = buildMonths(calendar, may, state, i18n, true);

      expect(state.months.length).toBe(1);
      expect(newMonths.length).toBe(1);
      expect(state.months[0]).not.toBe(newMonths[0]);

      // one new month
      state = { displayMonths: 1, firstDayOfWeek: 1, months: [] } as DatepickerViewModel;
      state.months = buildMonths(calendar, may, state, i18n, true);
      newMonths = buildMonths(calendar, june, state, i18n, true);

      expect(state.months.length).toBe(1);
      expect(newMonths.length).toBe(1);
      expect(state.months[0]).not.toBe(newMonths[0]);

      // two same months
      state = { displayMonths: 2, firstDayOfWeek: 1, months: [] } as DatepickerViewModel;
      state.months = buildMonths(calendar, may, state, i18n, true);
      newMonths = buildMonths(calendar, may, state, i18n, true);

      expect(state.months.length).toBe(2);
      expect(newMonths.length).toBe(2);
      expect(state.months[0]).not.toBe(newMonths[0]);
      expect(state.months[1]).not.toBe(newMonths[1]);

      // two months, one overlaps
      state = { displayMonths: 2, firstDayOfWeek: 1, months: [] } as DatepickerViewModel;
      state.months = buildMonths(calendar, may, state, i18n, true);
      newMonths = buildMonths(calendar, june, state, i18n, true);

      expect(state.months.length).toBe(2);
      expect(newMonths.length).toBe(2);
      expect(state.months[0]).not.toBe(newMonths[0]);
      expect(state.months[1]).not.toBe(newMonths[1]);
      expect(state.months[1]).not.toBe(newMonths[0]);
    });
  });

  describe(`getFirstViewDate()`, () => {

    let calendar: NgbCalendar;

    beforeAll(() => {
      TestBed.configureTestingModule({providers: [{provide: NgbCalendar, useClass: NgbCalendarGregorian}]});
      calendar = TestBed.get(NgbCalendar);
    });

    const months = [
      // Mon
      {start: 1, date: new NgbDate(2017, 1, 10), first: new NgbDate(2016, 12, 26)},
      {start: 1, date: new NgbDate(2017, 2, 10), first: new NgbDate(2017, 1, 30)},
      {start: 1, date: new NgbDate(2017, 3, 10), first: new NgbDate(2017, 2, 27)},
      {start: 1, date: new NgbDate(2017, 4, 10), first: new NgbDate(2017, 3, 27)},
      {start: 1, date: new NgbDate(2017, 5, 10), first: new NgbDate(2017, 5, 1)},
      {start: 1, date: new NgbDate(2017, 6, 10), first: new NgbDate(2017, 5, 29)},
      {start: 1, date: new NgbDate(2017, 7, 10), first: new NgbDate(2017, 6, 26)},
      {start: 1, date: new NgbDate(2017, 8, 10), first: new NgbDate(2017, 7, 31)},
      {start: 1, date: new NgbDate(2017, 9, 10), first: new NgbDate(2017, 8, 28)},
      {start: 1, date: new NgbDate(2017, 10, 10), first: new NgbDate(2017, 9, 25)},
      {start: 1, date: new NgbDate(2017, 11, 10), first: new NgbDate(2017, 10, 30)},
      {start: 1, date: new NgbDate(2017, 12, 10), first: new NgbDate(2017, 11, 27)},
      // Sun
      {start: 7, date: new NgbDate(2017, 1, 10), first: new NgbDate(2017, 1, 1)},
      {start: 7, date: new NgbDate(2017, 2, 10), first: new NgbDate(2017, 1, 29)},
      {start: 7, date: new NgbDate(2017, 3, 10), first: new NgbDate(2017, 2, 26)},
      {start: 7, date: new NgbDate(2017, 4, 10), first: new NgbDate(2017, 3, 26)},
      {start: 7, date: new NgbDate(2017, 5, 10), first: new NgbDate(2017, 4, 30)},
      {start: 7, date: new NgbDate(2017, 6, 10), first: new NgbDate(2017, 5, 28)},
      {start: 7, date: new NgbDate(2017, 7, 10), first: new NgbDate(2017, 6, 25)},
      {start: 7, date: new NgbDate(2017, 8, 10), first: new NgbDate(2017, 7, 30)},
      {start: 7, date: new NgbDate(2017, 9, 10), first: new NgbDate(2017, 8, 27)},
      {start: 7, date: new NgbDate(2017, 10, 10), first: new NgbDate(2017, 10, 1)},
      {start: 7, date: new NgbDate(2017, 11, 10), first: new NgbDate(2017, 10, 29)},
      {start: 7, date: new NgbDate(2017, 12, 10), first: new NgbDate(2017, 11, 26)},
      // Wed
      {start: 3, date: new NgbDate(2017, 1, 10), first: new NgbDate(2016, 12, 28)},
      {start: 3, date: new NgbDate(2017, 2, 10), first: new NgbDate(2017, 2, 1)},
      {start: 3, date: new NgbDate(2017, 3, 10), first: new NgbDate(2017, 3, 1)},
      {start: 3, date: new NgbDate(2017, 4, 10), first: new NgbDate(2017, 3, 29)},
      {start: 3, date: new NgbDate(2017, 5, 10), first: new NgbDate(2017, 4, 26)},
      {start: 3, date: new NgbDate(2017, 6, 10), first: new NgbDate(2017, 5, 31)},
      {start: 3, date: new NgbDate(2017, 7, 10), first: new NgbDate(2017, 6, 28)},
      {start: 3, date: new NgbDate(2017, 8, 10), first: new NgbDate(2017, 7, 26)},
      {start: 3, date: new NgbDate(2017, 9, 10), first: new NgbDate(2017, 8, 30)},
      {start: 3, date: new NgbDate(2017, 10, 10), first: new NgbDate(2017, 9, 27)},
      {start: 3, date: new NgbDate(2017, 11, 10), first: new NgbDate(2017, 11, 1)},
      {start: 3, date: new NgbDate(2017, 12, 10), first: new NgbDate(2017, 11, 29)}
    ];

    months.forEach(month => {
      it(`should return the correct first view date`,
         () => { expect(getFirstViewDate(calendar, month.date, month.start)).toEqual(month.first); });
    });
  });

  describe(`isDateSelectable()`, () => {

    // disabling 15th of any month
    const markDisabled: NgbMarkDisabled = (date, month) => date.day === 15;

    it(`should return false if date is invalid`, () => {
      let state = { disabled: false } as DatepickerViewModel;
      expect(isDateSelectable(null, state)).toBeFalsy();
      expect(isDateSelectable(undefined, state)).toBeFalsy();
    });

    it(`should return false if datepicker is disabled`, () => {
      let state = { disabled: true } as DatepickerViewModel;
      expect(isDateSelectable(new NgbDate(2016, 11, 10), state)).toBeFalsy();
      expect(isDateSelectable(new NgbDate(2017, 11, 10), state)).toBeFalsy();
      expect(isDateSelectable(new NgbDate(2018, 11, 10), state)).toBeFalsy();
    });

    it(`should take into account markDisabled values`, () => {
      let state = { disabled: false, markDisabled } as DatepickerViewModel;
      expect(isDateSelectable(new NgbDate(2016, 11, 15), state)).toBeFalsy();
      expect(isDateSelectable(new NgbDate(2017, 11, 15), state)).toBeFalsy();
      expect(isDateSelectable(new NgbDate(2018, 11, 15), state)).toBeFalsy();
    });

    it(`should take into account minDate values`, () => {
      let state = { disabled: false, minDate: new NgbDate(2018, 11, 10) } as DatepickerViewModel;
      expect(isDateSelectable(new NgbDate(2017, 11, 10), state)).toBeFalsy();
    });

    it(`should take into account maxDate values`, () => {
      let state = { disabled: false, maxDate: new NgbDate(2016, 11, 10) } as DatepickerViewModel;
      expect(isDateSelectable(new NgbDate(2017, 11, 10), state)).toBeFalsy();
    });

    it(`should return true for normal values`, () => {
      let state = { disabled: false } as DatepickerViewModel;
      expect(isDateSelectable(new NgbDate(2016, 11, 10), state)).toBeTruthy();
      expect(isDateSelectable(new NgbDate(2017, 11, 10), state)).toBeTruthy();
      expect(isDateSelectable(new NgbDate(2018, 11, 10), state)).toBeTruthy();
    });
  });

  describe(`generateSelectBoxMonths`, () => {

    let calendar: NgbCalendar;

    beforeAll(() => {
      TestBed.configureTestingModule({providers: [{provide: NgbCalendar, useClass: NgbCalendarGregorian}]});
      calendar = TestBed.get(NgbCalendar);
    });

    const test = (minDate, date, maxDate, result) => {
      expect(generateSelectBoxMonths(calendar, date, minDate, maxDate)).toEqual(result);
    };

    it(`should handle edge cases`, () => {
      test(new NgbDate(2018, 6, 1), null, new NgbDate(2018, 6, 10), []);
      test(null, null, null, []);
    });

    it(`should generate months correctly`, () => {
      // clang-format off
      // different years
      test(new NgbDate(2017, 1, 1), new NgbDate(2018, 1, 1),  new NgbDate(2019, 1, 1),  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
      test(null,                    new NgbDate(2018, 6, 10), null,                     [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
      test(null,                    new NgbDate(2018, 1, 1),  new NgbDate(2019, 1, 1),  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
      test(new NgbDate(2017, 1, 1), new NgbDate(2018, 1, 1),  null,                     [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

      // same 'min year'
      test(new NgbDate(2018, 1, 1), new NgbDate(2018, 6, 10), new NgbDate(2020, 1, 2),  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
      test(new NgbDate(2018, 6, 1), new NgbDate(2018, 6, 10), new NgbDate(2020, 1, 2),  [6, 7, 8, 9, 10, 11, 12]);
      test(new NgbDate(2018, 6, 1), new NgbDate(2018, 6, 10), null,                     [6, 7, 8, 9, 10, 11, 12]);

      // same 'max' year
      test(new NgbDate(2017, 1, 1), new NgbDate(2018, 6, 10), new NgbDate(2018, 12, 1), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
      test(new NgbDate(2017, 1, 1), new NgbDate(2018, 6, 10), new NgbDate(2018, 6, 10), [1, 2, 3, 4, 5, 6]);
      test(null,                    new NgbDate(2018, 6, 10), new NgbDate(2018, 6, 10), [1, 2, 3, 4, 5, 6]);

      // same 'min' and 'max years'
      test(new NgbDate(2018, 1, 1), new NgbDate(2018, 6, 10), new NgbDate(2018, 12, 1), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
      test(new NgbDate(2018, 3, 1), new NgbDate(2018, 6, 10), new NgbDate(2018, 12, 1), [3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
      test(new NgbDate(2018, 3, 1), new NgbDate(2018, 6, 10), null,                     [3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
      test(null,                    new NgbDate(2018, 6, 10), new NgbDate(2018, 8, 1),  [1, 2, 3, 4, 5, 6, 7, 8]);
      test(new NgbDate(2018, 3, 1), new NgbDate(2018, 6, 10), new NgbDate(2018, 8, 1),  [3, 4, 5, 6, 7, 8] );
      test(new NgbDate(2018, 6, 1), new NgbDate(2018, 6, 10), new NgbDate(2018, 6, 10), [6]);
      // clang-format on
    });
  });

  describe(`generateSelectBoxYears`, () => {

    const test =
        (minDate, date, maxDate, result) => { expect(generateSelectBoxYears(date, minDate, maxDate)).toEqual(result); };
    const range = (start, end) => Array.from({length: end - start + 1}, (e, i) => start + i);

    it(`should handle edge cases`, () => {
      test(new NgbDate(2018, 6, 1), null, new NgbDate(2018, 6, 10), []);
      test(null, null, null, []);
    });

    it(`should generate years correctly`, () => {
      // both 'min' and 'max' are set
      test(new NgbDate(2017, 1, 1), new NgbDate(2018, 1, 1), new NgbDate(2019, 1, 1), range(2017, 2019));
      test(new NgbDate(2000, 1, 1), new NgbDate(2018, 1, 1), new NgbDate(3000, 1, 1), range(2000, 3000));
      test(new NgbDate(2018, 1, 1), new NgbDate(2018, 1, 1), new NgbDate(2018, 1, 1), [2018]);

      // 'min' is not set
      test(null, new NgbDate(2018, 1, 1), new NgbDate(2019, 1, 1), range(2008, 2019));
      test(null, new NgbDate(2018, 1, 1), new NgbDate(3000, 1, 1), range(2008, 3000));
      test(null, new NgbDate(2018, 1, 1), new NgbDate(2018, 1, 1), range(2008, 2018));

      // 'max' is not set
      test(new NgbDate(2017, 1, 1), new NgbDate(2018, 1, 1), null, range(2017, 2028));
      test(new NgbDate(2000, 1, 1), new NgbDate(2018, 1, 1), null, range(2000, 2028));
      test(new NgbDate(2018, 1, 1), new NgbDate(2018, 1, 1), null, range(2018, 2028));

      // both are not set
      test(null, new NgbDate(2018, 1, 1), null, range(2008, 2028));
      test(null, new NgbDate(2000, 1, 1), null, range(1990, 2010));
    });
  });

});
