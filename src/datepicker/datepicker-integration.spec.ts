import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Component, Injectable, Type} from '@angular/core';
import {By} from '@angular/platform-browser';
import {NgbDatepickerModule, NgbDateStruct} from './datepicker.module';
import {NgbCalendar, NgbCalendarGregorian} from './ngb-calendar';
import {NgbDate} from './ngb-date';
import {getMonthSelect, getYearSelect} from '../test/datepicker/common';
import {NgbDatepickerI18n, NgbDatepickerI18nDefault} from './datepicker-i18n';
import {NgbDatepicker} from './datepicker';
import {NgbDatepickerKeyboardService} from './datepicker-keyboard-service';
import {Key} from '../util/key';

describe('ngb-datepicker integration', () => {

  beforeEach(
      () => { TestBed.configureTestingModule({declarations: [TestComponent], imports: [NgbDatepickerModule]}); });

  it('should allow overriding datepicker calendar', () => {

    @Injectable()
    class FixedTodayCalendar extends NgbCalendarGregorian {
      getToday() { return new NgbDate(2000, 7, 1); }
    }

    TestBed.overrideComponent(TestComponent, {
      set: {
        template: `<ngb-datepicker></ngb-datepicker>`,
        providers: [{provide: NgbCalendar, useClass: FixedTodayCalendar}]
      }
    });
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    expect(getMonthSelect(fixture.nativeElement).value).toBe('7');
    expect(getYearSelect(fixture.nativeElement).value).toBe('2000');
  });

  describe('i18n', () => {

    const ALPHABET = 'ABCDEFGHIJKLMNOPRSTQUVWXYZ';

    @Injectable()
    class CustomI18n extends NgbDatepickerI18nDefault {
      // alphabetic months: Jan -> A, Feb -> B, etc
      getMonthShortName(month: number) { return ALPHABET[month - 1]; }

      // alphabetic months: Jan -> A, Feb -> B, etc
      getMonthFullName(month: number) { return ALPHABET[month - 1]; }

      // alphabetic days: 1 -> A, 2 -> B, etc
      getDayNumerals(date: NgbDateStruct) { return ALPHABET[date.day - 1]; }

      // alphabetic week numbers: 1 -> A, 2 -> B, etc
      getWeekNumerals(week: number) { return ALPHABET[week - 1]; }

      // reversed years: 1998 -> 9881
      getYearNumerals(year: number) { return `${year}`.split('').reverse().join(''); }
    }

    let fixture: ComponentFixture<TestComponent>;

    beforeEach(() => {
      TestBed.overrideComponent(TestComponent, {
        set: {
          template: `
            <ngb-datepicker [startDate]="{year: 2018, month: 1}"
                            [minDate]="{year: 2017, month: 1, day: 1}"
                            [maxDate]="{year: 2019, month: 12, day: 31}"
                            [showWeekNumbers]="true"
                            [displayMonths]="2"
            ></ngb-datepicker>`,
          providers: [{provide: NgbDatepickerI18n, useClass: CustomI18n}]
        }
      });

      fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
    });

    it('should allow overriding month names', () => {
      const monthOptions = getMonthSelect(fixture.nativeElement).querySelectorAll('option');
      const months = Array.from(monthOptions).map(o => o.innerHTML);
      expect(months.join('')).toEqual(ALPHABET.slice(0, 12));
    });

    it('should allow overriding week number numerals', () => {
      // month view that displays JAN 2018 starts directly with week 01
      const weekNumberElements = fixture.nativeElement.querySelectorAll('.ngb-dp-week-number');
      const weekNumbers = Array.from(weekNumberElements).map((o: HTMLElement) => o.innerHTML);
      expect(weekNumbers.slice(0, 6).join('')).toEqual(ALPHABET.slice(0, 6));
    });

    it('should allow overriding day numerals', () => {
      // month view that displays JAN 2018 starts directly with 01 JAN
      const daysElements = fixture.nativeElement.querySelectorAll('.ngb-dp-day > div');
      const days = Array.from(daysElements).map((o: HTMLElement) => o.innerHTML);
      expect(days.slice(0, 26).join('')).toEqual(ALPHABET);
    });

    it('should allow overriding year numerals', () => {
      // we have only 2017, 2018 and 2019 in the select box
      const yearOptions = getYearSelect(fixture.nativeElement).querySelectorAll('option');
      const years = Array.from(yearOptions).map(o => o.innerText);
      expect(years).toEqual(['7102', '8102', '9102']);
    });

    it('should allow overriding year and month numerals for multiple months', () => {
      // we have JAN 2018 and FEB 2018 -> A 8102 and B 8102
      const monthNameElements = fixture.nativeElement.querySelectorAll('.ngb-dp-month-name');
      const monthNames = Array.from(monthNameElements).map((o: HTMLElement) => o.innerText.trim());
      expect(monthNames).toEqual(['A 8102', 'B 8102']);
    });
  });

  describe('keyboard service', () => {

    @Injectable()
    class CustomKeyboardService extends NgbDatepickerKeyboardService {
      processKey(event: KeyboardEvent, service: NgbDatepicker, calendar: NgbCalendar) {
        const state = service.state;
        // tslint:disable-next-line:deprecation
        switch (event.which) {
          case Key.PageUp:
            service.focusDate(calendar.getPrev(state.focusedDate, event.altKey ? 'y' : 'm', 1));
            break;
          case Key.PageDown:
            service.focusDate(calendar.getNext(state.focusedDate, event.altKey ? 'y' : 'm', 1));
            break;
          default:
            super.processKey(event, service, calendar);
            return;
        }
        event.preventDefault();
        event.stopPropagation();
      }
    }

    let fixture: ComponentFixture<TestComponent>;
    let dp: NgbDatepicker;
    let ngbCalendar: NgbCalendar;
    let startDate: NgbDateStruct = new NgbDate(2018, 1, 1);

    beforeEach(() => {
      TestBed.overrideComponent(TestComponent, {
        set: {
          template: `
            <ngb-datepicker [startDate]="{year: 2018, month: 1}" [displayMonths]="1"></ngb-datepicker>`,
          providers: [{provide: NgbDatepickerKeyboardService, useClass: CustomKeyboardService}]
        }
      });

      fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();

      dp = fixture.debugElement.query(By.css('ngb-datepicker')).injector.get(NgbDatepicker);
      ngbCalendar = fixture.debugElement.query(By.css('ngb-datepicker')).injector.get(NgbCalendar as Type<NgbCalendar>);

      spyOn(ngbCalendar, 'getPrev');
    });

    it('should allow customize keyboard navigation', () => {
      dp.onKeyDown(<any>{which: Key.PageUp, altKey: true, preventDefault: () => {}, stopPropagation: () => {}});
      expect(ngbCalendar.getPrev).toHaveBeenCalledWith(startDate, 'y', 1);
      dp.onKeyDown(<any>{which: Key.PageUp, shiftKey: true, preventDefault: () => {}, stopPropagation: () => {}});
      expect(ngbCalendar.getPrev).toHaveBeenCalledWith(startDate, 'm', 1);
    });

    it('should allow access to default keyboard navigation', () => {
      dp.onKeyDown(<any>{which: Key.ArrowUp, altKey: true, preventDefault: () => {}, stopPropagation: () => {}});
      expect(ngbCalendar.getPrev).toHaveBeenCalledWith(startDate, 'd', 7);
    });
  });
});

@Component({selector: 'test-cmp', template: ''})
class TestComponent {
}
