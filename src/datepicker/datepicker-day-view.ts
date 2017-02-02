import {Component, Input} from '@angular/core';
import {NgbDateStruct} from './ngb-date-struct';
import {NgbDatepickerI18n} from './datepicker-i18n';

@Component({
  selector: '[ngbDatepickerDayView]',
  styles: [`
    :host {
      text-align: center;
      width: 2rem;
      height: 2rem;
      line-height: 2rem;      
      border-radius: 0.25rem;
    }
    :host.outside {
      opacity: 0.5;
    }
  `],
  host: {
    'role': 'gridcell',
    '[attr.aria-label]': 'getAriaLabel()',
    '[attr.id]': 'id',
    '[attr.aria-selected]': 'selected',
    '[attr.aria-disabled]': 'disabled ? "true" : undefined',
    '[class.bg-primary]': 'selected',
    '[class.text-white]': 'selected',
    '[class.text-muted]': 'isMuted()',
    '[class.outside]': 'isMuted()',
    '[class.btn-secondary]': 'true',
    '[class.active]': 'focused'
  },
  template: `{{ date.day }}`
})
export class NgbDatepickerDayView {
  @Input() id: string;
  @Input() currentMonth: number;
  @Input() date: NgbDateStruct;
  @Input() weekday: number;
  @Input() disabled: boolean;
  @Input() selected: boolean;
  @Input() focused: boolean;

  constructor(public i18n: NgbDatepickerI18n) {}

  isMuted() { return !this.selected && (this.date.month !== this.currentMonth || this.disabled); }

  getAriaLabel() {
    const i18n = this.i18n;
    const date = this.date;
    return `${i18n.getWeekdayFullName(this.weekday)} ${date.day} ${i18n.getMonthFullName(date.month)} ${date.year}`;
  }
}
