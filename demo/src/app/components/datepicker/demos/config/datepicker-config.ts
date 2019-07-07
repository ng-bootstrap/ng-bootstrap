import {Component} from '@angular/core';
import {
  NgbDatepickerConfig,
  NgbCalendar,
  NgbDate,
  NgbDateStruct,
  NgbInputDatepickerConfig
} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-datepicker-config',
  templateUrl: './datepicker-config.html',
  providers: [NgbDatepickerConfig] // add NgbDatepickerConfig to the component providers
})
export class NgbdDatepickerConfig {

  model: NgbDateStruct;

  constructor(
      datepickerConfig: NgbDatepickerConfig, inputDatepickerConfig: NgbInputDatepickerConfig, calendar: NgbCalendar) {
    // customize default values of datepickers used by this component tree
    datepickerConfig.minDate = {year: 1900, month: 1, day: 1};
    datepickerConfig.maxDate = {year: 2099, month: 12, day: 31};

    // days that don't belong to current month are not visible
    datepickerConfig.outsideDays = 'hidden';

    // weekends are disabled
    datepickerConfig.markDisabled = (date: NgbDate) => calendar.getWeekday(date) >= 6;

    // setting datepicker popup to close only on click outside
    inputDatepickerConfig.autoClose = 'outside';

    // setting datepicker popup to open above the input
    inputDatepickerConfig.placement = ['top-left', 'top-right'];
  }
}
