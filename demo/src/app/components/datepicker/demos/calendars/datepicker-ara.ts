import {Component, Injectable} from '@angular/core';
import {NgbDateStruct, NgbCalendar, NgbCalendarIslamicCivil, NgbDatepickerI18n, NgbDatepickerConfig} from '@ng-bootstrap/ng-bootstrap';

const WEEKDAYS_SHORT = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const MONTHS_SHORT = ['Muh.', 'Saf.', 'Rab. I', 'Rab. II', 'Jum. I', 'Jum. II', 'Raj.', 'Sha.', 'Ram.', 'Shaw.', 'Dhuʻl-Q.', 'Dhuʻl-H.'];
const MONTHS_FULL = [
  'Muharram', 'Safar', 'Rabiʻ I', 'Rabiʻ II', 'Jumada I', 'Jumada II', 'Rajab', 'Shaʻban', 'Ramadan', 'Shawwal', 'Dhuʻl-Qiʻdah',
  'Dhuʻl-Hijjah'
];

@Injectable()
export class IslamicCivilI18n extends NgbDatepickerI18n {


  getWeekdayShortName(weekday: number) {
    return WEEKDAYS_SHORT[weekday - 1];
  }

  getMonthShortName(month: number) {
    return MONTHS_SHORT[month - 1];
  }

  getMonthFullName(month: number) {
    return MONTHS_FULL[month - 1];
  }
}

@Component({
  selector: 'ngbd-datepicker-ara',
  templateUrl: './datepicker-ara.html',
  providers: [NgbDatepickerConfig,
    {provide: NgbCalendar, useClass: NgbCalendarIslamicCivil},
    {provide: NgbDatepickerI18n, useClass: IslamicCivilI18n}
  ]
})

export class NgbdDatepickerAra {

  private today: NgbDateStruct;

  model: NgbDateStruct;
  date: {year: number, month: number};

  constructor(calendar: NgbCalendar, config: NgbDatepickerConfig) {
    config.showWeekNumbers = true;
    this.today = this.date = calendar.getToday();
  }

  selectToday() {
    this.model = {
      year: this.today.year,
      month: this.today.month,
      day: this.today.day
    };
  }
}
