import {Component, Input, TemplateRef, Output, EventEmitter} from '@angular/core';
import {MonthViewModel, DayViewModel} from './datepicker-view-model';
import {NgbDate} from './ngb-date';
import {NgbDatepickerI18n} from './datepicker-i18n';
import {DayTemplateContext} from './datepicker-day-template-context';

@Component({
  selector: '[ngbDatepickerMonthView]',
  styles: [`
    .weekday {
      padding-bottom: 0.25rem;
    }
    .weeknumber {    
    }
    .day {
      padding: 0;
      height: 100%;
      cursor: pointer;
    }
    .day.disabled {
      cursor: not-allowed;
    }
  `],
  template: `
    <tr *ngIf="showWeekdays">
      <td *ngIf="showWeekNumbers"></td>
      <td *ngFor="let w of month.weekdays" class="weekday text-xs-center font-weight-bold">{{ i18n.getWeekdayName(w) }}</td>
    </tr>
    <tr *ngFor="let week of month.weeks">
      <td *ngIf="showWeekNumbers" class="weeknumber small text-xs-center">{{ week.number }}</td>
      <td *ngFor="let day of week.days" (click)="doSelect(day)" class="day" [class.disabled]="isDisabled(day)">
        <template [ngTemplateOutlet]="dayTemplate" 
        [ngOutletContext]="{date: {year: day.date.year, month: day.date.month, day: day.date.day}, 
          currentMonth: month.number, 
          disabled: isDisabled(day), 
          selected: isSelected(day.date)}">
        </template>
      </td>                
    </tr>
  `
})
export class NgbDatepickerMonthView {
  @Input() dayTemplate: TemplateRef<DayTemplateContext>;
  @Input() disabled: boolean;
  @Input() month: MonthViewModel;
  @Input() selectedDate: NgbDate;
  @Input() showWeekdays;
  @Input() showWeekNumbers;

  @Output() select = new EventEmitter<NgbDate>();

  constructor(public i18n: NgbDatepickerI18n) {}

  doSelect(day: DayViewModel) {
    if (!this.isDisabled(day)) {
      this.select.emit(NgbDate.from(day.date));
    }
  }

  isDisabled(day) { return this.disabled || day.disabled; }

  isSelected(date: NgbDate) { return this.selectedDate && this.selectedDate.equals(date); }
}
