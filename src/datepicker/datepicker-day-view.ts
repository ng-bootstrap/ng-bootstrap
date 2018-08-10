import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {NgbDate} from './ngb-date';
import {NgbDatepickerI18n} from './datepicker-i18n';

@Component({
  selector: '[ngbDatepickerDayView]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    :host {
      text-align: center;
      width: 2rem;
      height: 2rem;
      line-height: 2rem;
      border-radius: 0.25rem;
      background: transparent;
    }
    :host.outside {
      opacity: 0.5;
    }
  `],
  host: {
    'class': 'btn-light',
    '[class.bg-primary]': 'selected',
    '[class.text-white]': 'selected',
    '[class.text-muted]': 'isMuted()',
    '[class.outside]': 'isMuted()',
    '[class.active]': 'focused'
  },
  template: `{{ i18n.getDayNumerals(date) }}`
})
export class NgbDatepickerDayView {
  @Input() currentMonth: number;
  @Input() date: NgbDate;
  @Input() disabled: boolean;
  @Input() focused: boolean;
  @Input() selected: boolean;

  constructor(public i18n: NgbDatepickerI18n) {}

  isMuted() { return !this.selected && (this.date.month !== this.currentMonth || this.disabled); }
}
