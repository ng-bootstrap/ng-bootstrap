import {Component} from '@angular/core';
import {NgbDatepickerConfig, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-datepicker-config',
  templateUrl: './datepicker-config.html',
  providers: [NgbDatepickerConfig] // add NgbDatepickerConfig to the component providers
})
export class NgbdDatepickerConfig {

  model;

  constructor(config: NgbDatepickerConfig) {
    // customize default values of datepickers used by this component tree
    config.minDate = {year: 1900, month: 0, day: 1};
    config.maxDate = {year: 2099, month: 11, day: 31};

    // weekends are disabled
    config.markDisabled = (date: NgbDateStruct) => {
      const d = new Date(date.year, date.month, date.day);
      return d.getDay() === 0 || d.getDay() === 6;
    };
  }
}
