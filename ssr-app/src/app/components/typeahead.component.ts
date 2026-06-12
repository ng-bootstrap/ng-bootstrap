import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap/typeahead';
import { FormsModule } from '@angular/forms';

const VALUES = ['one', 'two', 'three'];

@Component({
	selector: 'typeahead-component',
	imports: [FormsModule, NgbTypeahead],
	template: `
		<input id="typeahead-basic" type="text" class="form-control" [(ngModel)]="model" [ngbTypeahead]="search" />
	`,
})
export class TypeaheadComponent {
	model = 'one';

	search = (text$: Observable<string>) =>
		text$.pipe(map((term) => VALUES.filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)));
}
