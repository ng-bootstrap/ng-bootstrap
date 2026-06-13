import { Component, signal } from '@angular/core';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap/pagination';

@Component({
	selector: 'ngbd-pagination-justify',
	imports: [NgbPagination],
	templateUrl: './pagination-justify.html',
})
export class NgbdPaginationJustify {
	readonly page = signal(4);
}
