import { Component } from '@angular/core';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'ngbd-pagination-size',
    imports: [NgbPaginationModule],
    templateUrl: './pagination-size.html'
})
export class NgbdPaginationSize {
	page = 3;
}
