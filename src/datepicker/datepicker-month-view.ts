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
    .ngb-dp-weekday {
      color: #5bc0de;
    }
    .ngb-dp-week {
        border-radius: 0.25rem;
        display: flex;
    }
    .ngb-dp-weekdays {
      border-bottom: 1px solid rgba(0, 0, 0, 0.125);
      border-radius: 0rem;
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
    <div *ngIf="showWeekdays" class="ngb-dp-week ngb-dp-weekdays bg-light">
      <div *ngIf="showWeekNumbers" class="ngb-dp-weekday ngb-dp-showweek"></div>
      <div *ngFor="let w of month.weekdays" class="ngb-dp-weekday small text-center font-italic">
        {{ i18n.getWeekdayShortName(w) }}
      </div>
    </div>
    <ng-template ngFor let-week [ngForOf]="month.weeks">
      <div *ngIf="!isCollapsed(week)" class="ngb-dp-week">
        <div *ngIf="showWeekNumbers" class="ngb-dp-week-number small text-center font-italic text-muted">{{ week.number }}</div>
        <div *ngFor="let day of week.days" (click)="doSelect(day)" class="ngb-dp-day" [class.disabled]="day.context.disabled"
         [class.hidden]="isHidden(day)">
          <ng-template [ngIf]="!isHidden(day)">
            <ng-template [ngTemplateOutlet]="dayTemplate" [ngTemplateOutletContext]="day.context"></ng-template>
          </ng-template>
        </div>
      </div>
    </ng-template>
  `
})
export class NgbDatepickerMonthView {
  @Input() dayTemplate: TemplateRef<DayTemplateContext>;
  @Input() month: MonthViewModel;
  @Input() outsideDays: 'visible' | 'hidden' | 'collapsed';
  @Input() showWeekdays;
  @Input() showWeekNumbers;

  @Output() select = new EventEmitter<NgbDate>();

  constructor(public i18n: NgbDatepickerI18n) {}

  doSelect(day: DayViewModel) {
    if (!day.context.disabled && !this.isHidden(day)) {
      this.select.emit(NgbDate.from(day.date));
    }
  }

  isCollapsed(week: WeekViewModel) {
    return this.outsideDays === 'collapsed' && week.days[0].date.month !== this.month.number &&
        week.days[week.days.length - 1].date.month !== this.month.number;
  }

  isHidden(day: DayViewModel) {
    return (this.outsideDays === 'hidden' || this.outsideDays === 'collapsed') && this.month.number !== day.date.month;
  }
}
