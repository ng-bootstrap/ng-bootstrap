import { Component } from '@angular/core';
import {
	NgbPagination,
	NgbPaginationNext,
	NgbPaginationNumber,
	NgbPaginationPrevious,
	NgbPaginationPages,
} from '@ng-bootstrap/ng-bootstrap/pagination';

const FILTER_PAG_REGEX = /[^0-9]/g;

@Component({
	selector: 'ngbd-pagination-customization',
	imports: [NgbPagination, NgbPaginationNext, NgbPaginationNumber, NgbPaginationPrevious, NgbPaginationPages],
	templateUrl: './pagination-customization.html',
})
export class NgbdPaginationCustomization {
	page = 4;

	getPageSymbol(current: number) {
		return ['A', 'B', 'C', 'D', 'E', 'F', 'G'][current - 1];
	}

	selectPage(page: string) {
		this.page = parseInt(page, 10) || 1;
	}

	formatInput(input: HTMLInputElement) {
		input.value = input.value.replace(FILTER_PAG_REGEX, '');
	}
}
