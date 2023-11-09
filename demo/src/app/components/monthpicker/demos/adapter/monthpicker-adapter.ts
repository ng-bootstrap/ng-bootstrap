import { Component, Injectable } from '@angular/core';
import {
	NgbMonthAdapter,
	NgbMonthParserFormatter,
	NgbMonthCalendar,
	NgbMonthStruct,
	NgbMonthpickerModule,
} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';

/**
 * This Service handles how the date is represented in scripts i.e. ngModel.
 */
@Injectable()
export class CustomAdapter extends NgbMonthAdapter<string> {
	readonly DELIMITER = '-';

	fromModel(value: string | null): NgbMonthStruct | null {
		if (value) {
			const date = value.split(this.DELIMITER);
			return {
				month: parseInt(date[0], 10),
				year: parseInt(date[1], 10),
			};
		}
		return null;
	}

	toModel(date: NgbMonthStruct | null): string | null {
		return date ? date.month + this.DELIMITER + date.year : null;
	}
}

/**
 * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
 */
@Injectable()
export class CustomMonthParserFormatter extends NgbMonthParserFormatter {
	readonly DELIMITER = '/';

	parse(value: string): NgbMonthStruct | null {
		if (value) {
			const date = value.split(this.DELIMITER);
			return {
				month: parseInt(date[0], 10),
				year: parseInt(date[1], 10),
			};
		}
		return null;
	}

	format(date: NgbMonthStruct | null): string {
		return date ? date.month + this.DELIMITER + date.year : '';
	}
}

@Component({
	selector: 'ngbd-monthpicker-adapter',
	standalone: true,
	imports: [NgbMonthpickerModule, FormsModule, JsonPipe],
	templateUrl: './monthpicker-adapter.html',

	// NOTE: For this example we are only providing current component, but probably
	// NOTE: you will want to provide your main App Module
	providers: [
		{ provide: NgbMonthAdapter, useClass: CustomAdapter },
		{ provide: NgbMonthParserFormatter, useClass: CustomMonthParserFormatter },
	],
})
export class NgbdMonthpickerAdapter {
	model1: string;
	model2: string;

	constructor(private ngbCalendar: NgbMonthCalendar, private monthAdapter: NgbMonthAdapter<string>) {}

	get today() {
		return this.monthAdapter.toModel(this.ngbCalendar.getToday())!;
	}
}
