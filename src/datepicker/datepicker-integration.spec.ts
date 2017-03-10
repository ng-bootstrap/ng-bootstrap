import {TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {NgbDatepickerModule} from './datepicker.module';
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

  it('should allow overriding datepicker i18n', () => {

    const MONTHS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

    class AlphabetMonthsI18n extends NgbDatepickerI18nDefault {
      getMonthShortName(month: number) { return MONTHS[month - 1]; }
    }

    TestBed.overrideComponent(TestComponent, {
      set: {
        template: `<ngb-datepicker></ngb-datepicker>`,
        providers: [{provide: NgbDatepickerI18n, useClass: AlphabetMonthsI18n}]
      }
    });
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const monthOptionsText =
        Array.from(getMonthSelect(fixture.nativeElement).querySelectorAll('option')).map(o => o.innerHTML);

    expect(monthOptionsText).toEqual(MONTHS);
  });
});

@Component({selector: 'test-cmp', template: ''})
class TestComponent {
}
