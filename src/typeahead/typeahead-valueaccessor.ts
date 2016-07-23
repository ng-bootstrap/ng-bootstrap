import {NG_VALUE_ACCESSOR, ControlValueAccessor} from '@angular/common';
import {forwardRef, Directive, Input, ElementRef, Renderer} from '@angular/core';

import {toString} from '../util/util';

const NGB_TYPEAHEAD_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NgbTypeaheadValueAccessor),
  multi: true
};

/**
 * Typeahead value accessor that knows how to convert ngModel to string to display in the input field
 */
@Directive({selector: 'input[ngbTypeahead][ngModel]', providers: [NGB_TYPEAHEAD_VALUE_ACCESSOR]})
export class NgbTypeaheadValueAccessor implements ControlValueAccessor {
  /**
   * A function to convert a given value into string to display in the input field
   */
  @Input() inputFormatter: (value) => string;

  constructor(private _elementRef: ElementRef, private _renderer: Renderer) {}

  onChange = (_: any) => {};
  onTouched = () => {};

  registerOnChange(fn: (value: any) => any): void { this.onChange = fn; }

  registerOnTouched(fn: () => any): void { this.onTouched = fn; }

  writeValue(value) {
    const formattedValue = value && this.inputFormatter ? this.inputFormatter(value) : toString(value);
    this._renderer.setElementProperty(this._elementRef.nativeElement, 'value', formattedValue);
  }
}
