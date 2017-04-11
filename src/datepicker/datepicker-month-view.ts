import {Component, Input, TemplateRef, Output, EventEmitter} from '@angular/core';
import {MonthViewModel, DayViewModel, WeekViewModel} from './datepicker-view-model';
import {NgbDate} from './ngb-date';
import {NgbDatepickerI18n} from './datepicker-i18n';
import {DayTemplateContext} from './datepicker-day-template-context';

@Component({
  selector: 'ngb-datepicker-month-view',
  host: {'class': 'd-block'},
  styles: [`
    .ngb-dp-weekday, .ngb-dp-week-number {
      line-height: 2rem;
    }
    .ngb-dp-day, .ngb-dp-weekday, .ngb-dp-week-number {
      width: 2rem;
      height: 2rem;      
    }
    .ngb-dp-day {
      cursor: pointer;
    }
    .ngb-dp-day.disabled, .ngb-dp-day.hidden {
      cursor: default;
    }
  `],
  template: `
    <table>
      <thead *ngIf="showWeekdays">
        <tr class="ngb-dp-week d-flex">
          <th *ngIf="showWeekNumbers" scope="col" class="ngb-dp-weekday"></th>
          <th scope="col" *ngFor="let w of month.weekdays" class="ngb-dp-weekday small text-center text-info font-italic">
            {{ i18n.getWeekdayShortName(w) }}
          </th>
        </tr>
      </thead>
      <tbody>
        <template ngFor let-week [ngForOf]="month.weeks">
          <tr *ngIf="!isCollapsed(week)" class="ngb-dp-week d-flex">
              <th scope="row" *ngIf="showWeekNumbers"
                  class="ngb-dp-week-number small text-center font-italic text-muted">{{ week.number }}</th>
              <td *ngFor="let day of week.days" (click)="doSelect(day)" class="ngb-dp-day" [class.disabled]="isDisabled(day)"
                  [class.hidden]="isHidden(day)" [attr.aria-disabled]="isDisabled(day)"
                  [attr.aria-selected]="!!isSelected(day.date)">
                <template [ngIf]="!isHidden(day)">
                  <template [ngTemplateOutlet]="dayTemplate"
                            [ngOutletContext]="{date: {year: day.date.year, month: day.date.month, day: day.date.day},
                      currentMonth: month.number,
                      disabled: isDisabled(day),
                      selected: isSelected(day.date)}">
                  </template>
                </template>
              </td>
            </tr>
        </template>
      </tbody>
    </table>
  `
})
export class NgbDatepickerMonthView {
  @Input() dayTemplate: TemplateRef<DayTemplateContext>;
  @Input() disabled: boolean;
  @Input() month: MonthViewModel;
  @Input() outsideDays: 'visible' | 'hidden' | 'collapsed';
  @Input() selectedDate: NgbDate;
  @Input() showWeekdays;
  @Input() showWeekNumbers;

  @Output() select = new EventEmitter<NgbDate>();

  constructor(public i18n: NgbDatepickerI18n) {}

  doSelect(day: DayViewModel) {
    if (!this.isDisabled(day) && !this.isHidden(day)) {
      this.select.emit(NgbDate.from(day.date));
    }
  }

  isDisabled(day: DayViewModel) { return this.disabled || day.disabled; }

  isSelected(date: NgbDate) { return this.selectedDate && this.selectedDate.equals(date); }

  isCollapsed(week: WeekViewModel) {
    return this.outsideDays === 'collapsed' && week.days[0].date.month !== this.month.number &&
        week.days[week.days.length - 1].date.month !== this.month.number;
  }

  isHidden(day: DayViewModel) {
    return (this.outsideDays === 'hidden' || this.outsideDays === 'collapsed') && this.month.number !== day.date.month;
  }
}
