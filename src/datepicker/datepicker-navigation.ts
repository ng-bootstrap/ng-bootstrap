import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from '@angular/core';
import {NavigationEvent} from './datepicker-view-model';
import {NgbDate} from './ngb-date';
import {NgbDatepickerI18n} from './datepicker-i18n';
import {NgbCalendar} from './ngb-calendar';

@Component({
  selector: 'ngb-datepicker-navigation',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {'class': 'd-flex justify-content-between', '[class.collapsed]': '!showSelect'},
  styles: [`
    :host {
      height: 2rem;
      line-height: 1.85rem;
    }
    :host.collapsed {
      margin-bottom: -2rem;        
    }
    .ngb-dp-navigation-chevron::before {
      border-style: solid;
      border-width: 0.2em 0.2em 0 0;
      content: '';
      display: inline-block;
      height: 0.75em;
      transform: rotate(-135deg);
      -webkit-transform: rotate(-135deg);
      -ms-transform: rotate(-135deg);
      width: 0.75em;
      margin: 0 0 0 0.5rem;
    }    
    .ngb-dp-navigation-chevron.right:before {
      -webkit-transform: rotate(45deg);
      -ms-transform: rotate(45deg);
      transform: rotate(45deg);
      margin: 0 0.5rem 0 0;
    }
    .btn-link {
      cursor: pointer;
      border: 0;
      outline: 0;
    }
    .btn-link[disabled] {
      cursor: not-allowed;
      opacity: .65;
    }    
  `],
  template: `
    <button type="button" class="btn-link" (click)="!!doNavigate(navigation.PREV)" [disabled]="prevDisabled()" tabindex="-1">
      <span class="ngb-dp-navigation-chevron"></span>    
    </button>
    
    <ngb-datepicker-navigation-select *ngIf="showSelect" class="d-block" [style.width.rem]="months * 9"
      [date]="date"
      [minDate]="minDate"
      [maxDate]="maxDate"
      [disabled] = "disabled"
      (select)="selectDate($event)">
    </ngb-datepicker-navigation-select>
    
    <button type="button" class="btn-link" (click)="!!doNavigate(navigation.NEXT)" [disabled]="nextDisabled()" tabindex="-1">
      <span class="ngb-dp-navigation-chevron right"></span>
    </button>
  `
})
export class NgbDatepickerNavigation {
  navigation = NavigationEvent;

  @Input() date: NgbDate;
  @Input() disabled: boolean;
  @Input() maxDate: NgbDate;
  @Input() minDate: NgbDate;
  @Input() months: number;
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
