import { Component } from '@angular/core';
import { NgbTimepickerConfig, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
	selector: 'ngbd-timepicker-config',
	standalone: true,
	imports: [NgbTimepickerModule, FormsModule, JsonPipe],
	templateUrl: './timepicker-config.html',
	providers: [NgbTimepickerConfig], // add NgbTimepickerConfig to the component providers
})
export class NgbdTimepickerConfig {
	time: NgbTimeStruct = { hour: 13, minute: 30, second: 0 };

	constructor(config: NgbTimepickerConfig) {
		// customize default values of ratings used by this component tree
		config.seconds = true;
		config.spinners = false;
	}
}
