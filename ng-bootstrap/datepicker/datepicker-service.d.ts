import { NgbCalendar } from './ngb-calendar';
import { NgbDate } from './ngb-date';
import { MonthViewModel } from './datepicker-view-model';
export declare class NgbDatepickerService {
    private _calendar;
    constructor(_calendar: NgbCalendar);
    generateMonthViewModel(date: NgbDate, minDate: NgbDate, maxDate: NgbDate, firstDayOfWeek: number, markDisabled: (date: NgbDate, current: {
        month: number;
        year: number;
    }) => boolean): MonthViewModel;
    private _getFirstViewDate(date, firstDayOfWeek);
}
