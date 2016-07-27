import {Component} from '@angular/core';
import {NGB_TABSET_DIRECTIVES, NgbTabChangeEvent} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-tabset-preventchange',
  templateUrl: './tabset-preventchange.html',
  directives: [NGB_TABSET_DIRECTIVES]
})
export class NgbdTabsetPreventchange {
    public beforeChange($event: NgbTabChangeEvent) {
      if ($event.nextId === 'bar') {
        $event.preventDefault();
      }
    };
}
