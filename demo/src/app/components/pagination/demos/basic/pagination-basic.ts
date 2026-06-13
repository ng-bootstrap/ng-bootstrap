import { Component, signal } from '@angular/core';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap/pagination';

@Component({
	selector: 'ngbd-pagination-basic',
	imports: [NgbPagination],
	templateUrl: './pagination-basic.html',
})
export class NgbdPaginationBasic {
	readonly page = signal(4);
}
