import {Component} from '@angular/core';
import {NGB_PAGER_DIRECTIVES} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-pager-align',
  template: require('./pager-align.html'),
  directives: [NGB_PAGER_DIRECTIVES]
})
export class NgbdPagerAlign {
  currentPage = 0;
}
