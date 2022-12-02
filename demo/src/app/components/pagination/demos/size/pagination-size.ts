import { Component } from '@angular/core';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-pagination-size',
	standalone: true,
	imports: [NgbPaginationModule],
	templateUrl: './pagination-size.html',
})
export class NgbdPaginationSize {
	currentPage = 3;
}
