import { NgbDate } from './ngb-date';
export declare type NgbPeriod = 'y' | 'm' | 'd';
export declare abstract class NgbCalendar {
    abstract getDaysPerWeek(): number;
    abstract getMonths(): number[];
    abstract getWeeksPerMonth(): number;
    abstract getWeekday(date: NgbDate): number;
    abstract getNext(date: NgbDate, period?: NgbPeriod, number?: number): NgbDate;
    abstract getPrev(date: NgbDate, period?: NgbPeriod, number?: number): NgbDate;
    abstract getWeekNumber(week: NgbDate[], firstDayOfWeek: number): number;
    abstract getToday(): NgbDate;
}
export declare class NgbCalendarGregorian extends NgbCalendar {
    getDaysPerWeek(): number;
    getMonths(): number[];
    getWeeksPerMonth(): number;
    getNext(date: NgbDate, period?: NgbPeriod, number?: number): NgbDate;
    getPrev(date: NgbDate, period?: NgbPeriod, number?: number): NgbDate;
    getWeekday(date: NgbDate): number;
    getWeekNumber(week: NgbDate[], firstDayOfWeek: number): number;
    getToday(): NgbDate;
}
