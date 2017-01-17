import {Component, Input, TemplateRef, Output, EventEmitter} from '@angular/core';
import {MonthViewModel, DayViewModel} from './datepicker-view-model';
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
    .ngb-dp-day.disabled, .ngb-dp-day.hidden, .ngb-dp-day.collapsed {
      cursor: default;
    }
    :host/deep/.ngb-dp-day.collapsed > * {
      display: none;
    }
    :host/deep/.ngb-dp-day.hidden > * {
      visibility: hidden;
    }
  `],
  template: `
    <div *ngIf="showWeekdays" class="ngb-dp-week d-flex">
      <div *ngIf="showWeekNumbers" class="ngb-dp-weekday"></div>
      <div *ngFor="let w of month.weekdays" class="ngb-dp-weekday small text-center text-info font-italic">
        {{ i18n.getWeekdayShortName(w) }}
      </div>
    </div>
    <div *ngFor="let week of month.weeks" class="ngb-dp-week d-flex">
      <div *ngIf="showWeekNumbers" class="ngb-dp-week-number small text-center font-italic text-muted">{{ week.number }}</div>
      <div *ngFor="let day of week.days" (click)="doSelect(day)" class="ngb-dp-day" [class.disabled]="isDisabled(day)"
      [class.collapsed]="isCollapsed(day)" [class.hidden]="isHidden(day)">
          <template [ngTemplateOutlet]="dayTemplate"
          [ngOutletContext]="{date: {year: day.date.year, month: day.date.month, day: day.date.day},
            currentMonth: month.number,
            disabled: isDisabled(day),
            selected: isSelected(day.date)}">
          </template>
      </div>
    </div>
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
    if (!this.isDisabled(day) && !this.isCollapsed(day) && !this.isHidden(day)) {
      this.select.emit(NgbDate.from(day.date));
    }
  }

  isDisabled(day: DayViewModel) { return this.disabled || day.disabled; }

  isSelected(date: NgbDate) { return this.selectedDate && this.selectedDate.equals(date); }

  isCollapsed(day: DayViewModel) { return this.outsideDays === 'collapsed' && this.month.number !== day.date.month; }

  isHidden(day: DayViewModel) { return this.outsideDays === 'hidden' && this.month.number !== day.date.month; }
}
