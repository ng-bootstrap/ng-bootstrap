import { Component, inject, Injectable } from '@angular/core';
import {
	NgbCalendar,
	NgbCalendarIslamicUmalqura,
	NgbDatepickerI18n,
	NgbDatepickerModule,
	NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';

const WEEKDAYS = ['ن', 'ث', 'ر', 'خ', 'ج', 'س', 'ح'];
const MONTHS = [
	'محرم',
	'صفر',
	'ربيع الأول',
	'ربيع الآخر',
	'جمادى الأولى',
	'جمادى الآخرة',
	'رجب',
	'شعبان',
	'رمضان',
	'شوال',
	'ذو القعدة',
	'ذو الحجة',
];

@Injectable()
export class IslamicI18n extends NgbDatepickerI18n {
	getMonthShortName(month: number) {
		return MONTHS[month - 1];
	}

	getMonthFullName(month: number) {
		return MONTHS[month - 1];
	}

	getWeekdayLabel(weekday: number) {
		return WEEKDAYS[weekday - 1];
	}

	getDayAriaLabel(date: NgbDateStruct): string {
		return `${date.day}-${date.month}-${date.year}`;
	}
}

@Component({
	selector: 'ngbd-datepicker-islamicumalqura',
	imports: [NgbDatepickerModule, FormsModule, JsonPipe],
	templateUrl: './datepicker-islamicumalqura.html',
	providers: [
		{ provide: NgbCalendar, useClass: NgbCalendarIslamicUmalqura },
		{ provide: NgbDatepickerI18n, useClass: IslamicI18n },
	],
})
export class NgbdDatepickerIslamicumalqura {
	today = inject(NgbCalendar).getToday();
	model: NgbDateStruct;
}
