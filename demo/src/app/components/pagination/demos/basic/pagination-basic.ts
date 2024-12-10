import { Component } from '@angular/core';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-pagination-basic',
	imports: [NgbPaginationModule],
	templateUrl: './pagination-basic.html',
})
export class NgbdPaginationBasic {
	page = 4;
}
