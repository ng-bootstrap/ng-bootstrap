import {Component, ChangeDetectionStrategy, Directive, Input, forwardRef} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/common';

import {toInteger} from '../util/util';

const NGB_TIMEPICKER_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NgbTimepicker),
  multi: true
};

//  TODO: use this and have an interface / type as well
export class NgbTime {
  constructor(public hour: number, public minute: number, public second: number) {}
}

@Component({
  selector: 'ngb-timepicker',
  exportAs: 'ngbTimepicker',
  providers: [NGB_TIMEPICKER_VALUE_ACCESSOR],
  template: `
    <fieldset [disabled]="disabled">
    <div class="input-group">
      <input type="text" class="form-control" [ngModel]="model?.hour" (ngModelChange)="updateHour($event)" 
        [maxLength]=2>
      <span class="input-group-addon"> : </span>
      <input type="text" class="form-control" [ngModel]="model?.minute" (ngModelChange)="updateMinute($event)" 
        [maxLength]=2>
      <span *ngIf="seconds" class="input-group-addon"> : </span>
      <input type="text" class="form-control" [ngModel]="model?.second" *ngIf="seconds" 
          (ngModelChange)="updateSecond($event)" [maxLength]=2>
    </div>
    <br>
    <button type="button" *ngIf="meridian" class="btn btn-primary" 
        (click)="toggleMeridian()">{{meridianVal}}</button>
    <button type="button" class="btn btn-primary" (click)="incrementHour()">H+</button>
    <button type="button" class="btn btn-primary" (click)="decrementHour()">H-</button>
    <button type="button" class="btn btn-primary" (click)="incrementMinute()">M+</button>
    <button type="button" class="btn btn-primary" (click)="decrementMinute()">M-</button>
    <button type="button" class="btn btn-primary" (click)="incrementSecond()" *ngIf="seconds">S+</button>
    <button type="button" class="btn btn-primary" (click)="decrementSecond()" *ngIf="seconds">S-</button>
  </fieldset>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgbTimepicker implements ControlValueAccessor {
  private model;
  private meridianVal = 'AM';

  @Input() seconds = false;

  @Input() meridian = false;

  @Input() duration = false;

  @Input() hourStep = 1;

  @Input() minuteStep = 1;

  @Input() secondStep = 1;

  @Input() disabled = false;

  onChange = (_: any) => {};
  onTouched = () => {};

  //  invoked when model changes
  writeValue(value) {
    // TODO: do I need to observe value changes "manually"?
    this.model = value ? this._validateFormat(value) : null;
  }

  //  function called when control value gets updated by a user
  registerOnChange(fn: (value: any) => any): void { this.onChange = fn; }

  registerOnTouched(fn: () => any): void { this.onTouched = fn; }

  incrementHour() {
    this.model.hour += this.hourStep;
    this.model.hour =
        this.model.hour <= this._originalHour() ? this.model.hour : (this.model.hour - this._originalHour());
    if (this.model.hour > this._maxHour()) {
      this.model.hour = this._meridianUpdate(this.model.hour);
    }
    this.onTouched();
    this.onChange(this.model);
  }

  decrementHour() {
    this.model.hour -= this.hourStep;
    if (this.model.hour < 0) {
      // Note : here the hour will be negative
      this.model.hour = this._originalHour() + this.model.hour;
    }
    if (this.model.hour > this._maxHour()) {
      this.model.hour = this._meridianUpdate(this.model.hour);
    }
    this.propagateModelChange();
  }

  incrementMinute() {
    this.model.minute += this.minuteStep;
    if (this.model.minute > 59) {
      this.model.minute -= 60;
      this.incrementHour();
    }
    this.propagateModelChange();
  }

  decrementMinute() {
    this.model.minute -= this.minuteStep;
    if (this.model.minute < 0) {
      this.model.minute = 59;
      this.decrementHour();
    }
    this.propagateModelChange();
  }

  incrementSecond() {
    this.model.second += this.secondStep;
    if (this.model.second > 59) {
      this.model.second -= 60;
      this.incrementMinute();
    }
    this.propagateModelChange();
  }

  decrementSecond() {
    this.model.second -= this.secondStep;
    if (this.model.second < 0) {
      this.model.second = 59;
      this.decrementMinute();
    }
    this.propagateModelChange();
  }

  updateHour(newVal) {
    let hour = toInteger(newVal);
    if (hour) {
      this.model.hour = hour >= 0 && hour <= this._maxHour() ? hour : this._maxHour();
    } else {
      this.model.hour = 0;
    }
    this.propagateModelChange();
  }

  updateMinute(newVal) {
    let minute = toInteger(newVal);
    if (minute) {
      this.model.minute = minute >= 0 && minute < 60 ? minute : 59;
    } else {
      this.model.minute = 0;
    }
    this.propagateModelChange();
  }

  updateSecond(newVal) {
    let second = toInteger(newVal);
    if (second) {
      this.model.second = second >= 0 && second < 60 ? second : 59;
    } else {
      this.model.second = 0;
    }
    this.propagateModelChange();
  }

  private propagateModelChange() {
    this.onTouched();
    this.onChange(this.model);
  }
  // TODO: formatting of minutes / hours
  // TODO: could it use OnPush strategy?

  private _originalHour() { return this.duration ? this.model.hour : 23; }

  private _maxHour() { return this.duration ? this.model.hour : (this.meridian ? 11 : 23); }

  toggleMeridian() {
    if (this.meridian) {
      this.meridianVal = this.meridianVal !== 'AM' ? 'AM' : 'PM';
    }
  }

  private _meridianUpdate(hourValue) {
    this.toggleMeridian();
    hourValue = hourValue - (this._maxHour() + 1);
    return hourValue;
  }

  private _validateFormat(value) {
    if (value.hour > this._maxHour()) {
      value.hour = this._meridianUpdate(value.hour);
    }
    value.minutes = value.minutes < 0 ? 0 : value.minutes > 60 ? 59 : value.minutes;

    if (this.seconds) {
      value.seconds = value.seconds < 0 ? 0 : value.seconds > 60 ? 59 : value.seconds;
    }
    return value;
  }
}


export const NGB_TIMEPICKER_DIRECTIVES = [NgbTimepicker];
