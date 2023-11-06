import { inject, Injectable, LOCALE_ID } from '@angular/core';
import { FormStyle, getLocaleMonthNames, TranslationWidth } from '@angular/common';
import { NgbMonthStruct } from './ngb-month-struct';

/**
 * A service supplying i18n data to the datepicker component.
 *
 * The default implementation of this service uses the Angular locale and registered locale data for
 * month names (as explained in the Angular i18n guide).
 *
 * It also provides a way to i18n data that depends on calendar calculations, like aria labels, day, week and year
 * numerals. For other static labels the datepicker uses the default Angular i18n.
 *
 * See the [i18n demo](#/components/datepicker/examples#i18n) and
 * [Hebrew calendar demo](#/components/datepicker/calendars#hebrew) on how to extend this class and define
 * a custom provider for i18n.
 */
@Injectable({
	providedIn: 'root',
	useFactory: () => new NgbMonthpickerI18nDefault(),
})
export abstract class NgbMonthpickerI18n {
	/**
	 * Returns the short month name to display in the date picker navigation.
	 *
	 * With default calendar we use ISO 8601: 'month' is 1=Jan ... 12=Dec.
	 */
	abstract getMonthShortName(month: number, year?: number): string;

	/**
	 * Returns the full month name to display in the date picker navigation.
	 *
	 * With default calendar we use ISO 8601: 'month' is 1=Jan ... 12=Dec.
	 */
	abstract getMonthFullName(month: number, year?: number): string;

	/**
	 * Returns the text label to display above the day view.
	 */
	getMonthLabel(date: NgbMonthStruct): string {
		return `${this.getMonthFullName(date.month, date.year)} ${this.getYearNumerals(date.year)}`;
	}

	/**
	 * Returns the textual representation of a year that is rendered in the datepicker year select box.
	 */
	getYearNumerals(year: number): string {
		return `${year}`;
	}
}

/**
 * A service providing default implementation for the monthpicker i18n.
 * It can be used as a base implementation if necessary.
 */
@Injectable()
export class NgbMonthpickerI18nDefault extends NgbMonthpickerI18n {
	private _locale = inject(LOCALE_ID);

	private _monthsShort = getLocaleMonthNames(this._locale, FormStyle.Standalone, TranslationWidth.Abbreviated);
	private _monthsFull = getLocaleMonthNames(this._locale, FormStyle.Standalone, TranslationWidth.Wide);

	getMonthShortName(month: number): string {
		return this._monthsShort[month - 1] || '';
	}

	getMonthFullName(month: number): string {
		return this._monthsFull[month - 1] || '';
	}
}
