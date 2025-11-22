import { NgbDate } from '../ngb-date';

const JD_EPOCH = 1724220.5;
const DAYSPERMONTH = [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 5];

/**
 * Determine whether this date is in a leap year.
 * * `year` is the year to examine
 * returns boolean - true if this is a leap year, false if not
 * */

export function isEthiopianLeapYear(year: number): boolean {
	if (year != null) {
		return year % 4 == 3 || year % 4 == -1;
	}
	return false;
}

/**
 * Sets the Ethiopian year.
 * * `date` is Ethiopian date
 * * `yearValue` incremented year
 * returns NgbDate - ethiopian date
 * */

export function setEthiopianYear(date: NgbDate, yearValue: number): NgbDate {
	date.year = +yearValue;
	return date;
}

/**
 * Sets the Ethiopian month.
 * * `date` is Ethiopian date
 * * `val` incremented month
 * returns NgbDate - Ethiopian date
 * */
export function setEthiopianMonth(date: NgbDate, val: number): NgbDate {
	val = +val;
	date.year = date.year + Math.floor((val - 1) / 13);
	date.month = Math.floor((((val - 1) % 13) + 13) % 13) + 1;
	return date;
}

/**
 * Sets the Ethiopian day.
 * * `date` is Ethiopian date
 * * `day` incremented day
 * returns NgbDate - Ethiopian date
 * */
export function setEthiopianDay(date: NgbDate, day: number): NgbDate {
	let mDays = getDaysPerMonth(date.month, date.year);
	if (day <= 0) {
		while (day <= 0) {
			date = setEthiopianMonth(date, date.month - 1);
			mDays = getDaysPerMonth(date.month, date.year);
			day += mDays;
		}
	} else if (day > mDays) {
		while (day > mDays) {
			day -= mDays;
			date = setEthiopianMonth(date, date.month + 1);
			mDays = getDaysPerMonth(date.month, date.year);
		}
	}
	date.day = day;
	return date;
}

function getDaysPerMonth(month: number, year: number): number {
	let leapYear = isEthiopianLeapYear(year);
	return DAYSPERMONTH[month - 1] + (month === 13 && leapYear ? 1 : 0);
}

export function toGregorian(ethiopianDate: NgbDate): Date {
	let jdn = ethiopianToJulian(ethiopianDate.year, ethiopianDate.month, ethiopianDate.day);
	let date = julianToGregorian(jdn);
	date.setHours(6, 30, 3, 200);
	return date;
}

export function fromGregorian(gdate: Date): NgbDate {
	let g2d = gregorianToJulian(gdate.getFullYear(), gdate.getMonth() + 1, gdate.getDate());
	return juilianToEthiopia(g2d);
}

export function ethiopianToJulian(year: number, month: number, day: number) {
	if (year < 0) {
		year++;
	} // No year zero
	return day + (month - 1) * 30 + (year - 1) * 365 + Math.floor(year / 4) + JD_EPOCH - 1;
}

function juilianToEthiopia(jd: number) {
	let c = Math.floor(jd) + 0.5 - JD_EPOCH;
	let year = Math.floor((c - Math.floor((c + 366) / 1461)) / 365) + 1;
	if (year <= 0) {
		year--;
	} // No year zero
	c = Math.floor(jd) + 0.5 - ethiopianToJulian(year, 1, 1);
	let month = Math.floor(c / 30) + 1;
	let day = c - (month - 1) * 30 + 1;
	return new NgbDate(year, month, day);
}

function julianToGregorian(jd: number) {
	let z = Math.floor(jd + 0.5);
	let a = Math.floor((z - 1867216.25) / 36524.25);
	a = z + 1 + a - Math.floor(a / 4);
	let b = a + 1524;
	let c = Math.floor((b - 122.1) / 365.25);
	let d = Math.floor(365.25 * c);
	let e = Math.floor((b - d) / 30.6001);
	let day = b - d - Math.floor(e * 30.6001);
	let month = e - (e > 13.5 ? 13 : 1);
	let year = c - (month > 2.5 ? 4716 : 4715);
	if (year <= 0) {
		year--;
	} // No year zero
	return new Date(year, month, day);
}

export function gregorianToJulian(year: number, month: number, day: number) {
	if (year < 0) {
		year++;
	} // No year zero
	// Jean Meeus algorithm, "Astronomical Algorithms", 1991
	if (month < 3) {
		month += 12;
		year--;
	}
	let a = Math.floor(year / 100);
	let b = 2 - a + Math.floor(a / 4);
	return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + b - 1524.5;
}
