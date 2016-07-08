import {Component} from '@angular/core';
import {NGB_TABSET_DIRECTIVES} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-tabset-selectById',
  template: require('./tabset-selectById.html'),
  directives: [NGB_TABSET_DIRECTIVES]
})
export class NgbdTabsetSelectById {
  availableIds: string[] = [ 'foo', 'bar'];
  selectedId: string = 'bar';

  public selectById() {
    this.selectedId = this.availableIds.filter(value => value !== this.selectedId)[0];
  }

}
