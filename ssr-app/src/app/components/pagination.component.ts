import { Component } from '@angular/core';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'pagination-component',
    imports: [NgbPaginationModule],
    template: ` <ngb-pagination [collectionSize]="70" [(page)]="page" [boundaryLinks]="true"></ngb-pagination> `
})
export class PaginationComponent {
	page = 4;
}
