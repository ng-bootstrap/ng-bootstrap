import {Component, Input} from '@angular/core';

@Component({
  selector: '[ngbDatepickerDayView]',
  styles: [`
    :host {      
      text-align: center;
      padding: 0.185rem 0.25rem;      
      border-radius: 0.25rem;
    }
  `],
  host: {'[class.bg-primary]': 'selected', '[class.text-muted]': 'isMuted()'},
  template: `{{ date.day }}`
})
export class NgbDatepickerDayView {
  @Input() currentMonth: number;
  @Input() date: {year: number, month: number, day: number};
  @Input() disabled: boolean;
  @Input() selected: boolean;

  isMuted() { return this.date.month !== this.currentMonth || this.disabled; }
}
