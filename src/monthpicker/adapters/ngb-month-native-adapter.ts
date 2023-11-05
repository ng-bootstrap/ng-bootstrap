import { Injectable } from '@angular/core';
import { NgbMonthAdapter } from './ngb-month-adapter';
import { NgbMonthStruct } from '../ngb-month-struct';
import { isInteger } from '../../util/util';

/**
 * [`NgbDateAdapter`](#/components/datepicker/api#NgbDateAdapter) implementation that uses
 * native javascript dates as a user date model.
 */
@Injectable()
export class NgbMonthNativeAdapter extends NgbMonthAdapter<Date> {
	/**
	 * Converts a native `Date` to a `NgbMonthStruct`.
	 */
	fromModel(date: Date | null): NgbMonthStruct | null {
		return date instanceof Date && !isNaN(date.getTime()) ? this._fromNativeDate(date) : null;
	}

	/**
	 * Converts a `NgbMonthStruct` to a native `Date`.
	 */
	toModel(date: NgbMonthStruct | null): Date | null {
		return date && isInteger(date.year) && isInteger(date.month) ? this._toNativeDate(date) : null;
	}

	protected _fromNativeDate(date: Date): NgbMonthStruct {
		return { year: date.getFullYear(), month: date.getMonth() + 1 };
	}

	protected _toNativeDate(date: NgbMonthStruct): Date {
		const jsDate = new Date(date.year, date.month - 1);
		// avoid 30 -> 1930 conversion
		jsDate.setFullYear(date.year);
		return jsDate;
	}
}
