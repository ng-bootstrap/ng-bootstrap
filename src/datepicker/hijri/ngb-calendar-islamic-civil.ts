import { NgbCalendarHijri } from './ngb-calendar-hijri';
import { NgbDate } from '../ngb-date';
import { Injectable } from '@angular/core';

/**
 * Checks if islamic year is a leap year
 */
function isIslamicLeapYear(hYear: number): boolean {
	return (14 + 11 * hYear) % 30 < 11;
}

/**
 * Checks if gregorian years is a leap year
 */
function isGregorianLeapYear(gDate: Date): boolean {
	const year = gDate.getFullYear();
	return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Returns the start of Hijri Month.
 * `hMonth` is 0 for Muharram, 1 for Safar, etc.
 * `hYear` is any Hijri hYear.
 */
function getIslamicMonthStart(hYear: number, hMonth: number): number {
	return Math.ceil(29.5 * hMonth) + (hYear - 1) * 354 + Math.floor((3 + 11 * hYear) / 30.0);
}

/**
 * Returns the start of Hijri year.
 * `year` is any Hijri year.
 */
function getIslamicYearStart(year: number): number {
	return (year - 1) * 354 + Math.floor((3 + 11 * year) / 30.0);
}

function mod(a: number, b: number): number {
	return a - b * Math.floor(a / b);
}

/**
 * The civil calendar is one type of Hijri calendars used in islamic countries.
 * Uses a fixed cycle of alternating 29- and 30-day months,
 * with a leap day added to the last month of 11 out of every 30 years.
 * http://cldr.unicode.org/development/development-process/design-proposals/islamic-calendar-types
 * All the calculations here are based on the equations from "Calendrical Calculations" By Edward M. Reingold, Nachum
 * Dershowitz.
 */

const GREGORIAN_EPOCH = 1721425.5;
const ISLAMIC_EPOCH = 1948439.5;

@Injectable()
export class NgbCalendarIslamicCivil extends NgbCalendarHijri {
	/**
	 * Returns the equivalent islamic(civil) date value for a give input Gregorian date.
	 * `gDate` is a JS Date to be converted to Hijri.
	 */
	fromGregorian(gDate: Date): NgbDate {
		const gYear = gDate.getFullYear(),
			gMonth = gDate.getMonth(),
			gDay = gDate.getDate();

		let julianDay =
			GREGORIAN_EPOCH -
			1 +
			365 * (gYear - 1) +
			Math.floor((gYear - 1) / 4) +
			-Math.floor((gYear - 1) / 100) +
			Math.floor((gYear - 1) / 400) +
			Math.floor((367 * (gMonth + 1) - 362) / 12 + (gMonth + 1 <= 2 ? 0 : isGregorianLeapYear(gDate) ? -1 : -2) + gDay);
		julianDay = Math.floor(julianDay) + 0.5;

		const days = julianDay - ISLAMIC_EPOCH;
		const hYear = Math.floor((30 * days + 10646) / 10631.0);
		let hMonth = Math.ceil((days - 29 - getIslamicYearStart(hYear)) / 29.5);
		hMonth = Math.min(hMonth, 11);
		const hDay = Math.ceil(days - getIslamicMonthStart(hYear, hMonth)) + 1;
		return new NgbDate(hYear, hMonth + 1, hDay);
	}

	/**
	 * Returns the equivalent JS date value for a give input islamic(civil) date.
	 * `hDate` is an islamic(civil) date to be converted to Gregorian.
	 */
	toGregorian(hDate: NgbDate): Date {
		const hYear = hDate.year;
		const hMonth = hDate.month - 1;
		const hDay = hDate.day;
		const julianDay =
			hDay + Math.ceil(29.5 * hMonth) + (hYear - 1) * 354 + Math.floor((3 + 11 * hYear) / 30) + ISLAMIC_EPOCH - 1;

		const wjd = Math.floor(julianDay - 0.5) + 0.5,
			depoch = wjd - GREGORIAN_EPOCH,
			quadricent = Math.floor(depoch / 146097),
			dqc = mod(depoch, 146097),
			cent = Math.floor(dqc / 36524),
			dcent = mod(dqc, 36524),
			quad = Math.floor(dcent / 1461),
			dquad = mod(dcent, 1461),
			yindex = Math.floor(dquad / 365);
		let year = quadricent * 400 + cent * 100 + quad * 4 + yindex;
		if (!(cent === 4 || yindex === 4)) {
			year++;
		}

		const gYearStart =
			GREGORIAN_EPOCH +
			365 * (year - 1) +
			Math.floor((year - 1) / 4) -
			Math.floor((year - 1) / 100) +
			Math.floor((year - 1) / 400);

		const yearday = wjd - gYearStart;

		const tjd =
			GREGORIAN_EPOCH -
			1 +
			365 * (year - 1) +
			Math.floor((year - 1) / 4) -
			Math.floor((year - 1) / 100) +
			Math.floor((year - 1) / 400) +
			Math.floor(739 / 12 + (isGregorianLeapYear(new Date(year, 3, 1)) ? -1 : -2) + 1);

		const leapadj = wjd < tjd ? 0 : isGregorianLeapYear(new Date(year, 3, 1)) ? 1 : 2;

		const month = Math.floor(((yearday + leapadj) * 12 + 373) / 367);
		const tjd2 =
			GREGORIAN_EPOCH -
			1 +
			365 * (year - 1) +
			Math.floor((year - 1) / 4) -
			Math.floor((year - 1) / 100) +
			Math.floor((year - 1) / 400) +
			Math.floor(
				(367 * month - 362) / 12 + (month <= 2 ? 0 : isGregorianLeapYear(new Date(year, month - 1, 1)) ? -1 : -2) + 1,
			);

		const day = wjd - tjd2 + 1;

		return new Date(year, month - 1, day);
	}

	/**
	 * Returns the number of days in a specific Hijri month.
	 * `month` is 1 for Muharram, 2 for Safar, etc.
	 * `year` is any Hijri year.
	 */
	getDaysPerMonth(month: number, year: number): number {
		year = year + Math.floor(month / 13);
		month = ((month - 1) % 12) + 1;
		let length = 29 + (month % 2);
		if (month === 12 && isIslamicLeapYear(year)) {
			length++;
		}
		return length;
	}
}
