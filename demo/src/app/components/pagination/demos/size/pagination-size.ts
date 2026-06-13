import { Component, signal } from '@angular/core';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap/pagination';

@Component({
	selector: 'ngbd-pagination-size',
	imports: [NgbPagination],
	templateUrl: './pagination-size.html',
})
export class NgbdPaginationSize {
	readonly page = signal(3);
}
