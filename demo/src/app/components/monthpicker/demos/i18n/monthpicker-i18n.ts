import { Component, Injectable } from '@angular/core';
import {
	NgbAlertModule,
	NgbMonthpickerModule,
	NgbDateStruct,
	NgbMonthpickerI18n,
	NgbMonthStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

const I18N_VALUES = {
	fr: {
		months: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aou', 'Sep', 'Oct', 'Nov', 'Déc'],
	},
	// other languages you would support
};

// Define a service holding the language. You probably already have one if your app is i18ned. Or you could also
// use the Angular LOCALE_ID value
@Injectable()
export class I18n {
	language = 'fr';
}

// Define custom service providing the months translations
@Injectable()
export class CustomMonthpickerI18n extends NgbMonthpickerI18n {
	constructor(private _i18n: I18n) {
		super();
	}

	getMonthShortName(month: number): string {
		return I18N_VALUES[this._i18n.language].months[month - 1];
	}
	getMonthFullName(month: number): string {
		return this.getMonthShortName(month);
	}
	getDayAriaLabel(date: NgbDateStruct): string {
		return `${date.day}-${date.month}-${date.year}`;
	}
}

@Component({
	selector: 'ngbd-monthpicker-i18n',
	standalone: true,
	imports: [NgbMonthpickerModule, NgbAlertModule, FormsModule],
	templateUrl: './monthpicker-i18n.html',
	providers: [I18n, { provide: NgbMonthpickerI18n, useClass: CustomMonthpickerI18n }], // define custom NgbMonthpickerI18n provider
})
export class NgbdMonthpickerI18n {
	model: NgbMonthStruct;
}
