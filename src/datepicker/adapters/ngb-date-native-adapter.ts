import {Injectable} from '@angular/core';
import {NgbDateAdapter} from './ngb-date-adapter';
import {NgbDateStruct} from '../ngb-date-struct';
import {isNumber} from 'util';

@Injectable()
export class NgbDateNativeAdapter extends NgbDateAdapter<Date> {
  fromModel(date: Date): NgbDateStruct {
    return (date instanceof Date && !isNaN(date.getTime())) ? this._fromNativeDate(date) : null;
  }

  toModel(date: NgbDateStruct): Date {
    return date && isNumber(date.year) && isNumber(date.month) && isNumber(date.day) ? this._toNativeDate(date) : null;
  }

  protected _fromNativeDate(date: Date): NgbDateStruct {
    return {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()};
  }

  protected _toNativeDate(date: NgbDateStruct): Date {
    const jsDate = new Date(date.year, date.month - 1, date.day, 12);
    // avoid 30 -> 1930 conversion
    jsDate.setFullYear(date.year);
    return jsDate;
  }
}
