import {Component, Input, forwardRef} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/common';

import {isNumber, padNumber, toInteger} from '../util/util';
import {NgbTime} from './ngb-time';

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
      vertical-align: middle;
      width: 0.71em;
    }
    
    .chevron.bottom:before {
      top: -.3em;
      transform: rotate(135deg);
    }
    
    .btn-link {
      outline: 0;
    }

    .btn-link.disabled {
      cursor: not-allowed;
      opacity: .65;
    }
  `],
  template: `
     <fieldset [disabled]="disabled" [class.disabled]="disabled">
      <table>
        <tr>
          <td class="text-xs-center">
            <button class="btn-link" (click)="changeHour(hourStep)"
              [class.disabled]="disabled">
              <span class="chevron"></span>
            </button>
          </td>
          <td>&nbsp;</td>
          <td class="text-xs-center">
            <button class="btn-link" (click)="changeMinute(minuteStep)"
              [class.disabled]="disabled">
                <span class="chevron"></span>
            </button>
          </td>
          <template [ngIf]="seconds">
            <td>&nbsp;</td>
            <td class="text-xs-center">
              <button class="btn-link" (click)="changeSecond(secondStep)"
                [class.disabled]="disabled">
                <span class="chevron"></span>
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
            <input type="text" class="form-control" maxlength="2" size="2" placeholder="HH"
              [ngModel]="formatHour(model?.hour)" (ngModelChange)="updateHour($event)" 
              [readonly]="readonlyInputs">
          </td>
          <td>&nbsp;:&nbsp;</td>
          <td>
            <input type="text" class="form-control" maxlength="2" size="2" placeholder="MM"
              [ngModel]="formatMinSec(model?.minute)" (ngModelChange)="updateMinute($event)" 
              [readonly]="readonlyInputs">
          </td>
          <template [ngIf]="seconds">
            <td>&nbsp;:&nbsp;</td>
            <input type="text" class="form-control" maxlength="2" size="2" placeholder="SS"
              [ngModel]="formatMinSec(model?.second)" (ngModelChange)="updateSecond($event)" 
              [readonly]="readonlyInputs">
          </template>
          <template [ngIf]="meridian">
            <td>&nbsp;&nbsp;</td>
            <td>
              <button class="btn btn-primary-outline" (click)="toggleMeridian()">{{model.hour > 12 ? 'PM' : 'AM'}}</button>
            </td>
          </template>
        </tr>
        <tr>
          <td class="text-xs-center">
            <button class="btn-link" (click)="changeHour(-hourStep)" 
              [class.disabled]="disabled">
              <span class="chevron bottom"></span>
            </button>
          </td>
          <td>&nbsp;</td>
          <td class="text-xs-center">
            <button class="btn-link" (click)="changeMinute(-minuteStep)"
              [class.disabled]="disabled">
              <span class="chevron bottom"></span>
            </button>
          </td>
          <template [ngIf]="seconds">
            <td>&nbsp;</td>
            <td class="text-xs-center">
              <button class="btn-link" (click)="changeSecond(-secondStep)"
                [class.disabled]="disabled">
                <span class="chevron bottom"></span>
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
export class NgbTimepicker implements ControlValueAccessor {
  private model: NgbTime;

  /**
   * Whether to display 12H or 24H mode.
   */
  @Input() meridian = false;

  /**
   * Whether to display seconds input.
   */
  @Input() seconds = false;

  /**
   * Number of hours to increase or decrease when using a button.
   */
  @Input() hourStep = 1;

  /**
   * Number of minutes to increase or decrease when using a button.
   */
  @Input() minuteStep = 1;

  /**
   * Number of seconds to increase or decrease when using a button.
   */
  @Input() secondStep = 1;

  /**
   * To disable timepicker
   */
  @Input() disabled = false;

  /**
   * To make timepicker readonly
   */
  @Input() readonlyInputs = false;

  onChange = (_: any) => {};
  onTouched = () => {};

  writeValue(value) { this.model = value ? new NgbTime(value.hour, value.minute, value.second) : new NgbTime(); }

  registerOnChange(fn: (value: any) => any): void { this.onChange = fn; }

  registerOnTouched(fn: () => any): void { this.onTouched = fn; }

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

  updateHour(newVal: string | number) {
    this.model.updateHour(toInteger(newVal) || 0);
    this.propagateModelChange();
  }

  updateMinute(newVal: string | number) {
    this.model.updateMinute(toInteger(newVal) || 0);
    this.propagateModelChange();
  }

  updateSecond(newVal: string | number) {
    this.model.updateSecond(toInteger(newVal) || 0);
    this.propagateModelChange();
  }

  toggleMeridian() {
    if (this.meridian) {
      this.changeHour(12);
    }
  }

  private formatHour(value: number) { return padNumber(isNumber(value) ? (value % (this.meridian ? 12 : 24)) : NaN); }

  private formatMinSec(value: number) { return padNumber(value); }

  private propagateModelChange() {
    this.onTouched();
    this.onChange({hour: this.model.hour, minute: this.model.minute, second: this.model.second});
  }
}

export const NGB_TIMEPICKER_DIRECTIVES = [NgbTimepicker];
