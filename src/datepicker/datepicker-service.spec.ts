import {TestBed} from '@angular/core/testing';
import {NgbDatepickerService} from './datepicker-service';
import {NgbCalendar, NgbCalendarGregorian} from './ngb-calendar';
import {NgbDate} from './ngb-date';
import {Subscription} from 'rxjs';
import {DatepickerViewModel} from './datepicker-view-model';
import {NgbDatepickerI18n, NgbDatepickerI18nDefault} from './datepicker-i18n';

describe('ngb-datepicker-service', () => {

  let service: NgbDatepickerService;
  let calendar: NgbCalendar;
  let model: DatepickerViewModel;
  let mock: {onNext};
  let selectDate: NgbDate;
  let mockSelect: {onNext};

  let subscriptions: Subscription[];

  const getWeek = (week: number, month = 0) => model.months[month].weeks[week];
  const getDay = (day: number, week = 0, month = 0) => getWeek(week, month).days[day];
  const getDayCtx = (day: number) => getDay(day).context;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NgbDatepickerService, {provide: NgbCalendar, useClass: NgbCalendarGregorian},
        {provide: NgbDatepickerI18n, useClass: NgbDatepickerI18nDefault}
      ]
    });

    calendar = TestBed.get(NgbCalendar);
    service = TestBed.get(NgbDatepickerService);
    subscriptions = [];
    model = undefined;
    selectDate = null;

    mock = {onNext: () => {}};
    spyOn(mock, 'onNext');

    mockSelect = {onNext: () => {}};
    spyOn(mockSelect, 'onNext');

    // subscribing
    subscriptions.push(
        service.model$.subscribe(mock.onNext), service.model$.subscribe(m => model = m),
        service.select$.subscribe(mockSelect.onNext), service.select$.subscribe(d => selectDate = d));
  });

  afterEach(() => { subscriptions.forEach(s => s.unsubscribe()); });

  it(`should be possible to instantiate`, () => { expect(service).toBeTruthy(); });

  it(`should not return anything upon subscription`, () => {
    expect(model).toBeUndefined();
    expect(mock.onNext).not.toHaveBeenCalled();
  });

  describe(`min/max dates`, () => {

    it(`should emit null and valid 'minDate' values`, () => {
      // valid
      const minDate = new NgbDate(2017, 5, 1);
      service.minDate = minDate;
      service.focus(new NgbDate(2017, 5, 1));
      expect(model.minDate).toEqual(minDate);

      // null
      service.minDate = null;
      expect(model.minDate).toBeNull();

      // undefined -> ignore
      service.minDate = undefined;
      expect(model.minDate).toBeNull();

      // invalid -> ignore
      service.minDate = new NgbDate(-2, 0, null);
      expect(model.minDate).toBeNull();

      expect(mock.onNext).toHaveBeenCalledTimes(2);
    });

    it(`should emit null and valid 'maxDate' values`, () => {
      // valid
      const maxDate = new NgbDate(2017, 5, 1);
      service.maxDate = maxDate;
      service.focus(new NgbDate(2017, 5, 1));
      expect(model.maxDate).toEqual(maxDate);

      // null
      service.maxDate = null;
      expect(model.maxDate).toBeNull();

      // undefined -> ignore
      service.maxDate = undefined;
      expect(model.maxDate).toBeNull();

      // invalid -> ignore
      service.maxDate = new NgbDate(-2, 0, null);
      expect(model.maxDate).toBeNull();

      expect(mock.onNext).toHaveBeenCalledTimes(2);
    });

    it(`should not emit the same 'minDate' value twice`, () => {
      service.minDate = new NgbDate(2017, 5, 1);
      service.focus(new NgbDate(2015, 5, 1));

      service.minDate = new NgbDate(2017, 5, 1);

      expect(mock.onNext).toHaveBeenCalledTimes(1);
    });

    it(`should not emit the same 'maxDate' value twice`, () => {
      service.maxDate = new NgbDate(2017, 5, 1);
      service.focus(new NgbDate(2015, 5, 1));

      service.maxDate = new NgbDate(2017, 5, 1);

      expect(mock.onNext).toHaveBeenCalledTimes(1);
    });

    it(`should throw if 'min' date is after 'max' date`, () => {
      const minDate = new NgbDate(2017, 5, 1);
      service.focus(new NgbDate(2015, 5, 1));

      expect(() => {
        service.minDate = minDate;
        service.maxDate = new NgbDate(2017, 4, 1);
      }).toThrowError();
    });

    it(`should align 'date' with 'maxDate'`, () => {
      service.maxDate = new NgbDate(2017, 5, 1);
      service.focus(new NgbDate(2017, 5, 5));
      expect(model.focusDate).toEqual(new NgbDate(2017, 5, 1));
    });

    it(`should align 'date' with 'minDate'`, () => {
      service.minDate = new NgbDate(2017, 5, 10);
      service.focus(new NgbDate(2017, 5, 5));
      expect(model.focusDate).toEqual(new NgbDate(2017, 5, 10));
    });

    it(`should mark dates outside 'min/maxDates' as disabled`, () => {
      // MAY 2017
      service.focus(new NgbDate(2017, 5, 1));
      expect(model.minDate).toBeUndefined();
      expect(model.maxDate).toBeUndefined();
      expect(getDayCtx(0).disabled).toBe(false);  // 1 MAY
      expect(getDayCtx(5).disabled).toBe(false);  // 6 MAY

      service.minDate = new NgbDate(2017, 5, 2);
      service.maxDate = new NgbDate(2017, 5, 5);
      expect(getDayCtx(0).disabled).toBe(true);  // 1 MAY
      expect(getDayCtx(5).disabled).toBe(true);  // 6 MAY
    });

    it(`should update month when 'min/maxDates' change and visible`, () => {
      // MAY 2017
      service.focus(new NgbDate(2017, 5, 5));
      expect(model.months.length).toBe(1);
      expect(model.minDate).toBeUndefined();
      expect(model.maxDate).toBeUndefined();

      // MIN -> 5 MAY, 2017
      service.minDate = new NgbDate(2017, 5, 5);
      expect(model.months.length).toBe(1);
      expect(getDayCtx(0).disabled).toBe(true);

      // MAX -> 10 MAY, 2017
      service.maxDate = new NgbDate(2017, 5, 10);
      expect(model.months.length).toBe(1);
      expect(model.months[0].weeks[4].days[0].context.disabled).toBe(true);
    });
  });

  describe(`firstDayOfWeek`, () => {

    it(`should emit only positive numeric 'firstDayOfWeek' values`, () => {
      // valid
      service.firstDayOfWeek = 2;
      service.focus(new NgbDate(2015, 5, 1));
      expect(model.firstDayOfWeek).toEqual(2);

      // -1 -> ignore
      service.firstDayOfWeek = -1;
      expect(model.firstDayOfWeek).toEqual(2);

      // null -> ignore
      service.firstDayOfWeek = null;
      expect(model.firstDayOfWeek).toEqual(2);

      // undefined -> ignore
      service.firstDayOfWeek = null;
      expect(model.firstDayOfWeek).toEqual(2);

      expect(mock.onNext).toHaveBeenCalledTimes(1);
    });

    it(`should not emit the same 'firstDayOfWeek' value twice`, () => {
      service.firstDayOfWeek = 2;
      service.focus(new NgbDate(2015, 5, 1));

      service.firstDayOfWeek = 2;

      expect(mock.onNext).toHaveBeenCalledTimes(1);
    });

    it(`should generate a month with firstDayOfWeek=1 by default`, () => {
      service.focus(new NgbDate(2017, 5, 5));
      expect(model.months.length).toBe(1);
      expect(model.months[0].weekdays[0]).toBe(1);
    });

    it(`should generate weeks starting with 'firstDayOfWeek'`, () => {
      service.firstDayOfWeek = 2;
      service.focus(new NgbDate(2017, 5, 5));
      expect(model.months.length).toBe(1);
      expect(model.months[0].weekdays[0]).toBe(2);

      service.firstDayOfWeek = 4;
      expect(model.months.length).toBe(1);
      expect(model.months[0].weekdays[0]).toBe(4);
    });

    it(`should update months when 'firstDayOfWeek' changes`, () => {
      service.focus(new NgbDate(2017, 5, 5));
      expect(model.months.length).toBe(1);
      expect(model.firstDayOfWeek).toBe(1);

      const oldFirstDate = getDay(0).date;
      expect(oldFirstDate).toEqual(new NgbDate(2017, 5, 1));

      service.firstDayOfWeek = 3;
      expect(model.months.length).toBe(1);
      expect(model.firstDayOfWeek).toBe(3);
      const newFirstDate = getDay(0).date;
      expect(newFirstDate).toEqual(new NgbDate(2017, 4, 26));
    });
  });

  describe(`displayMonths`, () => {

    it(`should emit only positive numeric 'displayMonths' values`, () => {
      // valid
      service.displayMonths = 2;
      service.focus(new NgbDate(2017, 5, 1));
      expect(model.displayMonths).toEqual(2);

      // -1 -> ignore
      service.displayMonths = -1;
      expect(model.displayMonths).toEqual(2);

      // null -> ignore
      service.displayMonths = null;
      expect(model.displayMonths).toEqual(2);

      // undefined -> ignore
      service.displayMonths = null;
      expect(model.displayMonths).toEqual(2);

      expect(mock.onNext).toHaveBeenCalledTimes(1);
    });

    it(`should not emit the same 'displayMonths' value twice`, () => {
      service.displayMonths = 2;
      service.focus(new NgbDate(2017, 5, 1));

      service.displayMonths = 2;

      expect(mock.onNext).toHaveBeenCalledTimes(1);
    });

    it(`should generate 'displayMonths' number of months`, () => {
      service.displayMonths = 2;
      service.focus(new NgbDate(2017, 5, 5));
      expect(model.months.length).toBe(2);

      service.displayMonths = 4;
      expect(model.months.length).toBe(4);
    });

    it(`should reuse existing months when 'displayMonths' changes`, () => {
      service.focus(new NgbDate(2017, 5, 5));

      // 1 month
      expect(model.months.length).toBe(1);
      const month = model.months[0];
      const date = month.weeks[0].days[0].date;
      expect(date).toEqual(new NgbDate(2017, 5, 1));

      // 2 months
      service.displayMonths = 2;
      expect(model.months.length).toBe(2);
      expect(model.months[0]).toBe(month);
      expect(getDay(0).date).toBe(date);

      // back to 1 month
      service.displayMonths = 1;
      expect(model.months.length).toBe(1);
      expect(model.months[0]).toBe(month);
      expect(getDay(0).date).toBe(date);
    });

    it(`should change the tabindex when changing the current month`, () => {
      service.displayMonths = 2;
      service.focus(new NgbDate(2018, 3, 31));

      expect(getDay(5, 4, 0).tabindex).toEqual(0);   // 31 march in the first month block
      expect(getDay(5, 0, 1).tabindex).toEqual(-1);  // 31 march in the second month block

      service.focusMove('d', 1);
      expect(getDay(5, 4, 0).tabindex).toEqual(-1);  // 31 march in the first month block
      expect(getDay(5, 0, 1).tabindex).toEqual(-1);  // 31 march in the second month block
      expect(getDay(6, 4, 0).tabindex).toEqual(-1);  // 1st april in the first month block
      expect(getDay(6, 0, 1).tabindex).toEqual(0);   // 1st april in the second month block

    });

    it(`should set the aria-label when changing the current month`, () => {
      service.displayMonths = 2;
      service.focus(new NgbDate(2018, 3, 31));

      expect(getDay(5, 4, 0).ariaLabel).toEqual('Saturday, March 31, 2018');  // 31 march in the first month block
      expect(getDay(5, 0, 1).ariaLabel).toEqual('Saturday, March 31, 2018');  // 31 march in the second month block

      service.focusMove('d', 1);
      expect(getDay(5, 4, 0).ariaLabel).toEqual('Saturday, March 31, 2018');  // 31 march in the first month block
      expect(getDay(5, 0, 1).ariaLabel).toEqual('Saturday, March 31, 2018');  // 31 march in the second month block
      expect(getDay(6, 4, 0).ariaLabel).toEqual('Sunday, April 1, 2018');     // 1st april in the first month block
      expect(getDay(6, 0, 1).ariaLabel).toEqual('Sunday, April 1, 2018');     // 1st april in the second month block

    });
  });

  describe(`disabled`, () => {

    it(`should emit 'disabled' values`, () => {
      service.focus(new NgbDate(2017, 5, 1));
      expect(model.disabled).toEqual(false);

      service.disabled = true;
      expect(model.disabled).toEqual(true);
    });

    it(`should not emit the same 'disabled' value twice`, () => {
      service.focus(new NgbDate(2017, 5, 1));  // 1
      service.disabled = true;                 // 2

      service.disabled = true;  // ignored

      expect(mock.onNext).toHaveBeenCalledTimes(2);
    });

    it(`should not allow focusing when disabled`, () => {
      const today = new NgbDate(2017, 5, 2);
      service.focus(today);     // 1
      service.disabled = true;  // 2

      // focus
      service.focus(new NgbDate(2017, 5, 1));  // nope
      expect(model.focusDate).toEqual(today);

      // focusMove
      service.focusMove('d', 1);  // nope
      expect(model.focusDate).toEqual(today);

      expect(mock.onNext).toHaveBeenCalledTimes(2);
    });

    it(`should not allow selecting when disabled`, () => {
      const today = new NgbDate(2017, 5, 2);
      service.focus(today);     // 1
      service.disabled = true;  // 2

      // select
      service.select(new NgbDate(2017, 5, 2));  // nope
      expect(model.selectedDate).toBeNull();

      // focus select
      service.focusSelect();  // nope
      expect(model.selectedDate).toBeNull();

      expect(mock.onNext).toHaveBeenCalledTimes(2);
    });

    it(`should not allow opening when disabled`, () => {
      service.focus(new NgbDate(2017, 5, 2));  // 1
      service.disabled = true;                 // 2

      // open
      service.open(new NgbDate(2016, 5, 1));  // nope
      expect(model.firstDate).toEqual(new NgbDate(2017, 5, 1));

      expect(mock.onNext).toHaveBeenCalledTimes(2);
    });

    it(`should turn focus off when disabled`, () => {
      service.focus(new NgbDate(2017, 5, 2));
      service.focusVisible = true;
      expect(model.focusVisible).toBeTruthy();

      service.disabled = true;
      expect(model.focusVisible).toBeFalsy();
    });

    it(`should not turn focus on when disabled`, () => {
      service.focus(new NgbDate(2017, 5, 2));
      service.disabled = true;
      expect(model.focusVisible).toBeFalsy();

      service.focusVisible = true;
      expect(model.focusVisible).toBeFalsy();
    });

    it(`should disable navigation arrows`, () => {
      service.focus(new NgbDate(2017, 5, 2));
      expect(model.prevDisabled).toBeFalsy();
      expect(model.nextDisabled).toBeFalsy();

      service.disabled = true;
      expect(model.prevDisabled).toBeTruthy();
      expect(model.nextDisabled).toBeTruthy();

      service.disabled = false;
      expect(model.prevDisabled).toBeFalsy();
      expect(model.nextDisabled).toBeFalsy();
    });

  });

  describe(`focusVisible`, () => {

    it(`should set focus visible or not`, () => {
      service.focus(new NgbDate(2017, 5, 1));
      expect(model.focusVisible).toEqual(false);

      service.focusVisible = true;
      expect(model.focusVisible).toEqual(true);
    });

    it(`should not emit the same 'focusVisible' value twice`, () => {
      service.focusVisible = true;
      service.focus(new NgbDate(2017, 5, 1));

      service.focusVisible = true;  // ignored

      expect(mock.onNext).toHaveBeenCalledTimes(1);
    });

  });

  describe(`navigation`, () => {

    it(`should emit navigation values`, () => {
      // default = 'selected'
      service.focus(new NgbDate(2015, 5, 1));
      expect(model.navigation).toEqual('select');

      service.navigation = 'none';
      expect(model.navigation).toEqual('none');

      service.navigation = 'arrows';
      expect(model.navigation).toEqual('arrows');
    });

    it(`should not emit the same 'navigation' value twice`, () => {
      service.focus(new NgbDate(2017, 5, 1));

      service.navigation = 'select';  // ignored
      expect(mock.onNext).toHaveBeenCalledTimes(1);
    });

    describe(`select`, () => {

      const range = (start, end) => Array.from({length: end - start + 1}, (e, i) => start + i);

      it(`should not generate 'months' and 'years' for non-select navigations`, () => {
        service.minDate = new NgbDate(2010, 5, 1);
        service.maxDate = new NgbDate(2012, 5, 1);
        service.focus(new NgbDate(2011, 5, 1));
        expect(model.selectBoxes.years).not.toEqual([]);
        expect(model.selectBoxes.months).not.toEqual([]);

        service.navigation = 'none';
        expect(model.selectBoxes.years).toEqual([]);
        expect(model.selectBoxes.months).toEqual([]);

        service.navigation = 'arrows';
        expect(model.selectBoxes.years).toEqual([]);
        expect(model.selectBoxes.months).toEqual([]);
      });

      it(`should generate 'months' and 'years' for given min/max dates`, () => {
        service.minDate = new NgbDate(2010, 5, 1);
        service.maxDate = new NgbDate(2012, 5, 1);
        service.focus(new NgbDate(2011, 5, 1));

        expect(model.selectBoxes.years).toEqual([2010, 2011, 2012]);
        expect(model.selectBoxes.months).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

        service.focus(new NgbDate(2010, 5, 1));
        expect(model.selectBoxes.years).toEqual([2010, 2011, 2012]);
        expect(model.selectBoxes.months).toEqual([5, 6, 7, 8, 9, 10, 11, 12]);

        service.focus(new NgbDate(2012, 5, 1));
        expect(model.selectBoxes.years).toEqual([2010, 2011, 2012]);
        expect(model.selectBoxes.months).toEqual([1, 2, 3, 4, 5]);
      });

      it(`should update 'months' and 'years' when  min/max dates change`, () => {
        service.minDate = new NgbDate(2010, 5, 1);
        service.maxDate = new NgbDate(2012, 5, 1);
        service.focus(new NgbDate(2011, 5, 1));

        expect(model.selectBoxes.years).toEqual([2010, 2011, 2012]);
        expect(model.selectBoxes.months).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

        service.minDate = new NgbDate(2011, 2, 1);
        expect(model.selectBoxes.years).toEqual([2011, 2012]);
        expect(model.selectBoxes.months).toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

        service.maxDate = new NgbDate(2011, 8, 1);
        expect(model.selectBoxes.years).toEqual([2011]);
        expect(model.selectBoxes.months).toEqual([2, 3, 4, 5, 6, 7, 8]);
      });

      it(`should generate [-10, +10] 'years' when min/max dates are missing`, () => {
        const year = calendar.getToday().year;
        service.open(null);
        expect(model.selectBoxes.years).toEqual(range(year - 10, year + 10));

        service.focus(new NgbDate(2011, 1, 1));
        expect(model.selectBoxes.years).toEqual(range(2001, 2021));

        service.focus(new NgbDate(2020, 1, 1));
        expect(model.selectBoxes.years).toEqual(range(2010, 2030));
      });

      it(`should generate [min, +10] 'years' when max date is missing`, () => {
        service.minDate = new NgbDate(2010, 1, 1);
        service.open(new NgbDate(2011, 1, 1));
        expect(model.selectBoxes.years).toEqual(range(2010, 2021));

        service.minDate = new NgbDate(2015, 1, 1);
        expect(model.selectBoxes.years).toEqual(range(2015, 2025));

        service.minDate = new NgbDate(1000, 1, 1);
        expect(model.selectBoxes.years).toEqual(range(1000, 2025));
      });

      it(`should generate [min, +10] 'years' when min date is missing`, () => {
        service.maxDate = new NgbDate(2010, 1, 1);
        service.open(new NgbDate(2009, 1, 1));
        expect(model.selectBoxes.years).toEqual(range(1999, 2010));

        service.maxDate = new NgbDate(2005, 1, 1);
        expect(model.selectBoxes.years).toEqual(range(1995, 2005));

        service.maxDate = new NgbDate(3000, 1, 1);
        expect(model.selectBoxes.years).toEqual(range(1995, 3000));
      });

      it(`should generate 'months' when min/max dates are missing`, () => {
        service.open(null);
        expect(model.selectBoxes.months).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

        service.focus(new NgbDate(2010, 1, 1));
        expect(model.selectBoxes.months).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
      });

      it(`should generate 'months' and 'years' when resetting min/max dates`, () => {
        service.minDate = new NgbDate(2010, 3, 1);
        service.maxDate = new NgbDate(2010, 8, 1);
        service.open(new NgbDate(2010, 5, 10));
        expect(model.selectBoxes.months).toEqual([3, 4, 5, 6, 7, 8]);
        expect(model.selectBoxes.years).toEqual([2010]);

        service.minDate = null;
        expect(model.selectBoxes.months).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
        expect(model.selectBoxes.years).toEqual(range(2000, 2010));

        service.maxDate = null;
        expect(model.selectBoxes.months).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
        expect(model.selectBoxes.years).toEqual(range(2000, 2020));
      });

      it(`should generate 'months' when max date is missing`, () => {
        service.minDate = new NgbDate(2010, 1, 1);
        service.open(new NgbDate(2010, 5, 1));
        expect(model.selectBoxes.months).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

        service.minDate = new NgbDate(2010, 4, 1);
        expect(model.selectBoxes.months).toEqual([4, 5, 6, 7, 8, 9, 10, 11, 12]);
      });

      it(`should generate 'months' when min date is missing`, () => {
        service.maxDate = new NgbDate(2010, 12, 1);
        service.open(new NgbDate(2010, 5, 1));
        expect(model.selectBoxes.months).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

        service.maxDate = new NgbDate(2010, 7, 1);
        expect(model.selectBoxes.months).toEqual([1, 2, 3, 4, 5, 6, 7]);
      });

      it(`should generate 'months' based on the first date, not the focus date`, () => {
        service.displayMonths = 2;
        service.maxDate = new NgbDate(2017, 1, 11);
        service.open(new NgbDate(2017, 1, 1));
        expect(model.selectBoxes.months).toEqual([1]);

        service.open(new NgbDate(2016, 12, 1));
        expect(model.selectBoxes.months).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
      });

      it(`should rebuild 'months' and 'years' only when year change`, () => {
        service.focus(new NgbDate(2010, 5, 1));
        let months = model.selectBoxes.months;
        let years = model.selectBoxes.years;

        // focusing -> nothing
        service.focus(new NgbDate(2010, 5, 10));
        expect(model.selectBoxes.months).toBe(months);
        expect(model.selectBoxes.years).toBe(years);

        // month changes -> nothing
        service.focus(new NgbDate(2010, 6, 1));
        expect(model.selectBoxes.months).toBe(months);
        expect(model.selectBoxes.years).toBe(years);

        // year changes -> rebuilding both
        service.focus(new NgbDate(2011, 6, 1));
        expect(model.selectBoxes.months).not.toBe(months);
        expect(model.selectBoxes.years).not.toBe(years);
      });
    });

    describe(`arrows`, () => {

      it(`should be enabled by default`, () => {
        service.focus(new NgbDate(2018, 3, 10));
        expect(model.prevDisabled).toBeFalsy();
        expect(model.nextDisabled).toBeFalsy();
      });

      it(`should use initial 'minDate' and 'maxDate' values`, () => {
        service.minDate = new NgbDate(2018, 3, 10);
        service.maxDate = new NgbDate(2018, 3, 10);
        service.focus(new NgbDate(2018, 3, 10));
        expect(model.prevDisabled).toBeTruthy();
        expect(model.nextDisabled).toBeTruthy();
      });

      it(`should react to 'minDate' changes`, () => {
        service.focus(new NgbDate(2018, 3, 10));
        service.minDate = new NgbDate(2018, 3, 1);
        expect(model.prevDisabled).toBeTruthy();

        service.minDate = new NgbDate(2018, 2, 1);
        expect(model.prevDisabled).toBeFalsy();

        service.minDate = new NgbDate(2018, 2, 28);
        expect(model.prevDisabled).toBeFalsy();
      });

      it(`should react to 'maxDate' changes`, () => {
        service.focus(new NgbDate(2018, 3, 10));
        service.maxDate = new NgbDate(2018, 3, 31);
        expect(model.nextDisabled).toBeTruthy();

        service.maxDate = new NgbDate(2018, 4, 1);
        expect(model.nextDisabled).toBeFalsy();

        service.maxDate = new NgbDate(2018, 4, 30);
        expect(model.nextDisabled).toBeFalsy();
      });

      it(`should react to 'minDate' changes with multiple months`, () => {
        service.displayMonths = 2;
        service.minDate = new NgbDate(2018, 3, 1);
        service.open(new NgbDate(2018, 3, 10));  // open: [MAR, APR], focus: MAR
        expect(model.prevDisabled).toBeTruthy();

        service.focus(new NgbDate(2018, 4, 10));  // open [MAR, APR], focus: APR
        expect(model.prevDisabled).toBeTruthy();

        service.open(new NgbDate(2018, 4, 10));  // open [APR, MAY], focus: APR
        expect(model.prevDisabled).toBeFalsy();

        service.focus(new NgbDate(2018, 5, 10));  // open [APR, MAY], focus: MAY
        expect(model.prevDisabled).toBeFalsy();
      });

      it(`should react to 'maxDate' changes with multiple months`, () => {
        service.displayMonths = 2;
        service.maxDate = new NgbDate(2018, 3, 10);
        service.open(new NgbDate(2018, 3, 1));  // open: [MAR, APR], focus: MAR
        expect(model.nextDisabled).toBeTruthy();

        service.open(new NgbDate(2018, 2, 1));  // open: [FEB, MAR], focus: FEB
        expect(model.nextDisabled).toBeTruthy();

        service.focus(new NgbDate(2018, 3, 1));  // open: [FEB, MAR], focus: MAR
        expect(model.nextDisabled).toBeTruthy();

        service.open(new NgbDate(2018, 1, 1));  // open: [JAN, FEB], focus: JAN
        expect(model.nextDisabled).toBeFalsy();

        service.focus(new NgbDate(2018, 2, 1));  // open: [JAN, FEB], focus: FEB
        expect(model.nextDisabled).toBeFalsy();
      });
    });
  });

  describe(`outsideDays`, () => {

    it(`should emit 'outsideDays' values`, () => {
      service.focus(new NgbDate(2015, 5, 1));
      expect(model.outsideDays).toEqual('visible');

      service.outsideDays = 'hidden';
      expect(model.outsideDays).toEqual('hidden');

      service.outsideDays = 'collapsed';
      expect(model.outsideDays).toEqual('collapsed');
    });

    it(`should not emit the same 'outsideDays' value twice`, () => {
      service.focus(new NgbDate(2017, 5, 1));

      service.outsideDays = 'visible';  // ignored
      expect(mock.onNext).toHaveBeenCalledTimes(1);
    });

    it(`should not hide days when 'outsideDays' is 'visible'`, () => {
      // single month
      service.outsideDays = 'visible';
      service.focus(new NgbDate(2018, 5, 1));

      expect(getDay(0, 0).hidden).toBeFalsy();  // 30 APR
      expect(getWeek(0).collapsed).toBeFalsy();

      expect(getDay(0, 1).hidden).toBeFalsy();  // 7 MAY
      expect(getWeek(1).collapsed).toBeFalsy();

      expect(getDay(0, 5).hidden).toBeFalsy();  // 7 JUN
      expect(getWeek(5).collapsed).toBeFalsy();

      // multiple months
      // days is between two month must stay hidden regardless of outside days value
      service.displayMonths = 2;

      // MAY 2018
      expect(getDay(0, 0, 0).hidden).toBeFalsy();  // 30 APR
      expect(getWeek(0, 0).collapsed).toBeFalsy();

      expect(getDay(0, 1, 0).hidden).toBeFalsy();  // 7 MAY
      expect(getWeek(1, 0).collapsed).toBeFalsy();

      expect(getDay(0, 5, 0).hidden).toBeTruthy();  // 7 JUN
      expect(getWeek(5, 0).collapsed).toBeFalsy();

      // JUNE 2018
      expect(getDay(0, 0, 1).hidden).toBeTruthy();  // 28 MAY
      expect(getWeek(0, 1).collapsed).toBeFalsy();

      expect(getDay(0, 1).hidden).toBeFalsy();  // 4 JUN
      expect(getWeek(1, 1).collapsed).toBeFalsy();

      expect(getDay(0, 5, 1).hidden).toBeFalsy();  // 2 JUL
      expect(getWeek(5, 1).collapsed).toBeFalsy();

      // Edge case -> in between years
      service.focus(new NgbDate(2018, 12, 1));

      // DEC 2018
      expect(getDay(0, 0, 0).hidden).toBeFalsy();  // 26 NOV
      expect(getWeek(0, 0).collapsed).toBeFalsy();

      expect(getDay(0, 1, 0).hidden).toBeFalsy();  // 3 DEC
      expect(getWeek(1, 0).collapsed).toBeFalsy();

      expect(getDay(1, 5, 0).hidden).toBeTruthy();  // 1 JAN
      expect(getWeek(5, 0).collapsed).toBeFalsy();

      // JAN 2019
      expect(getDay(0, 0, 1).hidden).toBeTruthy();  // 31 DEC
      expect(getWeek(0, 1).collapsed).toBeFalsy();

      expect(getDay(0, 1).hidden).toBeFalsy();  // 7 JAN
      expect(getWeek(1, 1).collapsed).toBeFalsy();

      expect(getDay(0, 5, 1).hidden).toBeFalsy();  // 4 FEB
      expect(getWeek(5, 1).collapsed).toBeFalsy();
    });

    it(`should hide days when 'outsideDays' is 'hidden'`, () => {
      // single month
      service.outsideDays = 'hidden';
      service.focus(new NgbDate(2018, 5, 1));

      expect(getDay(0, 0).hidden).toBeTruthy();  // 30, APR
      expect(getWeek(0).collapsed).toBeFalsy();

      expect(getDay(0, 1).hidden).toBeFalsy();  // 7, MAY
      expect(getWeek(1).collapsed).toBeFalsy();

      expect(getDay(0, 5).hidden).toBeTruthy();  // 7, JUN
      expect(getWeek(5).collapsed).toBeFalsy();

      // multiple months
      service.displayMonths = 2;

      // MAY 2018
      expect(getDay(0, 0, 0).hidden).toBeTruthy();  // 30 APR
      expect(getWeek(0, 0).collapsed).toBeFalsy();

      expect(getDay(0, 1, 0).hidden).toBeFalsy();  // 7 MAY
      expect(getWeek(1, 0).collapsed).toBeFalsy();

      expect(getDay(0, 5, 0).hidden).toBeTruthy();  // 7 JUN
      expect(getWeek(5, 0).collapsed).toBeFalsy();

      // JUNE 2018
      expect(getDay(0, 0, 1).hidden).toBeTruthy();  // 28 MAY
      expect(getWeek(0, 1).collapsed).toBeFalsy();

      expect(getDay(0, 1).hidden).toBeFalsy();  // 4 JUN
      expect(getWeek(1, 1).collapsed).toBeFalsy();

      expect(getDay(0, 5, 1).hidden).toBeTruthy();  // 2 JUL
      expect(getWeek(5, 1).collapsed).toBeFalsy();
    });

    it(`should hide days when 'outsideDays' is 'collapsed'`, () => {
      // single month
      service.outsideDays = 'collapsed';
      service.focus(new NgbDate(2018, 5, 1));

      expect(getDay(0, 0).hidden).toBeTruthy();  // 30, APR
      expect(getWeek(0).collapsed).toBeFalsy();

      expect(getDay(0, 1).hidden).toBeFalsy();  // 7, MAY
      expect(getWeek(1).collapsed).toBeFalsy();

      expect(getDay(0, 5).hidden).toBeTruthy();  // 7, JUN
      expect(getWeek(5).collapsed).toBeTruthy();

      // multiple months
      service.displayMonths = 2;

      // MAY 2018
      expect(getDay(0, 0, 0).hidden).toBeTruthy();  // 30 APR
      expect(getWeek(0, 0).collapsed).toBeFalsy();

      expect(getDay(0, 1, 0).hidden).toBeFalsy();  // 7 MAY
      expect(getWeek(1, 0).collapsed).toBeFalsy();

      expect(getDay(0, 5, 0).hidden).toBeTruthy();  // 7 JUN
      expect(getWeek(5, 0).collapsed).toBeTruthy();

      // JUNE 2018
      expect(getDay(0, 0, 1).hidden).toBeTruthy();  // 28 MAY
      expect(getWeek(0, 1).collapsed).toBeFalsy();

      expect(getDay(0, 1).hidden).toBeFalsy();  // 4 JUN
      expect(getWeek(1, 1).collapsed).toBeFalsy();

      expect(getDay(0, 5, 1).hidden).toBeTruthy();  // 2 JUL
      expect(getWeek(5, 1).collapsed).toBeTruthy();
    });

    it(`should toggle days when 'outsideDays' changes`, () => {
      service.outsideDays = 'visible';
      service.focus(new NgbDate(2018, 5, 1));
      expect(getDay(0).hidden).toBeFalsy();  // 30, APR
      expect(getWeek(5).collapsed).toBeFalsy();

      service.outsideDays = 'collapsed';
      expect(getDay(0).hidden).toBeTruthy();  // 30, APR
      expect(getWeek(5).collapsed).toBeTruthy();
    });
  });

  describe(`dayTemplateData`, () => {

    it(`should not pass anything to the template by default`, () => {
      // MAY 2017
      service.focus(new NgbDate(2017, 5, 1));
      expect(getDay(0).context.data).toBeUndefined();
    });

    it(`should pass arbitrary data to the template`, () => {
      service.dayTemplateData = () => 'data';

      // MAY 2017
      service.focus(new NgbDate(2017, 5, 1));
      expect(getDay(0).context.data).toBe('data');
    });

    it(`should update months when 'dayTemplateData' changes`, () => {
      // MAY 2017
      service.dayTemplateData = () => 'one';
      service.focus(new NgbDate(2017, 5, 1));

      expect(getDay(0).context.data).toBe('one');

      service.dayTemplateData = (_) => 'two';

      expect(getDay(0).context.data).toBe('two');
    });
  });

  describe(`markDisabled`, () => {

    it(`should mark dates as disabled by passing 'markDisabled'`, () => {
      // marking 5th day of each month as disabled
      service.markDisabled = (date) => date && date.day === 5;

      // MAY 2017
      service.focus(new NgbDate(2017, 5, 1));

      const day = getDay(4);  // 5th day;
      expect(day.date).toEqual(new NgbDate(2017, 5, 5));
      expect(day.context.disabled).toBe(true);
    });

    it(`should update months when 'markDisabled changes'`, () => {
      // MAY 2017
      service.markDisabled = (_) => true;
      service.focus(new NgbDate(2017, 5, 1));

      expect(getDay(0).context.disabled).toBe(true);

      service.markDisabled = (_) => false;

      expect(getDay(0).context.disabled).toBe(false);
    });
  });

  describe(`focus handling`, () => {

    it(`should generate 1 month on 'focus()' by default`, () => {
      expect(model).toBeUndefined();

      service.focus(new NgbDate(2017, 5, 5));
      expect(model.months).toBeTruthy();
      expect(model.months.length).toBe(1);
    });

    it(`should emit new date on 'focus()'`, () => {
      const today = new NgbDate(2017, 5, 2);
      service.focus(today);
      expect(model.focusDate).toEqual(today);

      expect(mock.onNext).toHaveBeenCalledTimes(1);
    });

    it(`should ignore invalid 'focus()' values`, () => {
      service.focus(null);
      service.focus(undefined);
      service.focus(new NgbDate(-2, 0, null));

      expect(mock.onNext).not.toHaveBeenCalled();
    });

    it(`should not emit the same date twice on 'focus()'`, () => {
      service.focus(new NgbDate(2017, 5, 2));
      service.focus(new NgbDate(2017, 5, 2));

      expect(mock.onNext).toHaveBeenCalledTimes(1);
    });

    it(`should update months when focused date updates`, () => {
      service.focus(new NgbDate(2017, 5, 5));

      expect(model.months.length).toBe(1);
      expect(model.months[0].firstDate).toEqual(new NgbDate(2017, 5, 1));

      // next month
      service.focus(new NgbDate(2017, 6, 10));

      expect(model.months.length).toBe(1);
      expect(model.months[0].firstDate).toEqual(new NgbDate(2017, 6, 1));

      // next year
      service.focus(new NgbDate(2018, 6, 10));

      expect(model.months.length).toBe(1);
      expect(model.months[0].firstDate).toEqual(new NgbDate(2018, 6, 1));

      expect(mock.onNext).toHaveBeenCalledTimes(3);
    });

    it(`should move focus with 'focusMove()'`, () => {
      const date = new NgbDate(2017, 5, 5);

      // days
      service.focus(date);
      service.focusMove('d', 1);
      expect(model.focusDate).toEqual(new NgbDate(2017, 5, 6));

      service.focus(date);
      service.focusMove('d', -1);
      expect(model.focusDate).toEqual(new NgbDate(2017, 5, 4));

      // months
      service.focus(date);
      service.focusMove('m', 1);
      expect(model.focusDate).toEqual(new NgbDate(2017, 6, 1));

      service.focus(date);
      service.focusMove('m', -1);
      expect(model.focusDate).toEqual(new NgbDate(2017, 4, 1));

      // years
      service.focus(date);
      service.focusMove('y', 1);
      expect(model.focusDate).toEqual(new NgbDate(2018, 1, 1));

      service.focus(date);
      service.focusMove('y', -1);
      expect(model.focusDate).toEqual(new NgbDate(2016, 1, 1));
    });

    it(`should move focus when 'minDate' changes`, () => {
      service.focus(new NgbDate(2017, 5, 5));
      service.maxDate = new NgbDate(2017, 5, 1);
      expect(model.focusDate).toEqual(new NgbDate(2017, 5, 1));
    });

    it(`should move focus when 'maxDate' changes`, () => {
      service.focus(new NgbDate(2017, 5, 5));
      service.minDate = new NgbDate(2017, 5, 10);
      expect(model.focusDate).toEqual(new NgbDate(2017, 5, 10));
    });

    it(`should not rebuild a single month if newly focused date is visible`, () => {
      service.focus(new NgbDate(2017, 5, 5));

      expect(model.months.length).toBe(1);
      const month = model.months[0];
      const date = month.weeks[0].days[0].date;
      expect(date).toEqual(new NgbDate(2017, 5, 1));

      service.focus(new NgbDate(2017, 5, 10));
      expect(model.months[0]).toBe(month);
      expect(getDay(0).date).toBe(date);
    });

    it(`should not rebuild multiple months if newly focused date is visible`, () => {
      service.displayMonths = 2;
      service.focus(new NgbDate(2017, 5, 5));

      expect(model.months.length).toBe(2);
      const months = model.months;
      expect(months[0].firstDate).toEqual(new NgbDate(2017, 5, 1));
      expect(months[1].lastDate).toEqual(new NgbDate(2017, 6, 30));

      service.focus(new NgbDate(2017, 6, 10));
      expect(model.months.length).toBe(2);
      expect(model.months[0]).toBe(months[0]);
      expect(model.months[1]).toBe(months[1]);
    });
  });

  describe(`view change handling`, () => {

    it(`should open current month if nothing is provided`, () => {
      const today = calendar.getToday();
      service.open(null);
      expect(model.months.length).toBe(1);
      expect(model.firstDate).toEqual(new NgbDate(today.year, today.month, 1));
      expect(model.focusDate).toEqual(today);
    });

    it(`should open month and set up focus correctly`, () => {
      service.open(new NgbDate(2017, 5, 5));
      expect(model.months.length).toBe(1);
      expect(model.firstDate).toEqual(new NgbDate(2017, 5, 1));
      expect(model.focusDate).toEqual(new NgbDate(2017, 5, 5));
    });

    it(`should open month and move the focus with it`, () => {
      service.focus(new NgbDate(2017, 5, 5));
      expect(model.months.length).toBe(1);
      expect(model.focusDate).toEqual(new NgbDate(2017, 5, 5));

      // same month, same focus
      service.open(new NgbDate(2017, 5, 1));
      expect(model.focusDate).toEqual(new NgbDate(2017, 5, 5));

      // different month, moving focus along
      service.open(new NgbDate(2017, 10, 10));
      expect(model.focusDate).toEqual(new NgbDate(2017, 10, 10));
    });

    it(`should open multiple months and move focus with them`, () => {
      // MAY-JUN
      service.displayMonths = 2;
      service.focus(new NgbDate(2017, 5, 5));
      expect(model.months.length).toBe(2);
      expect(model.firstDate).toEqual(new NgbDate(2017, 5, 1));
      expect(model.focusDate).toEqual(new NgbDate(2017, 5, 5));

      // moving view to JUL-AUG
      service.open(new NgbDate(2017, 7, 10));
      expect(model.firstDate).toEqual(new NgbDate(2017, 7, 1));
      expect(model.focusDate).toEqual(new NgbDate(2017, 7, 10));

      // moving view to MAY-JUN
      service.open(new NgbDate(2017, 5, 10));
      expect(model.firstDate).toEqual(new NgbDate(2017, 5, 1));
      expect(model.focusDate).toEqual(new NgbDate(2017, 5, 10));
    });

    it(`should open multiple months and do not touch focus if it is visible`, () => {
      // MAY-JUN
      service.displayMonths = 2;
      service.focus(new NgbDate(2017, 5, 5));
      expect(model.months.length).toBe(2);
      expect(model.firstDate).toEqual(new NgbDate(2017, 5, 1));
      expect(model.focusDate).toEqual(new NgbDate(2017, 5, 5));

      // moving focus to JUN
      service.focus(new NgbDate(2017, 6, 5));
      expect(model.focusDate).toEqual(new NgbDate(2017, 6, 5));

      // moving view to JUN-JUL
      service.open(new NgbDate(2017, 6, 10));
      expect(model.firstDate).toEqual(new NgbDate(2017, 6, 1));
      expect(model.focusDate).toEqual(new NgbDate(2017, 6, 5));

      // moving view to MAY-JUN
      service.open(new NgbDate(2017, 5, 10));
      expect(model.firstDate).toEqual(new NgbDate(2017, 5, 1));
      expect(model.focusDate).toEqual(new NgbDate(2017, 6, 5));
    });

    it(`should reuse existing months when opening`, () => {
      service.focus(new NgbDate(2017, 5, 5));
      expect(model.months.length).toBe(1);
      const month = model.months[0];
      const date = month.weeks[0].days[0].date;
      expect(date).toEqual(new NgbDate(2017, 5, 1));

      service.open(new NgbDate(2017, 5, 10));
      expect(model.months.length).toBe(1);
      expect(model.months[0]).toBe(month);
      expect(getDay(0).date).toBe(date);
    });
  });

  describe(`selection handling`, () => {

    it(`should generate months for initial selection`, () => {
      const date = new NgbDate(2017, 5, 5);
      service.select(date);
      expect(model.months.length).toBe(1);
      expect(model.selectedDate).toEqual(date);
    });

    it(`should select currently focused date with 'focusSelect()'`, () => {
      const date = new NgbDate(2017, 5, 5);
      service.focus(date);
      expect(model.selectedDate).toBeNull();
      expect(selectDate).toBeNull();

      service.focusSelect();
      expect(model.selectedDate).toEqual(date);
      expect(selectDate).toEqual(date);

      expect(mockSelect.onNext).toHaveBeenCalledTimes(1);
    });

    it(`should not select disabled dates with 'focusSelect()'`, () => {
      // marking 5th day of each month as disabled
      service.markDisabled = (d) => d && d.day === 5;

      // focusing MAY, 5
      const date = new NgbDate(2017, 5, 5);
      service.focus(date);
      expect(model.focusDate).toEqual(date);
      expect(model.selectedDate).toBeNull();
      expect(selectDate).toBeNull();

      service.focusSelect();
      expect(model.selectedDate).toBeNull();
      expect(selectDate).toBeNull();

      expect(mockSelect.onNext).not.toHaveBeenCalled();
    });

    it(`should not emit selection event by default`, () => {
      const date = new NgbDate(2017, 5, 5);
      service.select(date);
      expect(mockSelect.onNext).not.toHaveBeenCalled();
    });

    it(`should not emit selection event for null values`, () => {
      const date = new NgbDate(2017, 5, 5);
      service.select(null, {emitEvent: true});

      expect(mockSelect.onNext).not.toHaveBeenCalled();
    });

    it(`should emit date selection event'`, () => {
      const date = new NgbDate(2017, 5, 5);
      service.focus(date);
      expect(model.selectedDate).toBeNull();
      expect(selectDate).toBeNull();

      service.select(date, {emitEvent: true});
      expect(model.selectedDate).toEqual(date);
      expect(selectDate).toEqual(date);

      expect(mockSelect.onNext).toHaveBeenCalledTimes(1);
    });

    it(`should emit date selection event for non-visible dates'`, () => {
      const date = new NgbDate(2017, 5, 5);
      service.focus(date);
      expect(model.selectedDate).toBeNull();
      expect(selectDate).toBeNull();

      let invisibleDate = new NgbDate(2016, 5, 5);
      service.select(invisibleDate, {emitEvent: true});
      expect(model.selectedDate).toEqual(invisibleDate);
      expect(selectDate).toEqual(invisibleDate);

      expect(mockSelect.onNext).toHaveBeenCalledTimes(1);
    });

    it(`should not emit date selection event for disabled dates'`, () => {
      // marking 5th day of each month as disabled
      service.markDisabled = (d) => d && d.day === 5;

      // focusing MAY, 5
      const date = new NgbDate(2017, 5, 5);
      service.focus(date);
      expect(model.selectedDate).toBeNull();
      expect(selectDate).toBeNull();

      service.select(date, {emitEvent: true});
      expect(model.selectedDate).toBeNull();
      expect(selectDate).toBeNull();

      expect(mockSelect.onNext).not.toHaveBeenCalled();
    });

    it(`should emit date selection event when focusing on the same date twice`, () => {
      const date = new NgbDate(2017, 5, 5);
      service.focus(date);

      service.focusSelect();
      service.focusSelect();

      expect(mockSelect.onNext).toHaveBeenCalledTimes(2);
    });

    it(`should emit date selection event when selecting the same date twice`, () => {
      const date = new NgbDate(2017, 5, 5);
      service.focus(date);

      service.select(date, {emitEvent: true});
      service.select(date, {emitEvent: true});

      expect(mockSelect.onNext).toHaveBeenCalledTimes(2);
    });
  });

  describe(`template context`, () => {

    it(`should generate 'date' for day template`, () => {
      service.focus(new NgbDate(2017, 5, 1));
      expect(getDayCtx(0).date).toEqual(new NgbDate(2017, 5, 1));
      expect(getDayCtx(1).date).toEqual(new NgbDate(2017, 5, 2));

      service.focus(new NgbDate(2017, 10, 1));
      expect(getDayCtx(0).date).toEqual(new NgbDate(2017, 9, 25));
      expect(getDayCtx(1).date).toEqual(new NgbDate(2017, 9, 26));
    });

    it(`should generate 'currentMonth' for day template`, () => {
      service.focus(new NgbDate(2017, 5, 1));
      expect(getDayCtx(0).currentMonth).toBe(5);

      service.focus(new NgbDate(2017, 10, 1));
      expect(getDayCtx(0).currentMonth).toBe(10);
    });

    it(`should update 'focused' flag and tabindex for day template`, () => {
      // off
      service.focus(new NgbDate(2017, 5, 1));
      expect(getDayCtx(0).focused).toBeFalsy();
      expect(getDayCtx(1).focused).toBeFalsy();
      expect(getDay(0).tabindex).toEqual(0);
      expect(getDay(1).tabindex).toEqual(-1);

      // on
      service.focusVisible = true;
      expect(getDayCtx(0).focused).toBeTruthy();
      expect(getDayCtx(1).focused).toBeFalsy();
      expect(getDay(0).tabindex).toEqual(0);
      expect(getDay(1).tabindex).toEqual(-1);

      // move
      service.focusMove('d', 1);
      expect(getDayCtx(0).focused).toBeFalsy();
      expect(getDayCtx(1).focused).toBeTruthy();
      expect(getDay(0).tabindex).toEqual(-1);
      expect(getDay(1).tabindex).toEqual(0);

      // off
      service.focusVisible = false;
      expect(getDayCtx(0).focused).toBeFalsy();
      expect(getDayCtx(1).focused).toBeFalsy();
      expect(getDay(0).tabindex).toEqual(-1);
      expect(getDay(1).tabindex).toEqual(0);
    });

    it(`should update 'selected' flag for day template`, () => {
      // off
      service.focus(new NgbDate(2017, 5, 1));
      expect(getDayCtx(0).selected).toBeFalsy();
      expect(getDayCtx(1).selected).toBeFalsy();

      // select
      service.focusSelect();
      expect(getDayCtx(0).selected).toBeTruthy();
      expect(getDayCtx(1).selected).toBeFalsy();

      // move
      service.select(new NgbDate(2017, 5, 2));
      expect(getDayCtx(0).selected).toBeFalsy();
      expect(getDayCtx(1).selected).toBeTruthy();

      // off
      service.select(null);
      expect(getDayCtx(0).selected).toBeFalsy();
      expect(getDayCtx(1).selected).toBeFalsy();
    });

    it(`should update 'disabled' flag for day template`, () => {
      // off
      service.focus(new NgbDate(2017, 5, 1));
      expect(getDayCtx(0).disabled).toBeFalsy();
      expect(getDayCtx(1).disabled).toBeFalsy();

      // marking 2nd day of each month as disabled
      service.markDisabled = (date) => date && date.day === 2;
      expect(getDayCtx(0).disabled).toBeFalsy();
      expect(getDayCtx(1).disabled).toBeTruthy();

      // global disabled on
      service.disabled = true;
      expect(getDayCtx(0).disabled).toBeTruthy();
      expect(getDayCtx(1).disabled).toBeTruthy();

      // global disabled on
      service.disabled = false;
      expect(getDayCtx(0).disabled).toBeFalsy();
      expect(getDayCtx(1).disabled).toBeTruthy();
    });
  });

  describe('toValidDate()', () => {

    it('should convert a valid NgbDate', () => {
      expect(service.toValidDate(new NgbDate(2016, 10, 5))).toEqual(new NgbDate(2016, 10, 5));
      expect(service.toValidDate({year: 2016, month: 10, day: 5})).toEqual(new NgbDate(2016, 10, 5));
    });

    it('should return today for an invalid NgbDate', () => {
      const today = calendar.getToday();
      expect(service.toValidDate(null)).toEqual(today);
      expect(service.toValidDate(<any>{})).toEqual(today);
      expect(service.toValidDate(undefined)).toEqual(today);
      expect(service.toValidDate(<any>new Date())).toEqual(today);
      expect(service.toValidDate(new NgbDate(275760, 9, 14))).toEqual(today);
    });

    it('should return today if default value is undefined',
       () => { expect(service.toValidDate(null, undefined)).toEqual(calendar.getToday()); });

    it('should return default value for an invalid NgbDate if provided', () => {
      expect(service.toValidDate(null, new NgbDate(1066, 6, 6))).toEqual(new NgbDate(1066, 6, 6));
      expect(service.toValidDate(null, null)).toEqual(null);
    });
  });
});
