import {Component, Injectable} from '@angular/core';
import {NgbDateStruct, NgbCalendar, NgbCalendarIslamicCivil, NgbCalendarIslamicUmalqura,
   NgbDatepickerI18n} from '@ng-bootstrap/ng-bootstrap';


const I18N_VALUES = {
  en: {
    weekdays: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
    months: ['Muh.', 'Saf.', 'Rab. I', 'Rab. II', 'Jum. I', 'Jum. II', 'Raj.', 'Sha.', 'Ram.', 'Shaw.', 'Dhuʻl-Q.', 'Dhuʻl-H.']
  },
  ar: {
    weekdays: ['ن', 'ث', 'ر', 'خ', 'ج', 'س', 'ح'],
    months: ['محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر', 'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان', 'رمضان', 'شوال',
     'ذو القعدة', 'ذو الحجة']
  }
};

@Injectable()
export class I18n {
  language = 'en';
}

@Injectable()
export class IslamicI18n extends NgbDatepickerI18n {

  constructor(private _i18n: I18n) {
    super();
  }

  getWeekdayShortName(weekday: number) {
     return I18N_VALUES[this._i18n.language].weekdays[weekday - 1];
  }

  getMonthShortName(month: number) {
    return I18N_VALUES[this._i18n.language].months[month - 1];
  }

  getMonthFullName(month: number) {
    return this.getMonthShortName(month);
  }
}

@Component({
  selector: 'ngbd-islamic-civil',
  templateUrl: './islamic-calendars.html',
  providers: [I18n,
    {provide: NgbCalendar, useClass: NgbCalendarIslamicCivil},
    {provide: NgbDatepickerI18n, useClass: IslamicI18n}
  ]
})
export class NgbdIslamicCivil {

  private today: NgbDateStruct;

  name: string = 'Civil';
  model: NgbDateStruct;
  date: {year: number, month: number};

  constructor(private _i18n: I18n, calendar: NgbCalendar) {
    this.today = calendar.getToday();
  }

  set language(language: string) {
    this._i18n.language = language;
  }

  get language() {
    return this._i18n.language;
  }
  selectToday() {
    this.model = {
      year: this.today.year,
      month: this.today.month,
      day: this.today.day
    };
  }
}

@Component({
  selector: 'ngbd-islamic-umalqura',
  templateUrl: './islamic-calendars.html',
  providers: [I18n,
    {provide: NgbCalendar, useClass: NgbCalendarIslamicUmalqura},
    {provide: NgbDatepickerI18n, useClass: IslamicI18n}
  ]
})
export class NgbdIslamicUmalqura extends NgbdIslamicCivil {
  constructor(_i18n: I18n, calendar: NgbCalendar) {
    super(_i18n, calendar);
    this.name = 'Umalqura';
  }

}
