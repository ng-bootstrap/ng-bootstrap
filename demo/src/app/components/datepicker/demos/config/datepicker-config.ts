import { Component } from '@angular/core';
import {
	NgbCalendar,
	NgbDate,
	NgbDatepickerConfig,
	NgbDatepickerModule,
	NgbDateStruct,
	NgbInputDatepickerConfig,
} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@Component({
	selector: 'ngbd-datepicker-config',
	standalone: true,
	imports: [NgbDatepickerModule, FormsModule],
	templateUrl: './datepicker-config.html',
	providers: [NgbInputDatepickerConfig, NgbDatepickerConfig], // add config to the component providers
})
export class NgbdDatepickerConfig {
	model: NgbDateStruct;

	constructor(inputConfig: NgbInputDatepickerConfig, config: NgbDatepickerConfig, calendar: NgbCalendar) {
		// customize default values of datepickers used by this component tree
		config.minDate = { year: 1900, month: 1, day: 1 };
		config.maxDate = { year: 2099, month: 12, day: 31 };

		// days that don't belong to current month are not visible
		config.outsideDays = 'hidden';

		// weekends are disabled
		config.markDisabled = (date: NgbDate) => calendar.getWeekday(date) >= 6;

		// setting datepicker popup to close only on click outside
		inputConfig.autoClose = 'outside';

		// setting datepicker popup to open above the input
		inputConfig.placement = ['top-start', 'top-end'];
	}
}
