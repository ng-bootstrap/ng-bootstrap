import {
  ChangeDetectorRef,
  Component,
  forwardRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

import {isInteger, isNumber, padNumber, isDefined, toInteger} from '../util/util';
import {NgbTime, Part} from './ngb-time';
import {NgbTimepickerConfig} from './timepicker-config';
import {NgbTimeAdapter} from './ngb-time-adapter';

const NGB_TIMEPICKER_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NgbTimepicker),
  multi: true
};

export interface PartUISpec {
  getPart: (model: NgbTime) => Part;
  getStep: () => number;

  formatForField: (value: number) => string;
  transformFromField?: (value: number) => number;

  getModel: () => NgbTime;
  afterChange: () => void;
}

export class PartUI {
  constructor(private spec: PartUISpec) {}

  private _getPart(): Part | null {
    const model = this.spec.getModel();
    if (!isDefined(model)) {
      return null;
    }
    return this.spec.getPart(model);
  }

  get formattedValue(): string | null {
    const part = this._getPart();
    if (!isDefined(part)) {
      return '';
    }

    const {value} = part;
    if (!isDefined(value) || isNaN(value)) {
      return '';
    }

    return this.spec.formatForField(value);
  }

  increment(step?: number) { this._updateRelative(+1, step); }
  decrement(step?: number) { this._updateRelative(-1, step); }
  _updateRelative(sign, givenStep) {
    const part = this._getPart();
    if (!isDefined(part)) {
      return;
    }

    const step = isDefined(givenStep) ? givenStep : this.spec.getStep();
    part.shift(sign * step);
    this.spec.afterChange();
  }

  setFromField(text: string) {
    const value = toInteger(text);
    const part = this._getPart();
    if (!isDefined(part)) {
      return;
    }

    const {transformFromField} = this.spec;
    const finalValue = !isDefined(transformFromField) ? value : transformFromField(value);

    part.set(finalValue);
    this.spec.afterChange();
  }
}

/**
 * A directive that helps with wth picking hours, minutes and seconds.
 */
