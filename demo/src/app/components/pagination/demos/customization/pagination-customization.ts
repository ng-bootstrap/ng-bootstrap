import { Component } from '@angular/core';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgIf } from '@angular/common';

const FILTER_PAG_REGEX = /[^0-9]/g;

@Component({
	selector: 'ngbd-pagination-customization',
	standalone: true,
	imports: [NgbPaginationModule, NgIf],
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
