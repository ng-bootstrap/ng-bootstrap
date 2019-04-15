import {isNumber, toInteger} from '../util/util';
import {isDefined} from '@angular/compiler/src/util';



interface PartSpec {
  initialValue?: number;
  transform: (value: number) => number;
  propagate?: (value: number, transformed: number) => void;
}

export class Part {
  value: number;

  constructor(private spec: PartSpec) {
    const {initialValue} = spec;
    if (isDefined(initialValue)) {
      this.value = toInteger(initialValue);
    }
  }

  shift(step = 1) {
    const {value} = this;
    this.set((isNaN(value) ? 0 : value) + step);
  }

  set(value: number, doPropagate = true) {
    if (!isNumber(value)) {
      this.value = NaN;
      return;
    }

    const {transform, propagate} = this.spec;
    const finalValue = transform(value);
    this.value = finalValue;
    if (doPropagate && isDefined(propagate)) {
      propagate(value, finalValue);
    }
  }
}



export class NgbTime {
  hourPart: Part;
  minutePart: Part;
  secondPart: Part;

  get hour(): number { return this.hourPart.value; }
  get minute(): number { return this.minutePart.value; }
  get second(): number { return this.secondPart.value; }

  constructor(hour?: number, minute?: number, second?: number) {
    this.hourPart = new Part({
      initialValue: hour,
      transform: value => (value < 0 ? 24 + value : value) % 24,
    });

    this.minutePart = new Part({
      initialValue: minute,
      transform: value => value % 60 < 0 ? 60 + value % 60 : value % 60,
      propagate: value => this.shiftHour(Math.floor(value / 60)),
    });

    this.secondPart = new Part({
      initialValue: second,
      transform: value => value < 0 ? 60 + value % 60 : value % 60,
      propagate: value => this.shiftMinute(Math.floor(value / 60)),
    });
  }

  shiftHour(step: number) { this.hourPart.shift(step); }
  shiftMinute(step: number) { this.minutePart.shift(step); }
  shiftSecond(step: number) { this.secondPart.shift(step); }

  setHour(value: number, propagate?: boolean) { this.hourPart.set(value, propagate); }
  setMinute(value: number, propagate?: boolean) { this.minutePart.set(value, propagate); }
  setSecond(value: number, propagate?: boolean) { this.secondPart.set(value, propagate); }

  isValid(checkSecs = true) {
    return isNumber(this.hour) && isNumber(this.minute) && (checkSecs ? isNumber(this.second) : true);
  }

  toString() {
    return [this.hour, this.minute, this.second].map(value => isNaN(value) || !isDefined(value) ? 0 : value).join(':');
  }
}
