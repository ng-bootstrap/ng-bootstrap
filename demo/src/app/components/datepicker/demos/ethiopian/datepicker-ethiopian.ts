import { Component, inject, ViewEncapsulation } from '@angular/core';
import {
	NgbCalendar,
	NgbCalendarEthiopian,
	NgbDatepickerI18n,
	NgbDatepickerI18nAmharic,
	NgbDatepickerModule,
	NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'ngbd-datepicker-ethiopian',
    imports: [NgbDatepickerModule, FormsModule, JsonPipe],
    templateUrl: './datepicker-ethiopian.html',
    encapsulation: ViewEncapsulation.None,
    styles: `
	  ngbd-datepicker-ethiopian .ngb-dp-weekday {
			font-size: x-small;
			overflow: hidden;
		}
	`,
    providers: [
        { provide: NgbCalendar, useClass: NgbCalendarEthiopian },
        { provide: NgbDatepickerI18n, useClass: NgbDatepickerI18nAmharic },
    ]
})
export class NgbdDatepickerEthiopian {
	today = inject(NgbCalendar).getToday();

	model: NgbDateStruct;
	date: { year: number; month: number };
}
