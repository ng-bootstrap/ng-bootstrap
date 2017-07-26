import {Directive, forwardRef, Input, Renderer2, ElementRef, OnDestroy} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

import {NgbButtonLabel} from './label';

const NGB_RADIO_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NgbRadioGroup),
  multi: true
};

let nextId = 0;

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

  /**
   * The name of the group. Unless enclosed inputs specify a name, this name is used as the name of the
   * enclosed inputs. If not specified, a name is generated automatically.
   */
  @Input() name = `ngb-radio-${nextId++}`;

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


/**
 * Marks an input of type "radio" as part of the NgbRadioGroup.
 */
@Directive({
  selector: '[ngbButton][type=radio]',
  host: {
    '[checked]': 'checked',
    '[disabled]': 'disabled',
    '[name]': 'nameAttr',
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
   * The name of the input. All inputs of a group should have the same name. If not specified,
   * the name of the enclosing group is used.
   */
  @Input() name: string;

  /**
   * You can specify model value of a given radio by binding to the value property.
   */
  @Input('value')
  set value(value: any) {
    this._value = value;
    const stringValue = value ? value.toString() : '';
    this._renderer.setProperty(this._element.nativeElement, 'value', stringValue);
    this._group.onRadioValueUpdate();
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

  get checked() { return this._checked; }

  get disabled() { return this._group.disabled || this._disabled; }

  get value() { return this._value; }

  get nameAttr() { return this.name || this._group.name; }

  constructor(
      private _group: NgbRadioGroup, private _label: NgbButtonLabel, private _renderer: Renderer2,
      private _element: ElementRef) {
    this._group.register(this);
  }

  ngOnDestroy() { this._group.unregister(this); }

  onChange() { this._group.onRadioChange(this); }

  updateValue(value) {
    this._checked = this.value === value;
    this._label.active = this._checked;
  }

  updateDisabled() { this._label.disabled = this.disabled; }
}
