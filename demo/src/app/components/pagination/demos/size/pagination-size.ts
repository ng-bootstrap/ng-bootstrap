import {Component} from '@angular/core';
import {NGB_PAGINATION_DIRECTIVES} from '@ng-bootstrap/pagination';

@Component({
  selector: 'ngbd-pagination-size',
  template: require('./pagination-size.html'),
  directives: [NGB_PAGINATION_DIRECTIVES]
})
export class NgbdPaginationSize {
  currentPage = 3;
}
