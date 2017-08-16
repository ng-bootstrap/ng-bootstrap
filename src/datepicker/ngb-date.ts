import {Injectable, Inject, forwardRef} from '@angular/core';
import {NgbDateModelAdapter} from './ngb-date-model-adapter';

export class NgbDateService {
  constructor(@Inject(forwardRef(() => NgbDateModelAdapter)) private _modelAdapter: NgbDateModelAdapter) {}

  create(value: any): NgbDate { return this._modelAdapter.modelToNgbDate(value); }

  getValue(date: NgbDate): any { return this._modelAdapter.ngbDateToModel(date); }
}

export class NgbDate {
  static from(date: {year: number, month: number, day?: number}) {
    return date ? new NgbDate(date.year, date.month, date.day ? date.day : 1) : null;
  }

  constructor(public year: number, public month: number, public day: number) {}

  equals(other: NgbDate) {
    return other && this.year === other.year && this.month === other.month && this.day === other.day;
  }

  before(other: NgbDate) {
    if (!other) {
      return false;
    }

    if (this.year === other.year) {
      if (this.month === other.month) {
        return this.day === other.day ? false : this.day < other.day;
      } else {
        return this.month < other.month;
      }
    } else {
      return this.year < other.year;
    }
  }

  after(other: NgbDate) {
    if (!other) {
      return false;
    }
    if (this.year === other.year) {
      if (this.month === other.month) {
        return this.day === other.day ? false : this.day > other.day;
      } else {
        return this.month > other.month;
      }
    } else {
      return this.year > other.year;
    }
  }

  toStruct() { return {year: this.year, month: this.month, day: this.day}; }

  toString() { return `${this.year}-${this.month}-${this.day}`; }
}
