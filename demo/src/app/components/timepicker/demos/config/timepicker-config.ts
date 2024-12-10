import { Component } from '@angular/core';
import { NgbTimepickerConfig, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@Component({
	selector: 'ngbd-timepicker-config',
	imports: [NgbTimepickerModule, FormsModule],
	templateUrl: './timepicker-config.html',
	providers: [NgbTimepickerConfig],
})
export class NgbdTimepickerConfig {
	time: NgbTimeStruct = { hour: 13, minute: 30, second: 0 };

	constructor(config: NgbTimepickerConfig) {
		// customize default values of ratings used by this component tree
		config.seconds = true;
		config.spinners = false;
	}
}
