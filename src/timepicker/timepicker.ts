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
    <input [ngModel]="model?.hour" (ngModelChange)="updateHour($event)" [maxLength]=2> <span> : </span>
    <input [ngModel]="model?.minute" (ngModelChange)="updateMinute($event)" [maxLength]=2> <span *ngIf="seconds" > : </span>
    <input [ngModel]="model?.second" *ngIf="seconds" (ngModelChange)="updateSecond($event)" [maxLength]=2>
    <br>
    <button (click)="incrementHour()">H+</button>
    <button (click)="decrementHour()">H-</button>
    <button (click)="incrementMinute()">M+</button>
    <button (click)="decrementMinute()">M-</button>
    <button (click)="incrementSecond()" *ngIf="seconds">S+</button>
    <button (click)="decrementSecond()" *ngIf="seconds">S-</button>
 
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgbTimepicker implements ControlValueAccessor {
  private model;

  @Input() seconds = false;

  onChange = (_: any) => {};
  onTouched = () => {};

  //  invoked when model changes
  writeValue(value) {
    // TODO: validate shape of the object
    // TODO: do I need to observe value changes "manually"?
    this.model = value ? {hour: value.hour, minute: value.minute} : null;
  }

  //  function called when control value gets updated by a user
  registerOnChange(fn: (value: any) => any): void { this.onChange = fn; }

  registerOnTouched(fn: () => any): void { this.onTouched = fn; }

  incrementHour() {
    this.model.hour++;
    if (this.model.hour > 23) {
      this.model.hour = 0;
    }
    this.onTouched();
    this.onChange(this.model);
  }

  decrementHour() {
    this.model.hour--;
    if (this.model.hour < 0) {
      this.model.hour = 23;
    }
    this.propagateModelChange();
  }

  incrementMinute() {
    this.model.minute++;
    if (this.model.minute > 59) {
      this.model.minute = 0;
      this.incrementHour();
    }
    this.propagateModelChange();
  }

  decrementMinute() {
    this.model.minute--;
    if (this.model.minute < 0) {
      this.model.minute = 59;
      this.decrementHour();
    }
    this.propagateModelChange();
  }

  incrementSecond() {
    this.model.second++;
    if (this.model.second > 59) {
      this.model.second = 0;
      this.incrementMinute();
    }
    this.propagateModelChange();
  }

  decrementSecond() {
    this.model.second--;
    if (this.model.second < 0) {
      this.model.second = 59;
      this.decrementMinute();
    }
    this.propagateModelChange();
  }

  updateHour(newVal) {
    let hour = toInteger(newVal);

    if (hour) {
      this.model.hour = hour >= 0 && hour < 24 ? hour : 23;
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
}


export const NGB_TIMEPICKER_DIRECTIVES = [NgbTimepicker];
