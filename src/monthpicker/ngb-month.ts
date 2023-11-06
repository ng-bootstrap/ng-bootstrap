import { NgbMonthStruct } from './ngb-month-struct';
import { isInteger } from '../util/util';

/**
 * A simple class that represents a month that monthpicker also uses internally.
 *
 * It is the implementation of the `NgbMonthStruct` interface that adds some convenience methods,
 * like `.equals()`, `.before()`, etc.
 *
 * All monthpicker APIs consume `NgbMonthStruct`, but return `NgbMonth`.
 *
 * In many cases it is simpler to manipulate these objects together with
 * [`NgbCalendar`](#/components/monthpicker/api#NgbCalendar) than native JS Dates.
 *
 * See the [date format overview](#/components/monthpicker/overview#date-model) for more details.
 */
export class NgbMonth implements NgbMonthStruct {
	/**
	 * The year, for example 2016
	 */
	year: number;

	/**
	 * The month, for example 1=Jan ... 12=Dec as in ISO 8601
	 */
	month: number;

	/**
	 * A **static method** that creates a new date object from the `NgbMonthStruct`,
	 *
	 * ex. `NgbMonth.from({year: 2000, month: 5})`.
	 *
	 * If the `date` is already of `NgbMonth` type, the method will return the same object.
	 */
	static from(date?: NgbMonthStruct | null): NgbMonth | null {
		if (date instanceof NgbMonth) {
			return date;
		}
		return date ? new NgbMonth(date.year, date.month) : null;
	}

	constructor(year: number, month: number) {
		this.year = isInteger(year) ? year : <any>null;
		this.month = isInteger(month) ? month : <any>null;
	}

	/**
	 * Checks if the current date is equal to another date.
	 */
	equals(other?: NgbMonthStruct | null): boolean {
		return other != null && this.year === other.year && this.month === other.month;
	}

	/**
	 * Checks if the current date is before another date.
	 */
	before(other?: NgbMonthStruct | null): boolean {
		if (!other) {
			return false;
		}

		if (this.year === other.year) {
			return this.month < other.month;
		} else {
			return this.year < other.year;
		}
	}

	/**
	 * Checks if the current date is after another date.
	 */
	after(other?: NgbMonthStruct | null): boolean {
		if (!other) {
			return false;
		}
		if (this.year === other.year) {
			return this.month > other.month;
		} else {
			return this.year > other.year;
		}
	}
}
