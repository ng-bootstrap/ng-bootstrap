import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap/typeahead';
import {
	NgbDropdown,
	NgbDropdownMenu,
	NgbDropdownModule,
	NgbDropdownToggle,
} from '@ng-bootstrap/ng-bootstrap/dropdown';

const items = ['one', 'two', 'three'];

@Component({
	imports: [FormsModule, NgbTypeahead, NgbDropdown, NgbDropdownMenu, NgbDropdownModule, NgbDropdownToggle],
	templateUrl: './typeahead-autoclose.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TypeaheadAutoCloseComponent {
	showHint = false;

	search(text$: Observable<string>) {
		return text$.pipe(
			map((term) =>
				(term === '' ? items : items.filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10),
			),
		);
	}
}
