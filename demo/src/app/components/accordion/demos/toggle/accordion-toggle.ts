import {Component} from '@angular/core';
import {NGB_ACCORDION_DIRECTIVES} from '@ng-bootstrap/accordion';

@Component({
  selector: 'ngbd-accordion-toggle',
  template: require('./accordion-toggle.html'),
  directives: [NGB_ACCORDION_DIRECTIVES]
})
export class NgbdAccordionToggle {
}
