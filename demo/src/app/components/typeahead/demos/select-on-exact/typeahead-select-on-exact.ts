import { Component } from '@angular/core';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';

const states: { name: string }[] = [
	{ name: 'Alabama' },
	{ name: 'Alaska' },
	{ name: 'Arizona' },
	{ name: 'Arkansas' },
	{ name: 'California' },
	{ name: 'Colorado' },
	{ name: 'Connecticut' },
	{ name: 'Delaware' },
	{ name: 'Florida' },
	{ name: 'Georgia' },
	{ name: 'Hawaii' },
	{ name: 'Idaho' },
	{ name: 'Illinois' },
	{ name: 'Indiana' },
	{ name: 'Iowa' },
	{ name: 'Kansas' },
	{ name: 'Kentucky' },
	{ name: 'Louisiana' },
	{ name: 'Maine' },
	{ name: 'Maryland' },
	{ name: 'Massachusetts' },
	{ name: 'Michigan' },
	{ name: 'Minnesota' },
	{ name: 'Mississippi' },
	{ name: 'Missouri' },
	{ name: 'Montana' },
	{ name: 'Nebraska' },
	{ name: 'Nevada' },
	{ name: 'New Hampshire' },
	{ name: 'New Jersey' },
	{ name: 'New Mexico' },
	{ name: 'New York' },
	{ name: 'North Carolina' },
	{ name: 'North Dakota' },
	{ name: 'Ohio' },
	{ name: 'Oklahoma' },
	{ name: 'Oregon' },
	{ name: 'Pennsylvania' },
	{ name: 'Rhode Island' },
	{ name: 'South Carolina' },
	{ name: 'South Dakota' },
	{ name: 'Tennessee' },
	{ name: 'Texas' },
	{ name: 'Utah' },
	{ name: 'Vermont' },
	{ name: 'Virginia' },
	{ name: 'Washington' },
	{ name: 'West Virginia' },
	{ name: 'Wisconsin' },
	{ name: 'Wyoming' },
];

@Component({
	selector: 'ngbd-typeahead-select-on-exact',
	standalone: true,
	imports: [NgbTypeaheadModule, FormsModule, JsonPipe],
	templateUrl: './typeahead-select-on-exact.html',
	styles: [
		`
			.form-control {
				width: 300px;
			}
		`,
	],
})
export class NgbdTypeaheadSelectOnExact {
	public model: any;

	search: OperatorFunction<string, readonly { name }[]> = (text$: Observable<string>) =>
		text$.pipe(
			debounceTime(200),
			map((term) =>
				term === '' ? [] : states.filter((v) => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10),
			),
		);

	formatter = (x: { name: string }) => x.name;
}
