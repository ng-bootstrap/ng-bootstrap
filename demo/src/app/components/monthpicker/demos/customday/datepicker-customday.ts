import { Component } from '@angular/core';
import { NgbCalendar, NgbDate, NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@Component({
	selector: 'ngbd-datepicker-customday',
	standalone: true,
	imports: [NgbDatepickerModule, FormsModule],
	templateUrl: './datepicker-customday.html',
	styles: [
		`
			.custom-day {
				text-align: center;
				padding: 0.185rem 0.25rem;
				border-radius: 0.25rem;
				display: inline-block;
				width: 2rem;
			}
			.custom-day:hover,
			.custom-day.focused {
				background-color: #e6e6e6;
			}
			.weekend {
				background-color: #f0ad4e;
				border-radius: 1rem;
				color: white;
			}
			.hidden {
				display: none;
			}
		`,
	],
})
export class NgbdDatepickerCustomday {
	model: NgbDateStruct;

	constructor(private calendar: NgbCalendar) {}

	isDisabled = (date: NgbDate, current: { month: number; year: number }) => date.month !== current.month;
	isWeekend = (date: NgbDate) => this.calendar.getWeekday(date) >= 6;
}
