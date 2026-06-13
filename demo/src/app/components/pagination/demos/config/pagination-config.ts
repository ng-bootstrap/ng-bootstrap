import { Component, inject, signal } from '@angular/core';
import { NgbPaginationConfig, NgbPagination } from '@ng-bootstrap/ng-bootstrap/pagination';

@Component({
	selector: 'ngbd-pagination-config',
	imports: [NgbPagination],
	templateUrl: './pagination-config.html',
	providers: [NgbPaginationConfig],
})
export class NgbdPaginationConfig {
	readonly page = signal(4);

	constructor() {
		// customize default values of paginations used by this component tree
		const config = inject(NgbPaginationConfig);
		config.size = 'sm';
		config.boundaryLinks = true;
	}
}
