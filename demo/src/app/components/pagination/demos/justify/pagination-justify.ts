import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap/pagination';

@Component({
	selector: 'ngbd-pagination-justify',
	imports: [NgbPagination],
	changeDetection: ChangeDetectionStrategy.Eager,
	templateUrl: './pagination-justify.html',
})
export class NgbdPaginationJustify {
	page = 4;
}
