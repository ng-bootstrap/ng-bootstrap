import { Component } from '@angular/core';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-pagination-justify',
	imports: [NgbPaginationModule],
	templateUrl: './pagination-justify.html',
})
export class NgbdPaginationJustify {
	page = 4;
}
