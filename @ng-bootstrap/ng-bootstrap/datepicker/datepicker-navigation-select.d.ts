import { EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { NgbDate } from './ngb-date';
import { NgbDatepickerI18n } from './datepicker-i18n';
import { NgbCalendar } from './ngb-calendar';
export declare class NgbDatepickerNavigationSelect implements OnChanges {
    i18n: NgbDatepickerI18n;
    private calendar;
    months: number[];
    years: number[];
    date: NgbDate;
    disabled: boolean;
    maxDate: NgbDate;
    minDate: NgbDate;
    select: EventEmitter<NgbDate>;
    constructor(i18n: NgbDatepickerI18n, calendar: NgbCalendar);
    ngOnChanges(changes: SimpleChanges): void;
    changeMonth(month: string): void;
    changeYear(year: string): void;
    private _generateMonths();
    private _generateYears();
}
