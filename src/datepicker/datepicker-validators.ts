import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn} from '@angular/forms';
import {Directive, forwardRef, Input, OnChanges, SimpleChanges, StaticProvider} from '@angular/core';
import {NgbDateStruct} from './ngb-date-struct';
import {NgbDate} from './ngb-date';
import {NgbCalendar} from './ngb-calendar';

function isNgbDateStruct(value: any): boolean {
  return value && value.day && value.month && value.year;
}

/**
 * A class containing factories for datepicker validator functions:
 * * `NgbDateValidators.minDate(minDate: NgbDateStruct)` - checks that the date is after the min date
 * * `NgbDateValidators.maxDate(maxDate: NgbDateStruct)` - checks that the date is before the max date
 * * `NgbDateValidators.invalidDate(calendar: NgbCalendar)` - checks that the date is valid
 *
 * @since 4.2.0
 */
// @dynamic
export class NgbDateValidators {
  static minDate(minDate: NgbDateStruct): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!isNgbDateStruct(control.value) || !isNgbDateStruct(minDate)) {
        return null;
      }
      const ngbDate = NgbDate.from(control.value);
      return ngbDate.before(NgbDate.from(minDate)) ? {'ngbDate': {requiredBefore: minDate}} : null;
    };
  }
  static maxDate(maxDate: NgbDateStruct): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!isNgbDateStruct(control.value) || !isNgbDateStruct(maxDate)) {
        return null;
      }
      const ngbDate = NgbDate.from(control.value);
      return ngbDate.after(NgbDate.from(maxDate)) ? {'ngbDate': {requiredAfter: maxDate}} : null;
    };
  }
  static invalidDate(calendar: NgbCalendar): ValidatorFn {
    return (control: AbstractControl): ValidationErrors |
        null => { return calendar.isValid(control.value) ? null : {'ngbDate': {invalid: control.value}}; };
  }
}

/**
 * A provider which adds `NgbInvalidDateValidator` to the `NG_VALIDATORS` multi-provider list.
 */
const NGB_INVALID_DATE_VALIDATOR: StaticProvider = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => NgbInvalidDateValidator),
  multi: true
};

/**
 * A directive that adds date validation to all NgbInputDatepicker controls. The directive is provided with the
 * `NG_VALIDATORS` multi-provider list.
 *
 * @since 4.2.0
 */
@Directive({
  selector: 'input[ngbDatepicker][formControlName],input[ngbDatepicker][formControl],input[ngbDatepicker][ngModel]',
  providers: [NGB_INVALID_DATE_VALIDATOR]
})
export class NgbInvalidDateValidator implements Validator {
  private readonly _validator: ValidatorFn;
  private _onChange: () => void;
  constructor(private _calendar: NgbCalendar) { this._validator = NgbDateValidators.invalidDate(this._calendar); }

  validate(control: AbstractControl): ValidationErrors | null {
    return control.value == null ? null : this._validator(control);
  }

  registerOnValidatorChange(fn: () => void): void { this._onChange = fn; }
}

/**
 * A provider which adds `NgbMinDateValidator` to the `NG_VALIDATORS` multi-provider list.
 */
const NGB_MIN_DATE_VALIDATOR: StaticProvider = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => NgbMinDateValidator),
  multi: true
};

/**
 * A directive that adds min date validation to all NgbInputDatepicker controls with the `minDate` attribute. The
 * directive is provided with the `NG_VALIDATORS` multi-provider list.
 *
 * @since 4.2.0
 */
@Directive({
  selector:
      'input[ngbDatepicker][minDate][formControlName],input[ngbDatepicker][minDate][formControl],input[ngbDatepicker][minDate][ngModel]',
  providers: [NGB_MIN_DATE_VALIDATOR]
})
export class NgbMinDateValidator implements Validator,
    OnChanges {
  private _validator: ValidatorFn;
  private _onChange: () => void;
  @Input() minDate: NgbDateStruct;
  ngOnChanges(changes: SimpleChanges): void {
    if ('minDate' in changes) {
      this._createValidator();
      if (this._onChange) {
        this._onChange();
      }
    }
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.minDate == null ? null : this._validator(control);
  }

  registerOnValidatorChange(fn: () => void): void { this._onChange = fn; }

  private _createValidator(): void { this._validator = NgbDateValidators.minDate(this.minDate); }
}

/**
 * A provider which adds `NgbMaxDateValidator` to the `NG_VALIDATORS` multi-provider list.
 */
const NGB_MAX_DATE_VALIDATOR: StaticProvider = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => NgbMaxDateValidator),
  multi: true
};

/**
 * A directive that adds max date validation to all NgbInputDatepicker controls with the `maxDate` attribute. The
 * directive is provided with the `NG_VALIDATORS` multi-provider list.
 *
 * @since 4.2.0
 */
@Directive({
  selector:
      'input[ngbDatepicker][maxDate][formControlName],input[ngbDatepicker][maxDate][formControl],input[ngbDatepicker][maxDate][ngModel]',
  providers: [NGB_MAX_DATE_VALIDATOR]
})
export class NgbMaxDateValidator implements Validator,
    OnChanges {
  private _validator: ValidatorFn;
  private _onChange: () => void;
  @Input() maxDate: NgbDateStruct;
  ngOnChanges(changes: SimpleChanges): void {
    if ('maxDate' in changes) {
      this._createValidator();
      if (this._onChange) {
        this._onChange();
      }
    }
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.maxDate == null ? null : this._validator(control);
  }

  registerOnValidatorChange(fn: () => void): void { this._onChange = fn; }

  private _createValidator(): void { this._validator = NgbDateValidators.maxDate(this.maxDate); }
}
