import { Component } from '@angular/core';
import { NgbPaginationConfig, NgbPagination } from '@ng-bootstrap/ng-bootstrap/pagination';

@Component({
	selector: 'ngbd-pagination-config',
	imports: [NgbPagination],
	templateUrl: './pagination-config.html',
	providers: [NgbPaginationConfig],
})
export class NgbdPaginationConfig {
	page = 4;

	constructor(config: NgbPaginationConfig) {
		// customize default values of paginations used by this component tree
		config.size = 'sm';
		config.boundaryLinks = true;
	}
}
