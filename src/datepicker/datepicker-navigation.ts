import {Component, Input, Output, EventEmitter} from '@angular/core';
import {NavigationEvent} from './datepicker-view-model';
import {NgbDate} from './ngb-date';
import {NgbDatepickerI18n} from './datepicker-i18n';
import {NgbCalendar} from './ngb-calendar';

@Component({
  selector: '[ngbDatepickerNavigation]',
  styles: [`
    td {
      text-align: center;
      padding-bottom: 0.25rem;
    }
  `],
  template: `
    <tr>
      <td>
        <button (click)="doNavigate(navigation.PREV)" class="btn btn-sm btn-secondary btn-block" [disabled]="prevDisabled()">&lt;</button>
      </td>
      <td [attr.colspan]="showWeekNumbers ? 6 : 5">      
        <ngb-datepicker-navigation-select *ngIf="type === 'select'"
          [date]="date"
          [minYear]="minDate.year"
          [maxYear]="maxDate.year"
          (select)="selectDate($event)">
        </ngb-datepicker-navigation-select>
      </td>
      <td>
        <button (click)="doNavigate(navigation.NEXT)" class="btn btn-sm btn-secondary btn-block" [disabled]="nextDisabled()">&gt;</button>
      </td>
    </tr>
  `
})
export class NgbDatepickerNavigation {
  navigation = NavigationEvent;

  @Input() date: NgbDate;
  @Input() maxDate: NgbDate;
  @Input() minDate: NgbDate;
  @Input() showWeekNumbers: boolean;
  @Input() type = 'select';

  @Output() navigate = new EventEmitter<NavigationEvent>();
  @Output() select = new EventEmitter<NgbDate>();

  constructor(public i18n: NgbDatepickerI18n, private _calendar: NgbCalendar) {}

  doNavigate(event: NavigationEvent) { this.navigate.emit(event); }

  nextDisabled() { return !this.maxDate ? false : this._calendar.getNext(this.date, 'm').after(this.maxDate); }

  prevDisabled() { return !this.minDate ? false : this._calendar.getPrev(this.date, 'm').before(this.minDate); }

  selectDate(date: NgbDate) { this.select.emit(date); }
}
