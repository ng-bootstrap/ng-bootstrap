import {Component, Input} from '@angular/core';
import {NgbDateStruct} from './ngb-date-struct';
import {NgbCalendar} from './ngb-calendar';

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
    '[class.bg-primary]': 'selected',
    '[class.text-white]': 'selected',
    '[class.text-muted]': 'isMuted()',
    '[class.outside]': 'isMuted()',
    '[class.btn-secondary]': '!disabled'
  },
  template: `{{ this._calendar.displayNumerals(date.day) }}`
})
export class NgbDatepickerDayView {
  @Input() currentMonth: number;
  @Input() date: NgbDateStruct;
  @Input() disabled: boolean;
  @Input() selected: boolean;

  constructor(private _calendar: NgbCalendar) { ; };

  isMuted() { return !this.selected && (this.date.month !== this.currentMonth || this.disabled); }
}
