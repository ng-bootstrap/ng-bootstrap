import { Component } from '@angular/core';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-pagination-basic',
	standalone: true,
	imports: [NgbPaginationModule],
	templateUrl: './pagination-basic.html',
})
export class NgbdPaginationBasic {
	page = 4;
}
