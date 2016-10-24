import { NgbDate } from './ngb-date';
export declare type DayViewModel = {
    date: NgbDate;
    disabled: boolean;
};
export declare type WeekViewModel = {
    number: number;
    days: DayViewModel[];
};
export declare type MonthViewModel = {
    number: number;
    year: number;
    weeks: WeekViewModel[];
    weekdays: number[];
};
export declare enum NavigationEvent {
    PREV = 0,
    NEXT = 1,
}
