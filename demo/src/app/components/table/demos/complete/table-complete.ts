import { AsyncPipe, DecimalPipe } from '@angular/common';
import { Component, QueryList, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs';

import { Country } from './country';
import { CountryService } from './country.service';
import { NgbdSortableHeader, SortEvent } from './sortable.directive';
import { FormsModule } from '@angular/forms';
import { NgbHighlight } from '@ng-bootstrap/ng-bootstrap/typeahead';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap/pagination';

@Component({
	selector: 'ngbd-table-complete',
	imports: [DecimalPipe, FormsModule, AsyncPipe, NgbHighlight, NgbdSortableHeader, NgbPagination],
	templateUrl: './table-complete.html',
	providers: [CountryService, DecimalPipe],
})
export class NgbdTableComplete {
	countries$: Observable<Country[]>;
	total$: Observable<number>;

	@ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

	constructor(public service: CountryService) {
		this.countries$ = service.countries$;
		this.total$ = service.total$;
	}

	onSort({ column, direction }: SortEvent) {
		// resetting other headers
		this.headers.forEach((header) => {
			if (header.sortable !== column) {
				header.direction = '';
			}
		});

		this.service.sortColumn = column;
		this.service.sortDirection = direction;
	}
}
