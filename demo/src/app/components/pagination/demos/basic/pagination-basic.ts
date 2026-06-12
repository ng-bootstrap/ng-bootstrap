import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap/pagination';

@Component({
	selector: 'ngbd-pagination-basic',
	imports: [NgbPagination],
	changeDetection: ChangeDetectionStrategy.Eager,
	templateUrl: './pagination-basic.html',
})
export class NgbdPaginationBasic {
	page = 4;
}
