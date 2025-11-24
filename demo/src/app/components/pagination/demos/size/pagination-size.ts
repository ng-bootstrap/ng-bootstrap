import { Component } from '@angular/core';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap/pagination';

@Component({
	selector: 'ngbd-pagination-size',
	imports: [NgbPagination],
	templateUrl: './pagination-size.html',
})
export class NgbdPaginationSize {
	page = 3;
}
