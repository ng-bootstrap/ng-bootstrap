import { Component, signal } from '@angular/core';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap/pagination';

@Component({
	selector: 'ngbd-pagination-disabled',
	imports: [NgbPagination],
	templateUrl: './pagination-disabled.html',
})
export class NgbdPaginationDisabled {
	readonly page = signal(3);
	readonly isDisabled = signal(true);

	toggleDisabled() {
		this.isDisabled.update((value) => !value);
	}
}
