import { Component } from '@angular/core';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap/pagination';

@Component({
	selector: 'ngbd-pagination-disabled',
	imports: [NgbPagination],
	templateUrl: './pagination-disabled.html',
})
export class NgbdPaginationDisabled {
	page = 3;
	isDisabled = true;

	toggleDisabled() {
		this.isDisabled = !this.isDisabled;
	}
}
