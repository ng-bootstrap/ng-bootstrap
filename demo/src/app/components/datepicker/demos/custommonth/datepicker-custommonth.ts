import { Component, ViewEncapsulation } from '@angular/core';
import { NgbDatepicker, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgFor } from '@angular/common';

@Component({
	selector: 'ngbd-datepicker-custommonth',
	standalone: true,
	imports: [NgbDatepickerModule, NgFor],
	templateUrl: './datepicker-custommonth.html',
	encapsulation: ViewEncapsulation.None,
	styles: [
		`
			.ngb-dp-header {
				padding: 0;
			}
			.custom-month-grid {
				display: grid;
				grid-template-columns: auto auto;
				grid-column-gap: 1rem;
				grid-row-gap: 0.5rem;
			}
		`,
	],
})
export class NgbdDatepickerCustommonth {
	navigate(datepicker: NgbDatepicker, number: number) {
		const { state, calendar } = datepicker;
		datepicker.navigateTo(calendar.getNext(state.firstDate, 'm', number));
	}

	today(datepicker: NgbDatepicker) {
		const { calendar } = datepicker;
		datepicker.navigateTo(calendar.getToday());
	}
}
