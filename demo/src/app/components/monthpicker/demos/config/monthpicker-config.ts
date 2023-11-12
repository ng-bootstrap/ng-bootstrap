import { Component } from '@angular/core';
import { NgbMonthpickerModule, NgbMonthStruct, NgbInputMonthpickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@Component({
	selector: 'ngbd-monthpicker-config',
	standalone: true,
	imports: [NgbMonthpickerModule, FormsModule],
	templateUrl: './monthpicker-config.html',
	providers: [NgbInputMonthpickerConfig], // add config to the component providers
})
export class NgbdMonthpickerConfig {
	model: NgbMonthStruct;

	constructor(config: NgbInputMonthpickerConfig) {
		// customize default values of datepickers used by this component tree
		config.minDate = { year: 1900, month: 1 };
		config.maxDate = { year: 2099, month: 12 };

		// setting datepicker popup to close only on click outside
		config.autoClose = 'outside';

		// setting datepicker popup to open above the input
		config.placement = ['top-start', 'top-end'];
	}
}
