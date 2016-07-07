import {Component} from '@angular/core';
import {NGB_PAGER_DIRECTIVES} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-pager-basic',
  template: require('./pager-basic.html'),
  directives: [NGB_PAGER_DIRECTIVES]
})
export class NgbdPagerBasic {
  currentPage = 0;
}
