import {Component} from '@angular/core';
import {NgbPanelChangeEvent} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-accordion-preventchange',
  templateUrl: './accordion-preventchange.html',
})
export class NgbdAccordionPreventchange {
  public beforeChange($event: NgbPanelChangeEvent) {

    if ($event.panelId === '2') {
      $event.preventDefault();
    }

    if ($event.panelId === '3' && $event.nextState === false) {
      $event.preventDefault();
    }
  };
}
