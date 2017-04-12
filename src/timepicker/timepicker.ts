import {Component, Input, forwardRef, OnChanges, SimpleChanges} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

import {isNumber, padNumber, toInteger, isDefined} from '../util/util';
import {NgbTime} from './ngb-time';
import {NgbTimepickerConfig} from './timepicker-config';

const NGB_TIMEPICKER_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NgbTimepicker),
  multi: true
};

/**
 * A lightweight & configurable timepicker directive.
 */
@Component({
  selector: 'ngb-timepicker',
  styles: [`
    .chevron::before {
      border-style: solid;
      border-width: 0.29em 0.29em 0 0;
      content: '';
      display: inline-block;
      height: 0.69em;
      left: 0.05em;
      position: relative;
      top: 0.15em;
      transform: rotate(-45deg);
      -webkit-transform: rotate(-45deg);
      -ms-transform: rotate(-45deg);
      vertical-align: middle;
      width: 0.71em;
    }

    .chevron.bottom:before {
      top: -.3em;
      -webkit-transform: rotate(135deg);
      -ms-transform: rotate(135deg);
      transform: rotate(135deg);
    }

    .btn-link {
      outline: 0;
    }

    .btn-link.disabled {
      cursor: not-allowed;
      opacity: .65;
    }

    input {
      text-align: center;
    }
  `],
  template: `
     <fieldset [disabled]="disabled" [class.disabled]="disabled">
      <table>
        <tr *ngIf="spinners">
          <td class="text-center">
            <button type="button" class="btn-link" [ngClass]="setButtonSize()" (click)="changeHour(hourStep)"
              [disabled]="disabled" [class.disabled]="disabled">
              <span class="chevron"></span>
              <span class="sr-only">Increment hours</span>
            </button>
          </td>
          <td>&nbsp;</td>
          <td class="text-center">
            <button type="button" class="btn-link" [ngClass]="setButtonSize()" (click)="changeMinute(minuteStep)"
              [disabled]="disabled" [class.disabled]="disabled">
                <span class="chevron"></span>
                <span class="sr-only">Increment minutes</span>
            </button>
          </td>
          <template [ngIf]="seconds">
            <td>&nbsp;</td>
            <td class="text-center">
              <button type="button" class="btn-link" [ngClass]="setButtonSize()" (click)="changeSecond(secondStep)"
                [disabled]="disabled" [class.disabled]="disabled">
                <span class="chevron"></span>
                <span class="sr-only">Increment seconds</span>
              </button>
            </td>
          </template>
          <template [ngIf]="meridian">
            <td>&nbsp;</td>
            <td>&nbsp;</td>
          </template>
        </tr>
        <tr>
          <td>
            <input type="text" class="form-control" [ngClass]="setFormControlSize()" maxlength="2" size="2" placeholder="HH"
              [value]="formatHour(model?.hour)" (change)="updateHour($event.target.value)"
              [readonly]="readonlyInputs" [disabled]="disabled" aria-label="Hours">
          </td>
          <td>&nbsp;:&nbsp;</td>
          <td>
            <input type="text" class="form-control" [ngClass]="setFormControlSize()" maxlength="2" size="2" placeholder="MM"
              [value]="formatMinSec(model?.minute)" (change)="updateMinute($event.target.value)"
              [readonly]="readonlyInputs" [disabled]="disabled" aria-label="Minutes">
          </td>
          <template [ngIf]="seconds">
            <td>&nbsp;:&nbsp;</td>
            <td>
              <input type="text" class="form-control" [ngClass]="setFormControlSize()" maxlength="2" size="2" placeholder="SS"
                [value]="formatMinSec(model?.second)" (change)="updateSecond($event.target.value)"
                [readonly]="readonlyInputs" [disabled]="disabled" aria-label="Seconds">
            </td>
          </template>
          <template [ngIf]="meridian">
            <td>&nbsp;&nbsp;</td>
            <td>
              <button type="button" class="btn btn-outline-primary" [ngClass]="setButtonSize()"
                (click)="toggleMeridian()">{{model.hour >= 12 ? 'PM' : 'AM'}}</button>
            </td>
          </template>
        </tr>
        <tr *ngIf="spinners">
          <td class="text-center">
            <button type="button" class="btn-link" [ngClass]="setButtonSize()" (click)="changeHour(-hourStep)"
              [disabled]="disabled" [class.disabled]="disabled">
              <span class="chevron bottom"></span>
              <span class="sr-only">Decrement hours</span>
            </button>
          </td>
          <td>&nbsp;</td>
          <td class="text-center">
            <button type="button" class="btn-link" [ngClass]="setButtonSize()" (click)="changeMinute(-minuteStep)"
              [disabled]="disabled" [class.disabled]="disabled">
              <span class="chevron bottom"></span>
              <span class="sr-only">Decrement minutes</span>
            </button>
          </td>
          <template [ngIf]="seconds">
            <td>&nbsp;</td>
            <td class="text-center">
              <button type="button" class="btn-link" [ngClass]="setButtonSize()" (click)="changeSecond(-secondStep)"
                [disabled]="disabled" [class.disabled]="disabled">
                <span class="chevron bottom"></span>
                <span class="sr-only">Decrement seconds</span>
              </button>
            </td>
          </template>
          <template [ngIf]="meridian">
            <td>&nbsp;</td>
            <td>&nbsp;</td>
          </template>
        </tr>
      </table>
    </fieldset>
  `,
  providers: [NGB_TIMEPICKER_VALUE_ACCESSOR]
})
export class NgbTimepicker implements ControlValueAccessor,
    OnChanges {
  disabled: boolean;
  model: NgbTime;

  /**
   * Whether to display 12H or 24H mode.
   */
  @Input() meridian: boolean;

  /**
   * Whether to display the spinners above and below the inputs.
   */
  @Input() spinners: boolean;

  /**
   * Whether to display seconds input.
   */
  @Input() seconds: boolean;

  /**
   * Number of hours to increase or decrease when using a button.
   */
  @Input() hourStep: number;

  /**
   * Number of minutes to increase or decrease when using a button.
   */
  @Input() minuteStep: number;

  /**
   * Number of seconds to increase or decrease when using a button.
   */
  @Input() secondStep: number;

  /**
   * To make timepicker readonly
   */
  @Input() readonlyInputs: boolean;

  /**
   * To set the size of the inputs and button
   */
  @Input() size: 'small' | 'medium' | 'large';

  constructor(config: NgbTimepickerConfig) {
    this.meridian = config.meridian;
    this.spinners = config.spinners;
    this.seconds = config.seconds;
    this.hourStep = config.hourStep;
    this.minuteStep = config.minuteStep;
    this.secondStep = config.secondStep;
    this.disabled = config.disabled;
    this.readonlyInputs = config.readonlyInputs;
    this.size = config.size;
  }

  onChange = (_: any) => {};
  onTouched = () => {};

  writeValue(value) {
    this.model = value ? new NgbTime(value.hour, value.minute, value.second) : new NgbTime();
    if (!this.seconds && (!value || !isNumber(value.second))) {
      this.model.second = 0;
    }
  }

  registerOnChange(fn: (value: any) => any): void { this.onChange = fn; }

  registerOnTouched(fn: () => any): void { this.onTouched = fn; }

  setDisabledState(isDisabled: boolean) { this.disabled = isDisabled; }

  changeHour(step: number) {
    this.model.changeHour(step);
    this.propagateModelChange();
  }

  changeMinute(step: number) {
    this.model.changeMinute(step);
    this.propagateModelChange();
  }

  changeSecond(step: number) {
    this.model.changeSecond(step);
    this.propagateModelChange();
  }

  updateHour(newVal: string) {
    this.model.updateHour(toInteger(newVal));
    this.propagateModelChange();
  }

  updateMinute(newVal: string) {
    this.model.updateMinute(toInteger(newVal));
    this.propagateModelChange();
  }

  updateSecond(newVal: string) {
    this.model.updateSecond(toInteger(newVal));
    this.propagateModelChange();
  }

  toggleMeridian() {
    if (this.meridian) {
      this.changeHour(12);
    }
  }

  formatHour(value: number) {
    if (isNumber(value)) {
      if (this.meridian) {
        return padNumber(value % 12 === 0 ? 12 : value % 12);
      } else {
        return padNumber(value % 24);
      }
    } else {
      return padNumber(NaN);
    }
  }

  formatMinSec(value: number) { return padNumber(value); }

  setFormControlSize() { return {'form-control-sm': this.size === 'small', 'form-control-lg': this.size === 'large'}; }

  setButtonSize() { return {'btn-sm': this.size === 'small', 'btn-lg': this.size === 'large'}; }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['seconds'] && !this.seconds && this.model && !isNumber(this.model.second)) {
      this.model.second = 0;
      this.propagateModelChange(false);
    }
  }

  private propagateModelChange(touched = true) {
    if (touched) {
      this.onTouched();
    }
    if (this.model.isValid(this.seconds)) {
      this.onChange({hour: this.model.hour, minute: this.model.minute, second: this.model.second});
    } else {
      this.onChange(null);
    }
  }
}
