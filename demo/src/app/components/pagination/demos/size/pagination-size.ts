import {Component} from '@angular/core';
import {NGB_PAGINATION_DIRECTIVES} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-pagination-size',
  templateUrl: './pagination-size.html',
  directives: [NGB_PAGINATION_DIRECTIVES]
})
export class NgbdPaginationSize {
  currentPage = 3;
}
