import {Component, Input} from '@angular/core';
import {NgbDateStruct} from './ngb-date-struct';

@Component({
  selector: '[ngbDatepickerDayView]',
  styles: [`
    :host {      
      text-align: center;
      padding: 0.185rem 0.25rem;      
      border-radius: 0.25rem;
    }
  `],
  host: {'[class.bg-primary]': 'selected', '[class.text-muted]': 'isMuted()', '[class.btn-secondary]': '!disabled'},
  template: `{{ date.day }}`
})
export class NgbDatepickerDayView {
  @Input() currentMonth: number;
  @Input() date: NgbDateStruct;
  @Input() disabled: boolean;
  @Input() selected: boolean;

  isMuted() { return !this.selected && (this.date.month !== this.currentMonth || this.disabled); }
}
