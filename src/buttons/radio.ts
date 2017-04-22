import {Directive, forwardRef, Optional, Input, Renderer, ElementRef, OnDestroy} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

const NGB_RADIO_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NgbRadioGroup),
  multi: true
};

/**
 * Easily create Bootstrap-style radio buttons. A value of a selected button is bound to a variable
 * specified via ngModel.
 */
@Directive({
  selector: '[ngbRadioGroup]',
  host: {'data-toggle': 'buttons', 'class': 'btn-group', 'role': 'group'},
  providers: [NGB_RADIO_VALUE_ACCESSOR]
})
export class NgbRadioGroup implements ControlValueAccessor {
  private _radios: Set<NgbRadio> = new Set<NgbRadio>();
  private _value = null;
  private _disabled: boolean;

  get disabled() { return this._disabled; }
  set disabled(isDisabled: boolean) { this.setDisabledState(isDisabled); }

  onChange = (_: any) => {};
  onTouched = () => {};

  onRadioChange(radio: NgbRadio) {
    this.writeValue(radio.value);
    this.onChange(radio.value);
  }

  onRadioValueUpdate() { this._updateRadiosValue(); }

  register(radio: NgbRadio) { this._radios.add(radio); }

  registerOnChange(fn: (value: any) => any): void { this.onChange = fn; }

  registerOnTouched(fn: () => any): void { this.onTouched = fn; }

  setDisabledState(isDisabled: boolean): void {
    this._disabled = isDisabled;
    this._updateRadiosDisabled();
  }

  unregister(radio: NgbRadio) { this._radios.delete(radio); }

  writeValue(value) {
    this._value = value;
    this._updateRadiosValue();
  }

  private _updateRadiosValue() { this._radios.forEach((radio) => radio.updateValue(this._value)); }
  private _updateRadiosDisabled() { this._radios.forEach((radio) => radio.updateDisabled()); }
}


@Directive({selector: 'label.btn'})
export class NgbActiveLabel {
  constructor(private _renderer: Renderer, private _elRef: ElementRef) {}

  set active(isActive: boolean) { this._renderer.setElementClass(this._elRef.nativeElement, 'active', isActive); }
  set disabled(isDisabled: boolean) {
    this._renderer.setElementClass(this._elRef.nativeElement, 'disabled', isDisabled);
  }
  set focused(isFocused: boolean) { this._renderer.setElementClass(this._elRef.nativeElement, 'focus', isFocused); }
}


/**
 * Marks an input of type "radio" as part of the NgbRadioGroup.
 */
@Directive({
  selector: 'input[type=radio]',
  host: {
    '[checked]': 'checked',
    '[disabled]': 'disabled',
    '(change)': 'onChange()',
    '(focus)': 'focused = true',
    '(blur)': 'focused = false'
  }
})
export class NgbRadio implements OnDestroy {
  private _checked: boolean;
  private _disabled: boolean;
  private _value: any = null;

  /**
   * You can specify model value of a given radio by binding to the value property.
  */
  @Input('value')
  set value(value: any) {
    this._value = value;
    const stringValue = value ? value.toString() : '';
    this._renderer.setElementProperty(this._element.nativeElement, 'value', stringValue);

    if (this._group) {
      this._group.onRadioValueUpdate();
    }
  }

  /**
   * A flag indicating if a given radio button is checked.
   */
  @Input('checked')
  set checked(value: boolean) {
    this._checked = this._element.nativeElement.hasAttribute('checked') ? true : value;
  }

  /**
   * A flag indicating if a given radio button is disabled.
   */
  @Input('disabled')
  set disabled(isDisabled: boolean) {
    this._disabled = isDisabled !== false;
    this.updateDisabled();
  }

  set focused(isFocused: boolean) {
    if (this._label) {
      this._label.focused = isFocused;
    }
  }

  get value() { return this._value; }

  get checked() { return this._checked; }

  get disabled() { return (this._group && this._group.disabled) || this._disabled; }

  constructor(
      @Optional() private _group: NgbRadioGroup, @Optional() private _label: NgbActiveLabel,
      private _renderer: Renderer, private _element: ElementRef) {
    if (this._group) {
      this._group.register(this);
    }
  }

  ngOnDestroy() {
    if (this._group) {
      this._group.unregister(this);
    }
  }

  onChange() {
    if (this._group) {
      this._group.onRadioChange(this);
    }
  }

  updateValue(value) {
    this._checked = (this.value === value && value !== null);
    this._label.active = this._checked;
  }

  updateDisabled() {
    let disabled = (this._group && this._group.disabled) || this._disabled;
    if (this._label) {
      this._label.disabled = disabled;
    }
  }
}
