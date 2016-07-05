import {Component} from '@angular/core';
import {NGB_PAGINATION_DIRECTIVES} from '@ng-bootstrap/pagination';

@Component({
  selector: 'ngbd-pagination-basic',
  template: require('./pagination-basic.html'),
  directives: [NGB_PAGINATION_DIRECTIVES]
})
export class NgbdPaginationBasic {
  page = 4;
}
