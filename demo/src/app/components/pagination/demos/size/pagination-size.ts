import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap/pagination';

@Component({
	selector: 'ngbd-pagination-size',
	imports: [NgbPagination],
	changeDetection: ChangeDetectionStrategy.Eager,
	templateUrl: './pagination-size.html',
})
export class NgbdPaginationSize {
	page = 3;
}
