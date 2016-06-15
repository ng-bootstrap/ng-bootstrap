import {Directive, forwardRef, Host, Optional, Input, Renderer, ElementRef, OnDestroy} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/common';

const NGB_RADIO_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NgbRadioGroup),
  multi: true
};

@Directive({selector: '[ngb-radio-group][ngModel]', providers: [NGB_RADIO_VALUE_ACCESSOR]})
export class NgbRadioGroup implements ControlValueAccessor {
  private _radios: Set<NgbRadio> = new Set<NgbRadio>();
  private _value = null;

  onChange = (_: any) => {};
  onTouched = () => {};

  onRadioChange(radio: NgbRadio) {
    this.writeValue(radio.value);
    this.onChange(radio.value);
  }

  onRadioValueUpdate() { this._updateRadios(); }

  register(radio: NgbRadio) { this._radios.add(radio); }

  registerOnChange(fn: (value: any) => any): void { this.onChange = fn; }

  registerOnTouched(fn: () => any): void { this.onTouched = fn; }

  unregister(radio: NgbRadio) { this._radios.delete(radio); }

  writeValue(value) {
    this._value = value;
    this._updateRadios();
  }

  private _updateRadios() { this._radios.forEach((radio) => radio.markChecked(this._value)); }
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
      this.group.onRadioValueUpdate();
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

  markChecked(value) {
    this.checked = (this.value === value && value !== null);
    this.label.checked = this.checked;
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
