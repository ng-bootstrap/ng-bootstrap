import {TestBed, inject} from '@angular/core/testing';

import {NgbCalendar, NgbCalendarGregorian} from './ngb-calendar';
import {NgbDate} from './ngb-date';
import {NgbDatepickerI18n} from './datepicker-i18n';
import {NgbDatepickerService} from './datepicker-service';

class MockCalendar extends NgbCalendarGregorian {
  getDaysPerWeek(): number { return 1; }

  getWeeksPerMonth(): number { return 1; }

  getWeekday(date: NgbDate): number { return 1; }

  getWeekNumber(week: NgbDate[], firstDayOfWeek: number): number { return 1; }

  getNext(date: NgbDate, period = 'd'): NgbDate { return new NgbDate(2000, 0, 1); }

  getPrev(date: NgbDate, period = 'd'): NgbDate { return new NgbDate(2000, 2, 1); }

  getToday(): NgbDate { return new NgbDate(2000, 1, 1); }

  isValid(date: NgbDate): boolean { return true; }
}

describe('ngb-datepicker-service', () => {

  beforeEach(() => {
    TestBed.configureTestingModule(
        {providers: [NgbDatepickerI18n, NgbDatepickerService, {provide: NgbCalendar, useClass: MockCalendar}]});
  });

  it('should generate month view model', inject([NgbDatepickerService, NgbCalendar], (service, calendar) => {
       const monthViewModel = service.generateMonthViewModel(
           calendar.getToday(), new NgbDate(2000, 0, 1), new NgbDate(2000, 2, 1), 1, null);
       expect(monthViewModel).toEqual({
         number: 1,
         year: 2000,
         firstDate: new NgbDate(2000, 1, 1),
         weeks: [{number: 1, days: [{date: new NgbDate(2000, 1, 1), disabled: false}]}],
         weekdays: [1]
       });
     }));

  it('should mark dates out of min/max bounds as disabled',
     inject([NgbDatepickerService, NgbCalendar], (service, calendar) => {
       let monthViewModel = service.generateMonthViewModel(
           calendar.getToday(), new NgbDate(2000, 2, 1), new NgbDate(2000, 2, 10), 1, null);
       expect(monthViewModel).toEqual({
         number: 1,
         year: 2000,
         firstDate: new NgbDate(2000, 1, 1),
         weeks: [{number: 1, days: [{date: new NgbDate(2000, 1, 1), disabled: true}]}],
         weekdays: [1]
       });

       monthViewModel = service.generateMonthViewModel(
           calendar.getToday(), new NgbDate(2000, 0, 1), new NgbDate(2000, 0, 10), 1, null);
       expect(monthViewModel).toEqual({
         number: 1,
         year: 2000,
         firstDate: new NgbDate(2000, 1, 1),
         weeks: [{number: 1, days: [{date: new NgbDate(2000, 1, 1), disabled: true}]}],
         weekdays: [1]
       });
     }));

  it('should mark dates out of min/max bounds as disabled',
     inject([NgbDatepickerService, NgbCalendar], (service, calendar) => {
       let monthViewModel = service.generateMonthViewModel(
           calendar.getToday(), new NgbDate(2000, 0, 1), new NgbDate(2000, 1, 10), 1, () => true);
       expect(monthViewModel).toEqual({
         number: 1,
         year: 2000,
         firstDate: new NgbDate(2000, 1, 1),
         weeks: [{number: 1, days: [{date: new NgbDate(2000, 1, 1), disabled: true}]}],
         weekdays: [1]
       });
     }));

  it('markDisabled callback should not override date bounds',
     inject([NgbDatepickerService, NgbCalendar], (service, calendar) => {
       let monthViewModel = service.generateMonthViewModel(
           calendar.getToday(), new NgbDate(2000, 0, 1), new NgbDate(2000, 0, 10), 1, () => false);
       expect(monthViewModel).toEqual({
         number: 1,
         year: 2000,
         firstDate: new NgbDate(2000, 1, 1),
         weeks: [{number: 1, days: [{date: new NgbDate(2000, 1, 1), disabled: true}]}],
         weekdays: [1]
       });
     }));

  it('markDisabled should pass the correct year and month',
     inject([NgbDatepickerService, NgbCalendar], (service, calendar) => {

       let result;

       const markDisabled = (date, current) => {
         result = current;
         return false;
       };

       service.generateMonthViewModel(
           new NgbDate(2016, 10, 10), new NgbDate(2000, 0, 1), new NgbDate(2020, 0, 10), 1, markDisabled);
       expect(result).toEqual({month: 10, year: 2016});
     }));

  describe('toValidDate() for Gregorian Calendar', () => {

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [NgbDatepickerI18n, NgbDatepickerService, {provide: NgbCalendar, useClass: NgbCalendarGregorian}]
      });
    });

    it('should convert a valid NgbDate', inject([NgbDatepickerService], (service) => {
         expect(service.toValidDate(new NgbDate(2016, 10, 5))).toEqual(new NgbDate(2016, 10, 5));
         expect(service.toValidDate({year: 2016, month: 10, day: 5})).toEqual(new NgbDate(2016, 10, 5));
         expect(service.toValidDate(new NgbDate(999, 999, 999))).toEqual(new NgbDate(999, 999, 999));
       }));

    it('should return today for an invalid NgbDate',
       inject([NgbDatepickerService, NgbCalendar], (service, calendar) => {
         const today = calendar.getToday();
         expect(service.toValidDate(null)).toEqual(today);
         expect(service.toValidDate({})).toEqual(today);
         expect(service.toValidDate(undefined)).toEqual(today);
         expect(service.toValidDate(new Date())).toEqual(today);
       }));

    it('should return today if default value is undefined',
       inject([NgbDatepickerService, NgbCalendar], (service, calendar) => {
         expect(service.toValidDate(null, undefined)).toEqual(calendar.getToday());
       }));

    it('should return default value for an invalid NgbDate if provided', inject([NgbDatepickerService], (service) => {
         expect(service.toValidDate(null, new NgbDate(1066, 6, 6))).toEqual(new NgbDate(1066, 6, 6));
         expect(service.toValidDate(null, null)).toEqual(null);
       }));
  });

});
