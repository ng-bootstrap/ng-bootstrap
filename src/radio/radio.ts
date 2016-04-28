import {Directive, forwardRef, Provider, Host, Optional, Input, Renderer, ElementRef, OnDestroy} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/common';

const NGB_RADIO_VALUE_ACCESSOR =
    new Provider(NG_VALUE_ACCESSOR, {useExisting: forwardRef(() => NgbRadioGroup), multi: true});

@Directive({selector: '[ngb-radio-group][ngModel]', bindings: [NGB_RADIO_VALUE_ACCESSOR]})
export class NgbRadioGroup implements ControlValueAccessor {
  private _radios: Set<NgbRadio> = new Set<NgbRadio>();
  private _selectedRadio: NgbRadio = null;
  private _value = null;

  onChange = (_: any) => {};
  onTouched = () => {};

  onRadioChange(radio: NgbRadio) { this._setGroupValue(radio); }

  onRadioValueUpdate(radio: NgbRadio) {
    if (this._selectedRadio === radio) {
      this.onRadioChange(radio);
    } else {
      this._updateRadios();
    }
  }

  register(radio: NgbRadio) {
    this._radios.add(radio);
    this._updateRadios();
  }

  registerOnChange(fn: (value: any) => any): void { this.onChange = fn; }

  registerOnTouched(fn: () => any): void { this.onTouched = fn; }

  unregister(radio: NgbRadio) {
    this._radios.delete(radio);
    if (this._selectedRadio === radio) {
      this._setGroupValue(null);
    }
  }

  writeValue(value) {
    this._value = value;
    this._updateRadios();
  }

  private _setGroupValue(radio: NgbRadio) {
    this._selectedRadio = radio;
    const value = radio ? radio.value : null;
    this.writeValue(value);
    this.onChange(value);
  }

  private _updateRadios() {
    this._selectedRadio = null;
    this._radios.forEach((radio) => {
      if (radio.markChecked(this._value)) {
        this._selectedRadio = radio;
      }
    });
  }
}


@Directive({selector: 'label.btn', host: {'[class.active]': 'checked'}})
export class NgbRadioLabel {
  @Input() checked: boolean;
}


@Directive({selector: 'input[type=radio]', host: {'(change)': 'onChange($event.target.value)', '[checked]': 'checked'}})
export class NgbRadio implements OnDestroy {
  private _value = null;

  @Input() checked: boolean;

  @Input('value')
  set value(value) {
    this._value = value;
    const stringValue = value ? value.toString() : '';
    this.renderer.setElementProperty(this.element.nativeElement, 'value', stringValue);

    if (this.group) {
      this.group.onRadioValueUpdate(this);
    }
  }

  get value() { return this._value; }

  constructor(
      @Optional() @Host() private group: NgbRadioGroup, @Optional() @Host() private label: NgbRadioLabel,
      private renderer: Renderer, private element: ElementRef) {
    if (this.group) {
      this.group.register(this);
    }
  }

  markChecked(value): boolean {
    this.checked = (this.value === value && value !== null);
    this.label.checked = this.checked;

    return this.checked;
  }

  ngOnDestroy() {
    if (this.group) {
      this.group.unregister(this);
    }
  }

  onChange() {
    if (this.group) {
      this.group.onRadioChange(this);
    }
  }
}

export const NGB_RADIO_DIRECTIVES = [NgbRadio, NgbRadioLabel, NgbRadioGroup];
