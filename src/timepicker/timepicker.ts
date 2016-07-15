import {Component, Directive, Input, forwardRef} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/common';

const NGB_TIMEPICKER_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NgbTimePicker),
  multi: true
};

//  TODO: use this and have an interface / type as well
export class NgbTime {
  constructor(public hour: number, public minute: number, public second: number) {}
}

@Component({
  selector: 'ngb-timepicker',
  providers: [NGB_TIMEPICKER_VALUE_ACCESSOR],
  template: `
    <input [ngModel]="model?.hour" (ngModelChange)="updateHour($event)">:
    <input [ngModel]="model?.minute" (ngModelChange)="updateMinute($event)">
    <br>
    <button (click)="incrementHour()">H+</button>
    <button (click)="decrementHour()">H-</button>
    <button (click)="incrementMinute()">M+</button>
    <button (click)="decrementMinute()">M-</button>
  `
})
export class NgbTimePicker implements ControlValueAccessor {
  private model;

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
    // TODO: make sure that it doesn't go above 23
    this.model.hour++;
    this.onTouched();
    this.onChange(this.model);
  }

  decrementHour() {
    // TODO: make sure that it doesn't go below 0
    this.model.hour--;
    this.propagateModelChange();
  }

  incrementMinute() {
    // TODO: make sure that it doesn't go above 59 and increment hour if it does
    this.model.minute++;
    this.propagateModelChange();
  }
  
  decrementMinute() {
    // TODO: make sure that it doesn't go above 59 and increment hour if it does
    this.model.minute--;
    this.propagateModelChange();
  }
  
  updateHour(newVal) {
    // TODO: make sure that this is a valid value for an hour
    this.model.hour = parseInt(newVal);
    this.propagateModelChange();
  }
  
  updateMinute(newVal) {
    // TODO: make sure that this is a valid value for a minute
    this.model.minute = parseInt(newVal);
    this.propagateModelChange();
  }

  private propagateModelChange() {
    this.onTouched();
    this.onChange(this.model);
  } 
  // TODO: formatting of minutes / hours
  // TODO: could it use OnPush strategy?
}


export const NGB_TIMEPICKER_DIRECTIVES = [ NgbTimePicker ];
