import { NgbDatepickerI18n } from '../datepicker-i18n';
import { Injectable } from '@angular/core';
import { NgbDateStruct } from '../../index';
import { TranslationWidth } from '@angular/common';

const WEEKDAYS = ['እሑድ', 'ሰኞ', 'ማክሰኞ', 'ረቡዕ', 'ሓሙስ', 'ዓርብ', 'ቅዳሜ'];
const MONTHS = ['መስከረም', 'ጥቅምት', 'ኅዳር', 'ታህሣሥ', 'ጥር', 'የካቲት', 'መጋቢት', 'ሚያዝያ', 'ግንቦት', 'ሰኔ', 'ሐምሌ', 'ነሐሴ', 'ጳጉሜ'];

@Injectable()
export class NgbDatepickerI18nAmharic extends NgbDatepickerI18n {
	getMonthShortName(month: number, year?: number | undefined): string {
		return this.getMonthFullName(month, year);
	}

	getMonthFullName(month: number, year?: number | undefined): string {
		return MONTHS[month - 1];
	}

	getWeekdayLabel(weekday: number, width?: TranslationWidth | undefined): string {
		return WEEKDAYS[weekday - 1];
	}

	getDayAriaLabel(date: NgbDateStruct): string {
		return `${date.day} ${this.getMonthFullName(date.month, date.year)} ${date.year}`;
	}
}
