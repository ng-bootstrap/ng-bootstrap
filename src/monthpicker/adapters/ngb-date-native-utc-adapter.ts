import { Injectable } from '@angular/core';
import { NgbMonthStruct } from '../ngb-month-struct';
import { NgbMonthNativeAdapter } from './ngb-date-native-adapter';

/**
 * Same as [`NgbDateNativeAdapter`](#/components/datepicker/api#NgbDateNativeAdapter), but with UTC dates.
 *
 * @since 3.2.0
 */
@Injectable()
export class NgbMonthNativeUTCAdapter extends NgbMonthNativeAdapter {
	protected _fromNativeDate(date: Date): NgbMonthStruct {
		return { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1 };
	}

	protected _toNativeDate(date: NgbMonthStruct): Date {
		const jsDate = new Date(Date.UTC(date.year, date.month - 1));
		// avoid 30 -> 1930 conversion
		jsDate.setUTCFullYear(date.year);
		return jsDate;
	}
}
