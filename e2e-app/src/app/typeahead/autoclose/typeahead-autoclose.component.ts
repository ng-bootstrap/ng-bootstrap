import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

const items = ['one', 'two', 'three'];

@Component({
	standalone: true,
	imports: [FormsModule, NgbModule],
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
