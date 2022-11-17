import { Component } from '@angular/core';
import { NgbPaginationConfig, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-pagination-config',
	standalone: true,
	imports: [NgbPaginationModule],
	templateUrl: './pagination-config.html',
	providers: [NgbPaginationConfig], // add NgbPaginationConfig to the component providers
})
export class NgbdPaginationConfig {
	page = 4;

	constructor(config: NgbPaginationConfig) {
		// customize default values of paginations used by this component tree
		config.size = 'sm';
		config.boundaryLinks = true;
	}
}
