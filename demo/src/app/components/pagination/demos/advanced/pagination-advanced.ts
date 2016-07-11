import {Component} from '@angular/core';
import {NGB_PAGINATION_DIRECTIVES} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-pagination-advanced',
  templateUrl: './pagination-advanced.html',
  directives: [NGB_PAGINATION_DIRECTIVES]
})
export class NgbdPaginationAdvanced {
  page = 1;
}
