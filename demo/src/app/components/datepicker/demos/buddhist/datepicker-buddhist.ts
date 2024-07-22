import { Component, inject, Injectable } from '@angular/core';
import {
	NgbCalendar,
	NgbCalendarBuddhist,
	NgbDatepickerI18n,
	NgbDatepickerModule,
	NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';
import localeThai from '@angular/common/locales/th';
import { formatDate, JsonPipe, registerLocaleData } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Injectable()
export class NgbDatepickerI18nBuddhist extends NgbDatepickerI18n {
	private _locale = 'th';
	private _weekdaysShort: readonly string[];
	private _monthsShort: readonly string[];
	private _monthsFull: readonly string[];

	constructor() {
		super();

		registerLocaleData(localeThai);

		const weekdaysStartingOnSunday = [...Array(7).keys()].map((day) =>
			Intl.DateTimeFormat(this._locale, { weekday: 'narrow' }).format(new Date(Date.UTC(2021, 5, day - 1))),
		);
		this._weekdaysShort = weekdaysStartingOnSunday.map((day, index) => weekdaysStartingOnSunday[(index + 1) % 7]);

		this._monthsShort = [...Array(12).keys()].map((month) =>
			Intl.DateTimeFormat(this._locale, { month: 'short' }).format(new Date(2000, month)),
		);
		this._monthsFull = [...Array(12).keys()].map((month) =>
			Intl.DateTimeFormat(this._locale, { month: 'long' }).format(new Date(2000, month)),
		);
	}

	getMonthShortName(month: number): string {
		return this._monthsShort[month - 1] || '';
	}

	getMonthFullName(month: number): string {
		return this._monthsFull[month - 1] || '';
	}

	getWeekdayLabel(weekday: number) {
		return this._weekdaysShort[weekday - 1] || '';
	}

	getDayAriaLabel(date: NgbDateStruct): string {
		const jsDate = new Date(date.year, date.month - 1, date.day);
		return formatDate(jsDate, 'fullDate', this._locale);
	}

	getYearNumerals(year: number): string {
		return String(year);
	}
}

@Component({
	selector: 'ngbd-datepicker-buddhist',
	standalone: true,
	imports: [NgbDatepickerModule, FormsModule, JsonPipe],
	templateUrl: './datepicker-buddhist.html',
	providers: [
		{ provide: NgbCalendar, useClass: NgbCalendarBuddhist },
		{ provide: NgbDatepickerI18n, useClass: NgbDatepickerI18nBuddhist },
	],
})
export class NgbdDatepickerBuddhist {
	today = inject(NgbCalendar).getToday();

	model: NgbDateStruct;
	date: { year: number; month: number };
}
