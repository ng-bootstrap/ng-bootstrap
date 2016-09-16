import {Component} from '@angular/core';
import {NgbTimepickerConfig} from '@ng-bootstrap/ng-bootstrap';
import {NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-timepicker-config',
  templateUrl: './timepicker-config.html',
  providers: [NgbTimepickerConfig] // add NgbTimepickerConfig to the component providers
})
export class NgbdTimepickerConfig {
  time: NgbTimeStruct = {hour: 13, minute: 30, second: 0};

  constructor(config: NgbTimepickerConfig) {
    // customize default values of ratings used by this component tree
    config.seconds = true;
    config.spinners = false;
  }
}
