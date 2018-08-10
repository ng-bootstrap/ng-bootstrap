import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {NgbDatepickerModule, NgbDateStruct} from './datepicker.module';
import {NgbCalendar, NgbCalendarGregorian} from './ngb-calendar';
import {NgbDate} from './ngb-date';
import {getMonthSelect, getYearSelect} from '../test/datepicker/common';
import {NgbDatepickerI18n, NgbDatepickerI18nDefault} from './datepicker-i18n';

describe('ngb-datepicker integration', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [TestComponent], imports: [NgbDatepickerModule.forRoot()]});
  });

  it('should allow overriding datepicker calendar', () => {

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

    class CustomI18n extends NgbDatepickerI18nDefault {
      // alphabetic months: Jan -> A, Feb -> B, etc
      getMonthShortName(month: number) { return ALPHABET[month - 1]; }

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
      expect(weekNumbers.join('')).toEqual(ALPHABET.slice(0, 6));
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
  });
});

@Component({selector: 'test-cmp', template: ''})
class TestComponent {
}
