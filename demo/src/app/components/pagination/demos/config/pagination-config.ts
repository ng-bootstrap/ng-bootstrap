import { Component } from '@angular/core';
import { NgbPaginationConfig, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'ngbd-pagination-config',
    imports: [NgbPaginationModule],
    templateUrl: './pagination-config.html',
    providers: [NgbPaginationConfig]
})
export class NgbdPaginationConfig {
	page = 4;

	constructor(config: NgbPaginationConfig) {
		// customize default values of paginations used by this component tree
		config.size = 'sm';
		config.boundaryLinks = true;
	}
}
