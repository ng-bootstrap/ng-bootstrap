import {Injectable} from '@angular/core';

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

@Injectable()
export abstract class NgbDatepickerI18n {
  abstract getWeekdayName(weekday: number): string;
  abstract getMonthName(month: number): string;
}

@Injectable()
export class NgbDatepickerI18nDefault extends NgbDatepickerI18n {
  getWeekdayName(weekday: number): string { return WEEKDAYS[weekday]; }

  getMonthName(month: number): string { return MONTHS[month]; }
}
