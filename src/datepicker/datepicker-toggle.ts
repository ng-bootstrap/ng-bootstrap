import {Directive, ElementRef, Input} from '@angular/core';
import {NgbInputDatepicker} from './datepicker-input';

@Directive({
  selector: '[ngbDatepickerToggle]',
  host: {'(click)': 'toggle()', '(document:click)': 'closeOnOutsideEvent($event)'}
})
export class NgbDatepickerToggle {
  @Input() ngbDatepickerToggle: NgbInputDatepicker;

  constructor(private _elementRef: ElementRef) {}

  toggle() { this.ngbDatepickerToggle.toggle(); }

  closeOnOutsideEvent($event) {
    if (!this.isTargettingToggleButton($event) && this.ngbDatepickerToggle.shouldCloseOnOutsideEvent($event)) {
      this.ngbDatepickerToggle.close();
    }
  }

  private isTargettingToggleButton($event): boolean { return this._elementRef.nativeElement.contains($event.target); }
}