@Component({
  selector: 'ngb-timepicker',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./timepicker.scss'],
  template: `
    <fieldset [disabled]="disabled" [class.disabled]="disabled">
      <div class="ngb-tp">
        <ngb-timepicker-part
          [spinners]="spinners" [disabled]="disabled" [readonly]="readonlyInputs" [size]="size"

          class-part="hour"
          placeholder="HH" i18n-placeholder="@@ngb.timepicker.HH"
          aria-label="Hours" i18n-aria-label="@@ngb.timepicker.hours"

          label-increment="Increment hours" i18n-label-increment="@@ngb.timepicker.increment-hours"
          label-decrement="Decrement hours" i18n-label-decrement="@@ngb.timepicker.decrement-hours"

          [wrapper]="hour"
        ></ngb-timepicker-part>

        <div class="ngb-tp-spacer">:</div>

        <ngb-timepicker-part
          [spinners]="spinners" [disabled]="disabled" [readonly]="readonlyInputs" [size]="size"

          class-part="minute"
          placeholder="MM" i18n-placeholder="@@ngb.timepicker.MM"
          aria-label="Minutes" i18n-aria-label="@@ngb.timepicker.minutes"

          label-increment="Increment minutes" i18n-label-increment="@@ngb.timepicker.increment-minutes"
          label-decrement="Decrement minutes" i18n-label-decrement="@@ngb.timepicker.decrement-minutes"

          [wrapper]="minute"
        ></ngb-timepicker-part>

        <div *ngIf="seconds" class="ngb-tp-spacer">:</div>

        <ngb-timepicker-part
          *ngIf="seconds"

          [spinners]="spinners" [disabled]="disabled" [readonly]="readonlyInputs" [size]="size"

          class-part="second"
          placeholder="SS" i18n-placeholder="@@ngb.timepicker.SS"
          aria-label="Seconds" i18n-aria-label="@@ngb.timepicker.seconds"

          label-increment="Increment seconds" i18n-label-increment="@@ngb.timepicker.increment-seconds"
          label-decrement="Decrement seconds" i18n-label-decrement="@@ngb.timepicker.decrement-seconds"

          [wrapper]="second"
        ></ngb-timepicker-part>

        <div *ngIf="meridian" class="ngb-tp-spacer"></div>

        <div *ngIf="meridian" class="ngb-tp-meridian">
          <button
            type="button"
            [disabled]="disabled"

            class="btn btn-outline-primary"
            [class.btn-sm]="isSmallSize"
            [class.btn-lg]="isLargeSize"
            [class.disabled]="disabled"

            (click)="toggleMeridian()"
          >
            <ng-container
              *ngIf="model?.hour >= 12; else am"
              i18n="@@ngb.timepicker.PM"
            >PM</ng-container>
            <ng-template #am i18n="@@ngb.timepicker.AM">AM</ng-template>
          </button>
        </div>
      </div>
    </fieldset>
  `,
  providers: [NGB_TIMEPICKER_VALUE_ACCESSOR]
})
export class NgbTimepicker implements ControlValueAccessor,
    OnChanges {
  disabled: boolean;
  model: NgbTime;

  private _hourStep: number;
  private _minuteStep: number;
  private _secondStep: number;

  /**
   * Whether to display 12H or 24H mode.
   */
  @Input() meridian: boolean;

  /**
   * If `true`, the spinners above and below inputs are visible.
   */
  @Input() spinners: boolean;

  /**
   * If `true`, it is possible to select seconds.
   */
  @Input() seconds: boolean;

  /**
   * The number of hours to add/subtract when clicking hour spinners.
   */
  @Input()
  set hourStep(step: number) {
    this._hourStep = isInteger(step) ? step : this._config.hourStep;
  }

  get hourStep(): number { return this._hourStep; }

  /**
   * The number of minutes to add/subtract when clicking minute spinners.
   */
  @Input()
  set minuteStep(step: number) {
    this._minuteStep = isInteger(step) ? step : this._config.minuteStep;
  }

  get minuteStep(): number { return this._minuteStep; }

  /**
   * The number of seconds to add/subtract when clicking second spinners.
   */
  @Input()
  set secondStep(step: number) {
    this._secondStep = isInteger(step) ? step : this._config.secondStep;
  }

  get secondStep(): number { return this._secondStep; }

  /**
   * If `true`, the timepicker is readonly and can't be changed.
   */
  @Input() readonlyInputs: boolean;

  /**
   * The size of inputs and buttons.
   */
  @Input() size: 'small' | 'medium' | 'large';

  hour: PartUI;
  minute: PartUI;
  second: PartUI;

  constructor(
      private readonly _config: NgbTimepickerConfig, private _ngbTimeAdapter: NgbTimeAdapter<any>,
      private _cd: ChangeDetectorRef) {
    this.meridian = _config.meridian;
    this.spinners = _config.spinners;
    this.seconds = _config.seconds;
    this.hourStep = _config.hourStep;
    this.minuteStep = _config.minuteStep;
    this.secondStep = _config.secondStep;
    this.disabled = _config.disabled;
    this.readonlyInputs = _config.readonlyInputs;
    this.size = _config.size;

    const getModel = () => this.model;
    const afterChange = () => this.propagateModelChange();

    this.hour = new PartUI({
      getModel,
      afterChange,
      getStep: () => this.hourStep,
      getPart: (model) => model.hourPart,

      formatForField: (value: number) => padNumber(!this.meridian ? value % 24 : value % 12 === 0 ? 12 : value % 12),

      transformFromField: (enteredHour: number) => {
        const isPM = this.model.hour >= 12;
        const realHourIsHigherThanInputHour =
            this.meridian && (isPM && enteredHour < 12 || !isPM && enteredHour === 12);
        return !realHourIsHigherThanInputHour ? enteredHour : enteredHour + 12;
      },
    });

    const formatMinSec = (value: number) => padNumber(value);

    this.minute = new PartUI({
      getModel,
      afterChange,
      getPart: (model) => model.minutePart,
      getStep: () => this.minuteStep,

      formatForField: formatMinSec,
    });

    this.second = new PartUI({
      getModel,
      afterChange,
      getPart: (model) => model.secondPart,
      getStep: () => this.secondStep,

      formatForField: formatMinSec,
    });
  }

  onChange = (_: any) => {};
  onTouched = () => {};

  writeValue(value) {
    const structValue = this._ngbTimeAdapter.fromModel(value);
    this.model = structValue ? new NgbTime(structValue.hour, structValue.minute, structValue.second) : new NgbTime();
    if (!this.seconds && (!structValue || !isNumber(structValue.second))) {
      this.model.setSecond(0, false);
    }
    this._cd.markForCheck();
  }

  registerOnChange(fn: (value: any) => any): void { this.onChange = fn; }
  registerOnTouched(fn: () => any): void { this.onTouched = fn; }

  setDisabledState(isDisabled: boolean) { this.disabled = isDisabled; }

  toggleMeridian() {
    if (this.meridian) {
      this.hour.increment(12);
    }
  }

  get isSmallSize(): boolean { return this.size === 'small'; }
  get isLargeSize(): boolean { return this.size === 'large'; }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['seconds'] && !this.seconds && this.model && !isNumber(this.model.second)) {
      this.model.setSecond(0, false);
      this.propagateModelChange(false);
    }
  }

  private propagateModelChange(touched = true) {
    if (touched) {
      this.onTouched();
    }
    if (this.model.isValid(this.seconds)) {
      this.onChange(
          this._ngbTimeAdapter.toModel({hour: this.model.hour, minute: this.model.minute, second: this.model.second}));
    } else {
      this.onChange(this._ngbTimeAdapter.toModel(null));
    }
  }
}
