import {Component} from '@angular/core';

@Component({
  selector: 'ngbd-tabset-selectbyid',
  templateUrl: './tabset-selectbyid.html'
})
export class NgbdTabsetSelectbyid {
  tabIds = ['foo', 'bar'];
  selectedId = this.tabIds[0];

  public toggleSelected() {
    this.selectedId = this.tabIds[(this.tabIds.indexOf(this.selectedId) + 1) % 2];
  }
}
