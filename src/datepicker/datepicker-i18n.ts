import { inject, Injectable, LOCALE_ID } from '@angular/core';
import { formatDate } from '@angular/common';
import { NgbDateStruct } from './ngb-date-struct';

/**
 * A service supplying i18n data to the datepicker component.
 *
 * The default implementation of this service uses the Angular locale and registered locale data for
 * weekdays and month names (as explained in the Angular i18n guide).
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
	useFactory: () => new NgbDatepickerI18nDefault(),
})
export abstract class NgbDatepickerI18n {
	/**
	 * Returns the weekday label using specified width
	 *
	 * @since 9.1.0
	 */
	abstract getWeekdayLabel(weekday: number, width?: Exclude<Intl.DateTimeFormatOptions['weekday'], undefined>): string;

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
	 *
	 * @since 9.1.0
	 */
	getMonthLabel(date: NgbDateStruct): string {
		return `${this.getMonthFullName(date.month, date.year)} ${this.getYearNumerals(date.year)}`;
	}

	/**
	 * Returns the value of the `aria-label` attribute for a specific date.
	 *
	 * @since 2.0.0
	 */
	abstract getDayAriaLabel(date: NgbDateStruct): string;

	/**
	 * Returns the textual representation of a day that is rendered in a day cell.
	 *
	 * @since 3.0.0
	 */
	getDayNumerals(date: NgbDateStruct): string {
		return `${date.day}`;
	}

	/**
	 * Returns the textual representation of a week number rendered by datepicker.
	 *
	 * @since 3.0.0
	 */
	getWeekNumerals(weekNumber: number): string {
		return `${weekNumber}`;
	}

	/**
	 * Returns the textual representation of a year that is rendered in the datepicker year select box.
	 *
	 * @since 3.0.0
	 */
	getYearNumerals(year: number): string {
		return `${year}`;
	}

	/**
	 * Returns the week label to display in the heading of the month view.
	 *
	 * @since 9.1.0
	 */
	getWeekLabel(): string {
		return '';
	}
}

/**
 * A service providing default implementation for the datepicker i18n.
 * It can be used as a base implementation if necessary.
 *
 * @since 9.1.0
 */
@Injectable()
export class NgbDatepickerI18nDefault extends NgbDatepickerI18n {
	private _locale = inject(LOCALE_ID);

	private _monthsShort = [...Array(12).keys()].map((month) =>
		Intl.DateTimeFormat(this._locale, { month: 'short', timeZone: 'UTC' }).format(new Date(2000, month, 15)),
	);
	private _monthsFull = [...Array(12).keys()].map((month) =>
		Intl.DateTimeFormat(this._locale, { month: 'long', timeZone: 'UTC' }).format(new Date(2000, month, 15)),
	);

	getWeekdayLabel(
		weekday: number,
		width: Exclude<Intl.DateTimeFormatOptions['weekday'], undefined> = 'narrow',
	): string {
		const weekdaysStartingOnSunday = [...Array(7).keys()].map((day) =>
			Intl.DateTimeFormat(this._locale, { weekday: width, timeZone: 'UTC' }).format(
				new Date(Date.UTC(2021, 5, day - 1)),
			),
		);
		const weekdays = weekdaysStartingOnSunday.map((day, index) => weekdaysStartingOnSunday[(index + 1) % 7]);
		return weekdays[weekday - 1] || '';
	}

	getMonthShortName(month: number): string {
		return this._monthsShort[month - 1] || '';
	}

	getMonthFullName(month: number): string {
		return this._monthsFull[month - 1] || '';
	}

	getDayAriaLabel(date: NgbDateStruct): string {
		const jsDate = new Date(date.year, date.month - 1, date.day);
		return formatDate(jsDate, 'fullDate', this._locale);
	}
}
