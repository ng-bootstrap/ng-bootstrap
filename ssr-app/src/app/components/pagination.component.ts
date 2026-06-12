import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap/pagination';

@Component({
	selector: 'pagination-component',
	imports: [NgbPagination],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: ` <ngb-pagination [collectionSize]="70" [(page)]="page" [boundaryLinks]="true"></ngb-pagination> `,
})
export class PaginationComponent {
	page = 4;
}
