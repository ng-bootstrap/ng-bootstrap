import { Injectable } from '@angular/core';
import { NgbMonthStruct } from '../ngb-month-struct';
import { isInteger } from '../../util/util';

export function NGB_MONTHPICKER_DATE_ADAPTER_FACTORY() {
	return new NgbMonthStructAdapter();
}

/**
 * An abstract service that does the conversion between the internal monthpicker `NgbMonthStruct` model and
 * any provided user date model `D`, ex. a string, a native date, etc.
 *
 * The adapter is used **only** for conversion when binding monthpicker to a form control,
 * ex. `[(ngModel)]="userDateModel"`. Here `userDateModel` can be of any type.
 *
 * The default monthpicker implementation assumes we use `NgbMonthStruct` as a user model.
 *
 * See the [date format overview](#/components/monthpicker/overview#date-model) for more details
 * and the [custom adapter demo](#/components/monthpicker/examples#adapter) for an example.
 */
@Injectable({ providedIn: 'root', useFactory: NGB_MONTHPICKER_DATE_ADAPTER_FACTORY })
export abstract class NgbMonthAdapter<D> {
	/**
	 * Converts a user-model date of type `D` to an `NgbMonthStruct` for internal use.
	 */
	abstract fromModel(value: D | null): NgbMonthStruct | null;

	/**
	 * Converts an internal `NgbMonthStruct` date to a user-model date of type `D`.
	 */
	abstract toModel(date: NgbMonthStruct | null): D | null;
}

@Injectable()
export class NgbMonthStructAdapter extends NgbMonthAdapter<NgbMonthStruct> {
	/**
	 * Converts a NgbMonthStruct value into NgbMonthStruct value
	 */
	fromModel(date: NgbMonthStruct | null): NgbMonthStruct | null {
		return date && isInteger(date.year) && isInteger(date.month) ? { year: date.year, month: date.month } : null;
	}

	/**
	 * Converts a NgbMonthStruct value into NgbMonthStruct value
	 */
	toModel(date: NgbMonthStruct | null): NgbMonthStruct | null {
		return date && isInteger(date.year) && isInteger(date.month) ? { year: date.year, month: date.month } : null;
	}
}
