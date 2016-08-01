import {Component} from '@angular/core';
import {NgbTabChangeEvent} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-tabset-preventchange',
  templateUrl: './tabset-preventchange.html'
})
export class NgbdTabsetPreventchange {
    public beforeChange($event: NgbTabChangeEvent) {
      if ($event.nextId === 'bar') {
        $event.preventDefault();
      }
    };
}
