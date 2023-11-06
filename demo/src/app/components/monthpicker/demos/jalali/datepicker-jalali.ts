import { Component, Injectable } from '@angular/core';
import {
	NgbDateStruct,
	NgbCalendar,
	NgbDatepickerI18n,
	NgbCalendarPersian,
	NgbDatepickerModule,
} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';

const MONTHS = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];

@Injectable()
export class NgbDatepickerI18nPersian extends NgbDatepickerI18n {
	getMonthShortName(month: number) {
		return MONTHS[month - 1];
	}
	getMonthFullName(month: number) {
		return MONTHS[month - 1];
	}
	getDayAriaLabel(date: NgbDateStruct): string {
		return `${date.year}-${this.getMonthFullName(date.month)}-${date.day}`;
	}
}

@Component({
	selector: 'ngbd-datepicker-jalali',
	standalone: true,
	imports: [NgbDatepickerModule, FormsModule, JsonPipe],
	templateUrl: './datepicker-jalali.html',
	providers: [
		{ provide: NgbCalendar, useClass: NgbCalendarPersian },
		{ provide: NgbDatepickerI18n, useClass: NgbDatepickerI18nPersian },
	],
})
export class NgbdDatepickerJalali {
	model: NgbDateStruct;
	date: { year: number; month: number };

	constructor(private calendar: NgbCalendar) {}

	selectToday() {
		this.model = this.calendar.getToday();
	}
}
