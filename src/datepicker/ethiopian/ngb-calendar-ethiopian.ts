import { Injectable } from '@angular/core';
import { isInteger } from '../../util/util';
import { NgbCalendar, NgbPeriod } from '../ngb-calendar';
import { NgbDate } from '../ngb-date';
import {
	ethiopianToJulian,
	fromGregorian,
	setEthiopianDay,
	setEthiopianMonth,
	setEthiopianYear,
	toGregorian,
} from './ethiopian';

@Injectable()
export class NgbCalendarEthiopian extends NgbCalendar {
	getDaysPerWeek(): number {
		return 7;
	}

	getMonths(year?: number | undefined): number[] {
		return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
	}

	getNext(date: NgbDate, period: NgbPeriod = 'd', number = 1): NgbDate {
		date = new NgbDate(date.year, date.month, date.day);
		switch (period) {
			case 'y':
				date = setEthiopianYear(date, date.year + number);
				date.month = 1;
				date.day = 1;
				return date;
			case 'm':
				date = setEthiopianMonth(date, date.month + number);
				date.day = 1;
				return date;
			case 'd':
				return setEthiopianDay(date, date.day + number);
			default:
				return date;
		}
	}
	getPrev(date: NgbDate, period: NgbPeriod = 'd', number = 1) {
		return this.getNext(date, period, -number);
	}

	getWeekday(date: NgbDate): number {
		const dt = Math.floor(ethiopianToJulian(date.year, date.month, date.day) + 3) % 7;
		return dt === 0 ? 7 : dt;
	}

	getWeekNumber(week: readonly NgbDate[], firstDayOfWeek: number): number {
		if (firstDayOfWeek === 7) {
			firstDayOfWeek = 0;
		}

		const thursdayIndex = (4 + 7 - firstDayOfWeek) % 7;
		const date = week[thursdayIndex];
		const jsDate = toGregorian(date);
		jsDate.setDate(jsDate.getDate() + 4 - (jsDate.getDay() || 7)); // Thursday
		const time = jsDate.getTime();
		const startDate = toGregorian(new NgbDate(date.year, 1, 1));
		return Math.floor(Math.round((time - startDate.getTime()) / 86400000) / 7) + 1;
	}

	getWeeksPerMonth() {
		return 6;
	}

	getToday(): NgbDate {
		return fromGregorian(new Date());
	}

	isValid(date: NgbDate): boolean {
		return (
			date &&
			isInteger(date.year) &&
			isInteger(date.month) &&
			isInteger(date.day) &&
			!isNaN(toGregorian(date).getTime())
		);
	}
}
