import { Component } from '@angular/core';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-pagination-advanced',
	imports: [NgbPaginationModule],
	templateUrl: './pagination-advanced.html',
})
export class NgbdPaginationAdvanced {
	page = 1;
}
