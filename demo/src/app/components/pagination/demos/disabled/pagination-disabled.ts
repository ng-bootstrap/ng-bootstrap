import { Component } from '@angular/core';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'ngbd-pagination-disabled',
    imports: [NgbPaginationModule],
    templateUrl: './pagination-disabled.html'
})
export class NgbdPaginationDisabled {
	page = 3;
	isDisabled = true;

	toggleDisabled() {
		this.isDisabled = !this.isDisabled;
	}
}
