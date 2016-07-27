import {Component} from '@angular/core';
import {NGB_ACCORDION_DIRECTIVES, NgbPanelChangeEvent} from '@ng-bootstrap/accordion';

@Component({
  selector: 'ngbd-accordion-preventchange',
  templateUrl: './accordion-preventchange.html',
  directives: [NGB_ACCORDION_DIRECTIVES]
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
