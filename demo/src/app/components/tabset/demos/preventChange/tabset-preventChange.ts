import {Component} from '@angular/core';
import {NGB_TABSET_DIRECTIVES} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-tabset-preventChange',
  template: require('./tabset-preventChange.html'),
  directives: [NGB_TABSET_DIRECTIVES]
})
export class NgbdTabsetPreventChange {
    public preventChange(event) {
      event.preventDefault();
    };
}
