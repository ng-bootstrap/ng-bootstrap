import {Component} from '@angular/core';
import {NGB_PAGINATION_DIRECTIVES} from '@ng-bootstrap/pagination';

@Component({
  selector: 'ngbd-pagination-advanced',
  template: require('./pagination-advanced.html'),
  directives: [NGB_PAGINATION_DIRECTIVES]
})
export class NgbdPaginationAdvanced {
  page = 1;
}
