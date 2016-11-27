import {Component, Input, Output, EventEmitter} from '@angular/core';
import {NavigationEvent} from './datepicker-view-model';
import {NgbDate} from './ngb-date';
import {NgbDatepickerI18n} from './datepicker-i18n';
import {NgbCalendar} from './ngb-calendar';

@Component({
  selector: 'ngb-datepicker-navigation',
  styles: [`
    .collapsed {
        margin-bottom: -1.7rem;
    }
  `],
  template: `
    <table class="w-100" [class.collapsed]="!showSelect">
      <tr>
        <td class="text-sm-left">
          <button type="button" (click)="doNavigate(navigation.PREV)" class="btn btn-sm btn-secondary btn-inline" 
            [disabled]="prevDisabled()">&lt;</button>
        </td>
        
        <td *ngIf="showSelect">
          <ngb-datepicker-navigation-select
            [date]="date"
            [minDate]="minDate"
            [maxDate]="maxDate"
            [disabled] = "disabled"
            (select)="selectDate($event)">
          </ngb-datepicker-navigation-select>
        </td>        
        
        <td class="text-sm-right">
          <button type="button" (click)="doNavigate(navigation.NEXT)" class="next btn btn-sm btn-secondary btn-inline" 
            [disabled]="nextDisabled()">&gt;</button>
        </td>
      </tr>
    </table>
  `
})
export class NgbDatepickerNavigation {
  navigation = NavigationEvent;

  @Input() date: NgbDate;
  @Input() disabled: boolean;
  @Input() maxDate: NgbDate;
  @Input() minDate: NgbDate;
  @Input() showSelect: boolean;
  @Input() showWeekNumbers: boolean;

  @Output() navigate = new EventEmitter<NavigationEvent>();
  @Output() select = new EventEmitter<NgbDate>();

  constructor(public i18n: NgbDatepickerI18n, private _calendar: NgbCalendar) {}

  doNavigate(event: NavigationEvent) { this.navigate.emit(event); }

  nextDisabled() {
    return this.disabled || (this.maxDate && this._calendar.getNext(this.date, 'm').after(this.maxDate));
  }

  prevDisabled() {
    const prevDate = this._calendar.getPrev(this.date, 'm');
    return this.disabled || (this.minDate && prevDate.year <= this.minDate.year && prevDate.month < this.minDate.month);
  }

  selectDate(date: NgbDate) { this.select.emit(date); }
}
