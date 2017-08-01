import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {NgbDateStruct} from './ngb-date-struct';

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
    }
    :host.outside {
      opacity: 0.5;
    }
  `],
  host: {
    'class': 'btn-secondary',
    '[class.bg-primary]': 'selected',
    '[class.text-white]': 'selected',
    '[class.text-muted]': 'isMuted()',
    '[class.outside]': 'isMuted()',
    '[class.active]': 'focused'
  },
  template: `{{ date.day }}`
})
export class NgbDatepickerDayView {
  @Input() currentMonth: number;
  @Input() date: NgbDateStruct;
  @Input() disabled: boolean;
  @Input() focused: boolean;
  @Input() selected: boolean;

  isMuted() { return !this.selected && (this.date.month !== this.currentMonth || this.disabled); }
}
