import {NgbInputDatepicker} from './datepicker-input';
import {Directive, ElementRef, Input} from '@angular/core';

/**
 * A directive to mark an element that triggers the datepicker popup opening and closing
 *
 * @since 3.0.0
 */
@Directive({selector: '[ngbDatepickerToggle]'})
export class NgbDatepickerToggle {
  /**
   * A reference to the `NgbInputDatepicker` instance
   */
  @Input()
  set ngbDatepickerToggle(datepicker: NgbInputDatepicker) {
    datepicker.registerClickableElement(this._element.nativeElement);
  };

  constructor(private _element: ElementRef<HTMLElement>) {}
}
