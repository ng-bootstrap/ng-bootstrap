/**
 * Created by mehrabisajad on 2017/03/28.
 */
import {NgbDate} from '../ngb-date';
import {NgbPeriod, NgbCalendar} from '../ngb-calendar';
import {Injectable} from '@angular/core';
import {isInteger} from '../../util/util';


@Injectable()
export abstract class NgbCalendarJalali extends NgbCalendar {
    getDaysPerWeek() {
        return 7;
    }

    getMonths() {
        return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    }

    getWeeksPerMonth() {
        return 6;
    }

    isValid(date: NgbDate): boolean {
        return date && isInteger(date.year) && isInteger(date.month) && isInteger(date.day) && !isNaN(this.toGregorian(date).getTime());
    }

    setDay(date: NgbDate, day: number): NgbDate {
        let mDays = this.getDaysInJalaliMonth(date.month, date.year);
        if (day <= 0) {
            while (day <= 0) {
                date = NgbCalendarJalali.setMonth(date, date.month - 1);
                mDays = this.getDaysInJalaliMonth(date.month, date.year);
                day += mDays;
            }
        } else if (day > mDays) {
            while (day > mDays) {
                day -= mDays;
                date = NgbCalendarJalali.setMonth(date, date.month + 1);
                mDays = this.getDaysInJalaliMonth(date.month, date.year);
            }
        }
        date.day = day;
        return date;
    }

    static setMonth(date: NgbDate, month: number): NgbDate {
        month = +month;
        date.year = date.year + Math.floor((month - 1) / 12);
        date.month = Math.floor(((month - 1) % 12 + 12) % 12) + 1;
        return date;
    }

    static setYear(date: NgbDate, yearValue: number): NgbDate {
        date.year = +yearValue;
        return date;
    }

    abstract getWeekday(date: NgbDate): number;

    abstract getNext(date: NgbDate, period?: NgbPeriod, number?: number): NgbDate;

    abstract getPrev(date: NgbDate, period?: NgbPeriod, number?: number): NgbDate;

    abstract getWeekNumber(week: NgbDate[], firstDayOfWeek: number): number;

    abstract getToday(): NgbDate;

    /**
     * Returns the equivalent jalali date value for a give input Gregorian date.
     * `gDate` is s JS Date to be converted to jalali.
     */
    abstract fromGregorian(gDate: Date): NgbDate;

    /**
     * Converts the current jalali date to Gregorian.
     */
    abstract toGregorian(jalaliDate: NgbDate): Date;

    /**
     * Returns the number of days in a specific jalali month.
     */
    abstract getDaysInJalaliMonth(month: number, year: number): number;

}
