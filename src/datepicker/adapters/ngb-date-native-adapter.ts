import {Injectable} from '@angular/core';
import {NgbDateAdapter} from './ngb-date-adapter';
import {NgbDateStruct} from '../ngb-date-struct';
import {isInteger} from '../../util/util';

/**
* NgbDateAdapter implementation that allows using native javascript date as a user date model.
 */
@Injectable()
export class NgbDateNativeAdapter extends NgbDateAdapter<Date> {
  /**
   * Converts native date to a NgbDateStruct
   */
  fromModel(date: Date): NgbDateStruct {
    return (date instanceof Date && !isNaN(date.getTime())) ? this._fromNativeDate(date) : null;
  }

  /**
   * Converts a NgbDateStruct to a native date
   */
  toModel(date: NgbDateStruct): Date {
    return date && isInteger(date.year) && isInteger(date.month) && isInteger(date.day) ? this._toNativeDate(date) :
                                                                                          null;
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
