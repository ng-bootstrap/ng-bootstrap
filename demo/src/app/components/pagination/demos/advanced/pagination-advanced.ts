import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap/pagination';

@Component({
	selector: 'ngbd-pagination-advanced',
	imports: [NgbPagination],
	changeDetection: ChangeDetectionStrategy.Eager,
	templateUrl: './pagination-advanced.html',
})
export class NgbdPaginationAdvanced {
	page = 1;
}
