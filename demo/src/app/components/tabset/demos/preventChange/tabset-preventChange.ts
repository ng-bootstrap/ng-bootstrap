import {Component} from '@angular/core';
import {NGB_TABSET_DIRECTIVES, NgbTabChangeEvent} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-tabset-preventChange',
  template: require('./tabset-preventChange.html'),
  directives: [NGB_TABSET_DIRECTIVES]
})
export class NgbdTabsetPreventChange {
    public beforeChange($event: NgbTabChangeEvent) {
      if ($event.nextId === 'bar') {
        $event.preventDefault();
      }
    };
}
