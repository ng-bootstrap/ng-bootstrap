import {Component, ElementRef, EventEmitter, forwardRef, Input, Output} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

const NGB_CHECKBOX_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NgbCheckbox),
  multi: true
};

let nextId = 1;

/**
 * A component that allows the user to edit boolean values.
 */
@Component({
  selector: 'ngb-checkbox',
  host: {'class': 'custom-control custom-checkbox'},
  template: `
    <input
      type="checkbox"
      class="custom-control-input"
      [disabled]="disabled || readonly"
      [checked]="value"
      (change)="_valueChange($event)"
      (blur)="_blur()"
      [id]="id"
    />
    <label [attr.tabindex]="-1" class="custom-control-label" [attr.for]="id">
      <ng-content></ng-content>
    </label>
  `,
  providers: [NGB_CHECKBOX_VALUE_ACCESSOR]
})
export class NgbCheckbox implements ControlValueAccessor {
  private _value = false;

  /**
   * If `true`, the control will be disabled and the value can't be changed.
   */
  @Input() disabled = false;
  /**
   * The identifier of the input control.
   * The default value is an auto-generated ID.
   */
  @Input() id = `ngb-checkbox-${nextId++}`;
  /**
   * If `true`, the value can't be changed.
   */
  @Input() readonly = false;
  /**
   * The current value. Can be any boolean value.
   */
  @Input()
  set value(value: boolean) {
    if (this._value === value) {
      return;
    }
    this._value = value;
    this.valueChange.emit(value);
    this._onChange(value);
  }
  get value(): boolean { return this._value; }

  /**
   * An event emitted when the user changes the value.
   *
   * Event payload equals to the new value.
   */
  @Output() valueChange = new EventEmitter<boolean>();

  private _onChange = (_: any) => {};
  private _onTouched = () => {};

  constructor(private _elementRef: ElementRef) {}

  writeValue(obj: any): void { this._value = !!obj; }

  registerOnChange(fn: any): void { this._onChange = fn; }

  registerOnTouched(fn: any): void { this._onTouched = fn; }

  setDisabledState?(isDisabled: boolean): void { this.disabled = isDisabled; }

  _valueChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.value = input.checked;
  }

  _blur(): void {
    /**
     * Checks if the focus is still inside the component itself.
     * Need to use `setTimeout` to put the execution on top of the call stack.
     */
    setTimeout(() => {
      if (!this._elementRef.nativeElement.contains(document.activeElement)) {
        this._onTouched();
      }
    });
  }
}
