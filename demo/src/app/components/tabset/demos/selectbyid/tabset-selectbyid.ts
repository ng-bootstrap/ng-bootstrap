import {Component} from '@angular/core';
import {NGB_TABSET_DIRECTIVES} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-tabset-selectbyid',
  templateUrl: './tabset-selectbyid.html',
  directives: [NGB_TABSET_DIRECTIVES]
})
export class NgbdTabsetSelectbyid {
  tabIds = ['foo', 'bar'];
  selectedId = this.tabIds[0];

  public toggleSelected() {
    this.selectedId = this.tabIds[(this.tabIds.indexOf(this.selectedId) + 1) % 2];
  }
}
