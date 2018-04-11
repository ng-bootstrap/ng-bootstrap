import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from '@angular/core';
import {NgbDate} from './ngb-date';
import {toInteger} from '../util/util';
import {NgbDatepickerI18n} from './datepicker-i18n';

@Component({
  selector: 'ngb-datepicker-navigation-select',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    :host>select {
      /* to align with btn-sm */
      padding: 0.25rem 0.5rem;
      font-size: 0.875rem;
      line-height: 1.25;
      /* to cancel the custom height set by custom-select */
      height: inherit;
      width: 50%;
      display: inline-block;
    }
  `],
  template: `
    <select
      [disabled]="disabled"
      class="custom-select"
      [value]="date?.month"
      (change)="changeMonth($event.target.value)">
        <option *ngFor="let m of months" [value]="m">{{ i18n.getMonthShortName(m) }}</option>
    </select><select
      [disabled]="disabled"
      class="custom-select"
      [value]="date?.year"
      (change)="changeYear($event.target.value)">
        <option *ngFor="let y of years" [value]="y">{{ y }}</option>
    </select>
  `
})
export class NgbDatepickerNavigationSelect {
  @Input() date: NgbDate;
  @Input() disabled: boolean;
  @Input() months: number[];
  @Input() years: number[];

  @Output() select = new EventEmitter<NgbDate>();

  constructor(public i18n: NgbDatepickerI18n) {}

  changeMonth(month: string) { this.select.emit(new NgbDate(this.date.year, toInteger(month), 1)); }

  changeYear(year: string) { this.select.emit(new NgbDate(toInteger(year), this.date.month, 1)); }
}
